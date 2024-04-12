function createMap(quakes) {

    // Create the tile layer that will be the background
    let mapTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create an object for the tile layer
    let baseMaps = {
      "Base Map": mapTiles
    };
  
    // Create an object to store markers from earthquake data
    let overlays = {
      "Earthquakes": quakes
    };
  
    // Create the map 
    let map = L.map("leafletmap", {
      center: [40.73, -74.0059],
      zoom: 12,
      layers: [baseMaps, overlays]
    });
  
    // Create a layer control, add layers
    L.control.layers(baseMaps, overlays, {
      collapsed: false
    }).addTo(map);
  }

  function quakeMarkers(response) {

    // get the list of data points from the response
    let quakeData = response.features;

    // create an array for future data points
    let quakeList = [];

    // Loop through the list of data 
    for (let i = 0; i < quakeData.length; i++) {
        let datapoint = quakeData[i];
        let quakeLat = datapoint.geometry.coordinates[0];
        let quakeLon = datapoint.geometry.coordinates[1];

        // using depth of earthquake, determine color that marker will be
        let quakeDepth = datapoint.geometry.coordinates[3];
        let markerColor = '#FF0099';
        if (quakeDepth < 70) {
            markerColor = '#FF66CC';
        } else if (quakeDepth < 300) {
            markerColor = '#FF0099';
        } else {
            markerColor = '#CC0066';
        };


        // create options for the circle markers
        let markerOptions = {
            radius: datapoint.properties.mag,
            color: markerColor
        };

        // for current index create the marker and add popup
        let quakeMarker = L.circleMarker([quakeLat,quakeLon],markerOptions)
        .bindPopup("<h3>Place: " + datapoint.properties.place + "</h3><h3>Magnitude: " + datapoint.properties.mag + "</h3>");
    
        // add current data point to the array
        quakeList.push(quakeMarker);
    }

    // create the map using the layer group of markers
    createMap(L.layerGroup(quakeList));

  }

  // call the api to get the data and call the function above
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson").then(quakeMarkers);