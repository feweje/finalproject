// Google Map
let map;

// Defines the maximum Medical Access Index value for each state (based on data from each states fusion table)

var maxindexarray = [172, 99, 704, 139, 1200, 285, 255, 125, 80, 366, 116, 114
    , 127, 739, 191, 116, 155, 162, 141, 73, 198, 455, 246, 177, 69, 259, 66, 122, 237, 80, 157, 121, 1815,
    125, 60, 358, 167, 152, 199, 210, 80, 76, 171, 481, 188, 101, 109, 209, 46, 478, 35];

// Execute when the DOM is fully loaded
$(document).ready(function() {

    // Styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    let styles = [

        // Hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "off"}
            ]
        }
    ];


    // Options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    let options = {
        clickableIcons: false,
        center: {lat: 39.850033, lng: -96.6500523},
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        styles: styles,
        zoom: 4,
        minZoom: 4,
        zoomControl: true
    };

    // Get DOM node in which map will be instantiated

    let canvas = $("#map-canvas").get(0);
    // Instantiate map
    map = new google.maps.Map(canvas, options);
    google.maps.event.addListenerOnce(map, "idle", configure);
});

// Adds a marker for a given state to the map and sets its county boundaries and data
function addMarker(latitude, longitude, boundary, maxindex)
{
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map,
    });
    var countylayer = new google.maps.FusionTablesLayer({
        query: {
          select: 'geometry',
          from: boundary
        },
        // Defines the shade of a county (red, orange, yellow green) depending on its medical access index value
        styles: [{
          where: `'medicalcareaccessindex' >= 0 and 'medicalcareaccessindex' < ${1*maxindex/10}`,
          // Counties with <10% of maxindex value
          polygonOptions: {
            fillColor: "#ff0000", // Red
            strokeWeight: 2,
            opacity: 0.5
          }
        }, {
          where: `'medicalcareaccessindex' >= ${1*maxindex/10} and 'medicalcareaccessindex' < ${5*maxindex/10}`,
          // Counties with 10% - <50% of maxindex value
          polygonOptions: {
            fillColor: "#ffa500", // Orange
            strokeWeight: 2,
            opacity: 0.5
          }
        }, {
          where: `'medicalcareaccessindex' >= ${5*maxindex/10} and 'medicalcareaccessindex' < ${9*maxindex/10}`,
          // Counties with 50% - <90% of maxindex value
          polygonOptions: {
            fillColor: '#ffff00', // Yellow
            strokeWeight: 2,
            opacity: 0.5
          }
        }, {
          where: `'medicalcareaccessindex' >= ${9*maxindex/10} and 'medicalcareaccessindex' < ${maxindex}`,
          // Counties with >= 90% of maxindex value
          polygonOptions: {
            fillColor: '#008000', // Green
            strokeWeight: 2,
            opacity: 0.5
          }
        }]
    });
    google.maps.event.addListener(marker, "click", function() {
        countylayer.setMap(map); // Shows county map overlay for state
        var LatLng = {lat: latitude, lng: longitude}
        map.setCenter(LatLng); // Resets center of map to state's center
        map.setZoom(6);

        // Defines legend for state
        var legend = document.createElement('div');
        legend.id = 'legend';
        var content = [];
        content.push('<div id="googft-legend">');
        content.push('<p id="googft-legend-title">Medical Care Access Index</p>');
        content.push('<div><span class="googft-legend-swatch" style="background-color: #ff0000"></span><span class="googft-legend-range">0 to ' + 1*maxindex/10 + " (Bottom 10%) " + '</span></div>');
        content.push('<div><span class="googft-legend-swatch" style="background-color: #ffa500"></span><span class="googft-legend-range">' + 1*maxindex/10 + ' to ' + 5*maxindex/10 + " (10-50%) " + '</span></div>');
        content.push('<div><span class="googft-legend-swatch" style="background-color: #ffff00"></span><span class="googft-legend-range">' + 5*maxindex/10 + ' to ' + 9*maxindex/10 + " (50-90%) " + '</span></div>');
        content.push('<div><span class="googft-legend-swatch" style="background-color: #008000"></span><span class="googft-legend-range">' + 9*maxindex/10 + ' to ' + maxindex + " (Top 10%) " + '</span></div>');
        legend.innerHTML = content.join('');
        legend.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    });
    google.maps.event.addListener(marker, "rightclick", function() {
        // Removes state's county map overlay and legend
        countylayer.setMap(null);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop(legend);
    });
}

function search(query, syncResults, asyncResults)
{
    // Get places matching query (asynchronously)
    let parameters = {
        q: query
    };
    $.getJSON("/search", parameters, function(data, textStatus, jqXHR) {

        // Call typeahead's callback with search results (i.e., places)
        asyncResults(data);
    });
}

function configure() {
    $("#q").typeahead({
        highlight: false,
        minLength: 1
    },
    {
        display: function(suggestion) { return null; },
        limit: 10,
        source: search,
        templates: {
            suggestion: Handlebars.compile(
                "<div>" +
                "{{place_name}}, {{admin_name1}}, {{postal_code}}" +
                "</div>"
            )
        }
    });

    // Re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {
        // Set map's center
        map.setCenter({lat: parseFloat(suggestion.latitude), lng: parseFloat(suggestion.longitude)});
        map.setZoom(10);
    });

    var latitudes = [];
    var longitudes = [];
    var boundaries = [];
    var codes = [];

    // Defines arrays of state latitudes, longitudes, county boundaries, and fusion table codes for addMarker() to reference
    $.getJSON("/lats", function(data, textStatus, jqXHR) {
        for (var i = 0; i < 51; i++) {
            latitudes.push(data[i].latitude);
        }
        $.getJSON("/longs", function(data, textStatus, jqXHR) {
            for (var i = 0; i < 51; i++) {
                longitudes.push(data[i].longitude);
            }
            $.getJSON("/statecodes", function(data, textStatus, jqXHR) {
                for (var i = 0; i < 51; i++) {
                    codes.push(data[i].codes);
                }
                for (var j = 0; j < 51; j++) {
                    addMarker(latitudes[j], longitudes[j], codes[j], maxindexarray[j]);
                }
            });
        });
    });
}
