//url for the earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Create a new map object
var map = L.map('map').setView([37.8, -96], 4);

// Add a base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
    
}).addTo(map);

d3.json(url).then(function (data){
    
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {

            
            // create a marker for each earthquake
            var marker = L.circleMarker(latlng, {
                radius: feature.properties.mag * 5, // adjust the size of the marker based on the magnitude
                color: getColor(feature.geometry.coordinates[2]), // set the color of the marker based on the depth
                weight: 1,
                fillOpacity: 0.8
                });
                return marker;
                },
                onEachFeature: function(feature, layer) {
                // add a popup with information about the earthquake to each marker
                layer.bindPopup("<b>Magnitude:</b> " + feature.properties.mag + "<br><b>Location:</b> " + feature.properties.place+ "<br><b>Depth:</b> "+ feature.geometry.coordinates[2]);
                }
                }).addTo(map);
                });
        function getColor(depth) {
                    if (depth < 10) {
                    return '#00FF00'; // light green
                    } else if (depth < 50) {
                    return '#FFFF00'; // yellow
                    } else if (depth < 100) {
                    return '#FFA500'; // orange
                    } else if (depth < 200) {
                    return '#FF0000'; // red
                    } else {
                    return '#8B008B'; // dark purple
                    }
                    }
//create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var colors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000', '#8B008B'];
    var labels = ['<10', '10-50', '50-100', '100-200', '>200'];

    // loop through the colors and labels and add a legend item for each
    for (var i = 0; i < colors.length; i++) {
        // create a legend item
        var legendItem = L.DomUtil.create('i', 'legend-item');
        legendItem.style.backgroundColor = colors[i];
        legendItem.innerHTML = labels[i];

        // add the legend item to the div
        div.appendChild(legendItem);
    }

    return div;
};

legend.addTo(map);

                    
