var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

d3.json(url).then(function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            var marker = L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            return marker;
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>Magnitude:</b> " + feature.properties.mag + "<br><b>Location:</b> " + feature.properties.place + "<br><b>Depth:</b> " + feature.geometry.coordinates[2]);
        }
    }).addTo(map);

    // Add legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

});

function getColor(depth) {
    var minDepth = -10;
    var maxDepth = 90;
    var colorScale = d3.scaleLinear()
        .domain([minDepth, maxDepth])
        .range(['#00FF00', '#FF0000']);
    return colorScale(depth);
};