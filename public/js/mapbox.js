const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoiYWxiaW5hdG9yMTcwNyIsImEiOiJjbGpwY3Z5NjcwMDNnM25tdmVhb3UwNng4In0.XsaRBpx7PndslhJ8mOVq9Q';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
});
