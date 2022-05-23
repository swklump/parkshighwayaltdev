
// Function to draw study area boundary
function draw_studyarea(map) {
    var pointlist = [];
    var lat_longs = {'point1':[61.568756, -149.308625], 'point 2':[61.543059,-149.308625],
    'point 3':[61.441155,-149.767024], 'point 4;': [61.589181,-149.767024], 'point5':[61.583822,-149.459094],'point6':[61.568756, -149.308625]
    };
    for (const property in lat_longs) {
        var point = new L.LatLng(lat_longs[property][0], lat_longs[property][1]);
        pointlist.push(point);
    }
    var firstpolyline = new L.Polyline(pointlist, {
        color: 'yellow',
        weight: 3,
        opacity: 1,
        smoothFactor: 1
    });
    firstpolyline.addTo(map);
}

// Function to send data to hidden forms
function data_to_hidden_form(dict_var,element_name) {
    var newstring = '';
    for (var key in dict_var) {
        newstring = newstring + key + ':' + dict_var[key] + '_';
    }
    document.getElementById(element_name).value = newstring;
}

// Start map with mapbox background
var map = L.map('map', {fullscreenControl: true,fullscreenControlOptions: {position: 'topleft'}, zoomDelta: 0.25,zoomSnap: 0, wheelPxPerZoomLevel:100, tap:false}).setView([61.521255,-149.529698], 10.5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3drbHVtcCIsImEiOiJja3Z4MGk0aTYwaGlrMnBubzYyeXA2bW91In0.UmjBh9eSwNC8BJ0p5MRF-w'
}).addTo(map);

// Draw study area boundary
draw_studyarea(map);

// Add legend
L.control.Legend({
position: "topright",
legends: [{
label: "Study area",
type: "polyline",
color: "yellow",
fillColor: "black",
weight: 5,
}]
}).addTo(map);

L.control.Legend({
    position: "bottomright",
    legends: [{
        label: "*Close an open popup before opening a second popup",
        type: "polyline",
        color: "white",
        fillColor: "black",
        weight: 1,
}]
}).addTo(map);

var lat_point_lookup = {}; // Dictionary linking a points lat and the popup name
var text_point_dict = {}; // Dictionary linking popup input text to popup number
var lat_lons = {}; // Dictionary to send to hidden form
var counter = 1;
let marker_dict = {};
var marker_num = '';
var loc_nums;
var marker;
var marker_name;
var markergroup = L.layerGroup().addTo(map);

// add marker on click
map.on("click", addMarker);
function addMarker(e) {
    loc_nums = [];
    for (const [key, value] of Object.entries(marker_dict)) {
    loc_nums.push(value)
    }
    // Set the marker name by which one is missing from "loc_nums" array
    for (let i = 1; i<100; i++) {
        if (!loc_nums.includes('Location '+i)) {
            marker_name = 'Location '+i;
            break
        }
    }

    // Construct the popup div element
    var popupname = marker_name.substring(marker_name.indexOf(' ')+1,marker_name.length)
    popupname = popupname.toString();

    var textarea = document.createElement('textarea');
    textarea.setAttribute('id','popuptext'+popupname)
    textarea.setAttribute('width','1500px')
    textarea.setAttribute('rows','4')
    textarea.setAttribute('placeholder','Enter text here...')
    
    var btn_save = document.createElement('button');
    btn_save.innerText = 'Save Text';
    btn_save.setAttribute('class','btn btn-primary btn-sm')
    var btn_del = document.createElement('button');
    btn_del.innerText = 'Delete Marker';
    btn_del.setAttribute('class','btn btn-danger btn-sm')

    var buttonelement = document.createElement('div');
    buttonelement.appendChild(textarea)
    buttonelement.appendChild(document.createElement('p'))
    buttonelement.appendChild(btn_save)
    buttonelement.appendChild(document.createElement('br'))
    buttonelement.appendChild(btn_del)

    // Add the marker to the map
    const marker = new L.marker(e.latlng, {
    draggable: false
    })
    .addTo(map)
    .bindPopup(buttonelement)
    .addTo(markergroup);
    
    // Add marker to dictionary
    marker_dict[e.latlng['lat']] = marker_name;
    var point = new L.LatLng(e.latlng['lat'], e.latlng['lng']);
    lat_point_lookup[point['lat']] = popupname;
    
    // Send data to hidden form
    lat_lons[popupname] = point['lat'] + ',' + point['lng'];
    text_point_dict[popupname] = '';
    data_to_hidden_form(lat_lons,'latlons');
    data_to_hidden_form(text_point_dict,'textinput');

    marker.on("popupopen",loadText);

    // Delete button function
    btn_del.onclick =  function () {
        const key_lat = marker["_latlng"]['lat'];
        var popupnum = lat_point_lookup[key_lat];
        delete marker_dict[key_lat];
        map.removeLayer(marker);
        counter = counter - 1;
        // Resend data to hidden forms
        delete lat_lons[popupnum]
        delete text_point_dict[popupnum]
        data_to_hidden_form(lat_lons,'latlons')
        data_to_hidden_form(text_point_dict,'textinput')
    };

    // Save text button
    btn_save.onclick =  function () {
        var key_lat = marker["_latlng"]['lat'];
        var popupnum = lat_point_lookup[key_lat];
        var s1 = document.getElementById('popuptext'+popupnum.toString());
        text_point_dict[popupnum] = s1.value;
        data_to_hidden_form(text_point_dict,'textinput')
        map.closePopup();
    };

    
}

// Load text
function loadText() {
    var key_lat = this["_latlng"]['lat'];
    var popupnum = lat_point_lookup[key_lat];
    var s1 = document.getElementById('popuptext'+popupnum.toString());
    s1.innerHTML = '';
    s1.value = '';
    if (popupnum in text_point_dict) {
        s1.innerHTML = text_point_dict[popupnum];
        s1.value = text_point_dict[popupnum];
    }
    else {
        s1.innerHTML = '';
        s1.value = '';
    }
}
