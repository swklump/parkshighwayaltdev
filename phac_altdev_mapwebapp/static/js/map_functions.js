// Clear map of all lines
function clear_map() {

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

    markergroup.clearLayers();
    document.getElementById('latlons').value = '';
    document.getElementById('textinput').value = '';

    lat_point_lookup = {};
    text_point_dict = {};
    lat_lons = {};

    // Create a dictionary linking the marker ID to the location number
    master_pointlist = [];
    marker_num = 1;
    marker_name = '';

    counter = 1;
    marker_dict = {};
    marker_num = '';

    dict_pointlist = {}
    dict_pointlist = []

    marker_arr = new Array();
        
    
    // Redraw study area
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