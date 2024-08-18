// Initialize communication with the platform
var platform = new H.service.Platform({
    apikey: 'GZvSUvdaQMcVA4YF1oRWga0XLR4FxEnFFA7T6IoB8Ts'
  });
  var defaultLayers = platform.createDefaultLayers();
  
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: { lat: 50, lng: 5 },
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1
  });
  
  // Add a resize listener to make sure the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  // Make the map interactive
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Function to find locations based on user input
  function findLocations() {
      var locationType = document.getElementById('location-type').value;
      var userLocation = document.getElementById('user-location').value;
      
      var geocoder = platform.getGeocodingService();
      geocoder.geocode({ searchText: userLocation }, function(result) {
          if (result.Response.View.length > 0) {
              var location = result.Response.View[0].Result[0].Location.DisplayPosition;
              var coords = { lat: location.Latitude, lng: location.Longitude };
              map.setCenter(coords);
              map.setZoom(14);
  
              searchNearbyLocations(coords, locationType);
          } else {
              alert('Location not found. Please try again.');
          }
      }, function(e) {
          alert('Geocoding failed: ' + e);
      });
  }
  
  // Function to search for nearby locations
  function searchNearbyLocations(coords, locationType) {
      var searchService = platform.getSearchService();
  
      searchService.browse({
          at: coords.lat + ',' + coords.lng,
          categories: locationType
      }, function(result) {
          result.items.forEach(function(item) {
              var marker = new H.map.Marker({ lat: item.position[0], lng: item.position[1] });
              map.addObject(marker);
          });
      }, function(e) {
          alert('Search failed: ' + e);
      });
  }
  