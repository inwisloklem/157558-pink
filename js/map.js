contactsMap = document.querySelector(".contacts__map");

function initMap() {
  var location = {lat: 59.937532, lng: 30.320992};
  var mapOptions = {
    center: new google.maps.LatLng(location),
    zoom: 16,
    disableDefaultUI: true
  };

  var map = new google.maps.Map(contactsMap, mapOptions);

  var markerImage = new google.maps.MarkerImage(
    "../img/icon-map-marker.svg",
    new google.maps.Size(66, 100)
  );

  new google.maps.Marker({
    position: {lat: 59.936331, lng: 30.321582},
    map: map,
    icon: markerImage
  });

  window.onresize = function() {
    map.setCenter(location);
  }
}

google.maps.event.addDomListener(window, "load", initMap);
