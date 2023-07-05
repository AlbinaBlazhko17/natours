const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoiYWxiaW5hdG9yMTcwNyIsImEiOiJjbGpwY3Z5NjcwMDNnM25tdmVhb3UwNng4In0.XsaRBpx7PndslhJ8mOVq9Q';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/albinator1707/cljpd19fx00t501qy2jmebgjq',
	scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
	const el = document.createElement('div');
	el.className = 'marker';

	new mapboxgl.Marker({
		element: el,
		anchor: 'bottom',
	})
		.setLngLat(loc.coordinates)
		.addTo(map);

	new mapboxgl.Popup({
		offset: 30,
	})
		.setLngLat(loc.coordinates)
		.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
		.addTo(map);

	bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
	padding: {
		top: 200,
		bottom: 150,
		left: 100,
		right: 100,
	},
});
