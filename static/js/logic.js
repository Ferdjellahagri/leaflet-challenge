// Initialize Leaflet map centered on a specific location
const map = L.map('map').setView([0, 0], 2);

// Add a tile layer for the base map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Define earthquake data URL
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

// Fetch earthquake data from USGS GeoJSON feed
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Process each earthquake feature and add a marker to the map
    data.features.forEach(feature => {
      const coords = feature.geometry.coordinates;
      const properties = feature.properties;

      // Calculate marker size based on earthquake magnitude
      const markerSize = Math.sqrt(properties.mag) * 5;

      // Calculate marker color based on earthquake depth
      const markerColor = getColorForDepth(coords[2]);

      // Create a marker with a popup showing earthquake information
      const marker = L.circleMarker([coords[1], coords[0]], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Add spread effect animation when marker is added to the map
      marker.on('add', function() {
        const originalRadius = marker.getRadius();
        marker.setRadius(0); // Start with a radius of 0

        // Animate the spread effect
        let currentRadius = 0;
        const spreadInterval = setInterval(() => {
          currentRadius += 1;
          marker.setRadius(currentRadius);

          // Stop animation when reaching original radius
          if (currentRadius >= originalRadius) {
            clearInterval(spreadInterval);
          }
        }, 10); // Adjust speed of animation as needed
      });

      // Popup content with earthquake details
      const popupContent = `
        <h3>${properties.title}</h3>
        <p><strong>Magnitude:</strong> ${properties.mag}</p>
        <p><strong>Depth:</strong> ${coords[2]} km</p>
        <p><strong>Location:</strong> ${properties.place}</p>
        <p><a href="${properties.url}" target="_blank">USGS Event Page</a></p>
      `;

      marker.bindPopup(popupContent);
    });

    // Add legend and explanation once data is processed
    addLegend();
    addExplanation();
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
  });

// Function to determine marker color based on earthquake depth
function getColorForDepth(depth) {
  if (depth < 30) {
    return '#1a9850'; // Greenish for shallow earthquakes
  } else if (depth < 70) {
    return '#fee08b'; // Yellowish for moderate depth earthquakes
  } else {
    return '#d73027'; // Reddish for deep earthquakes
  }
}

// Function to add legend to the map
function addLegend() {
  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    const depths = [0, 30, 70];
    const labels = [];

    // Loop through depth ranges and generate a label with colored square for each
    for (let i = 0; i < depths.length; i++) {
      const color = getColorForDepth(depths[i]);
      const from = depths[i];
      const to = depths[i + 1];

      labels.push(
        `<i style="background:${color}"></i> ${from}${to ? '&ndash;' + to + ' km' : '+'}`
      );
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(map);
}

// Function to add explanation of colors to the map
function addExplanation() {
  const explanation = L.control({ position: 'bottomleft' });

  explanation.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info explanation');
    div.innerHTML = `
      <h4>Explanation of Colors:</h4>
      <p><span style="background:#1a9850"></span> Shallow earthquakes (< 30 km)</p>
      <p><span style="background:#fee08b"></span> Moderate depth earthquakes (30 - 70 km)</p>
      <p><span style="background:#d73027"></span> Deep earthquakes (> 70 km)</p>
    `;
    return div;
  };

  explanation.addTo(map);
}
