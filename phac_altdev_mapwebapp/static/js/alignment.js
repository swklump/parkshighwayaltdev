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
    tap:false,
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

// Create a dictionary linking the marker ID to the location number
var master_pointlist = [];
var marker_num = 1;
var marker_name = '';

var dict_pointlist = {}
var dict_pointlist = []

var markergroup = L.layerGroup().addTo(map);
var marker_arr = new Array();

var popupname = '';

// Add marker on click ------------------------------------------------------------------------------------------------------------------------
map.on("click", addMarker);
function addMarker(e) {
    
    popupname = dict_pointlist.length+1;
    popupname = popupname.toString();

    // Construct the popup div element
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

    var marker = new L.marker(e.latlng, {
    draggable: false
    })
    .bindTooltip(popupname,{permanent: true})
    .addTo(map)
    .bindPopup(buttonelement, {maxWidth : 560})
    .addTo(markergroup);
    marker_arr.push(marker);
    var point = new L.LatLng(e.latlng['lat'], e.latlng['lng']);
    master_pointlist.push(point);
    dict_pointlist.push(point);
    lat_point_lookup[point['lat']] = popupname;

    // send data to hidden form
    lat_lons[popupname] = point['lat'] + ',' + point['lng'];
    text_point_dict[popupname] = '';
    data_to_hidden_form(lat_lons,'latlons');
    data_to_hidden_form(text_point_dict,'textinput');

    // draw lines
    var firstpolyline = new L.Polyline(dict_pointlist, {
        color: 'blue',
        weight: 3,
        opacity: 1,
        smoothFactor: 1
    });
    firstpolyline.addTo(map);
    testinput = popupname;

    marker_num = marker_num + 1;

    marker.on("popupopen",loadText);

    // Delete button function
    btn_del.onclick =  function () {
        var key_lat = marker["_latlng"]['lat'];
        var popupnum = lat_point_lookup[key_lat];

        // Only the most recently added point can be deleted
        if (key_lat !== master_pointlist[master_pointlist.length-1]['lat']) {
            popupname = dict_pointlist.length.toString();
            alert("You can only delete the most recently created marker. If you'd like to delete this marker, delete Point "+popupname+" first, then delete this marker.");
            map.closePopup();
            return;
        }

        else {
            // Remove last item from point list
            master_pointlist.splice(master_pointlist.length-1,1);
            dict_pointlist.splice(dict_pointlist.length-1,1);
            
            // Resend data to hidden forms
            delete lat_lons[popupnum]
            delete text_point_dict[popupnum]
            data_to_hidden_form(lat_lons,'latlons')
            data_to_hidden_form(text_point_dict,'textinput')

            // Clear map of all lines
            for(i in map._layers) {
                if(map._layers[i]._path != undefined) {
                    try {
                    map.removeLayer(map._layers[i]);
                    }
                    catch(e) {
                        console.log("problem with " + e + map._layers[i]);
                    }
                }
            }

            // Redraw lines with last point deleted
            var firstpolyline = new L.Polyline(dict_pointlist, {
                color: 'blue',
                weight: 3,
                opacity: 1,
                smoothFactor: 1
            });
            firstpolyline.addTo(map);

            map.removeLayer(marker);

            // Redraw study area boundary
            draw_studyarea(map);

            marker_num = marker_num - 1;
        };
    };

    // Save text button
    btn_save.onclick =  function () {
        var key_lat = marker["_latlng"]['lat'];
        var popupnum = lat_point_lookup[key_lat];
        var s1 = document.getElementById('popuptext'+popupnum.toString());
        // send data to hidden form
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
}
