import $iniLV$axios from 'https://cdn.skypack.dev/axios';

const $1eb0cc260df27e1b$export$516836c6a9dfc573 = () => {
	const el = document.querySelector('.alert');
	if (el) el.parentElement.removeChild(el);
};
const $1eb0cc260df27e1b$export$de026b00723010c1 = (type, msg) => {
	$1eb0cc260df27e1b$export$516836c6a9dfc573();
	const markup = `<div class="alert alert--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout($1eb0cc260df27e1b$export$516836c6a9dfc573, 5000);
};

const $e33d9ff231aec008$export$596d806903d1f59e = async (email, password) => {
	try {
		const res = await (0, $iniLV$axios)({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/users/login',
			data: {
				email: email,
				password: password,
			},
		});
		if (res.data.status === 'success') {
			(0, $1eb0cc260df27e1b$export$de026b00723010c1)('success', 'Logged in successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		(0, $1eb0cc260df27e1b$export$de026b00723010c1)('error', err.response.data.message);
	}
};

const $f6b1c9ed51ec7162$export$4c5dd147b21b9176 = (locations) => {
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
};

const $1cd085a7ac742057$var$mapBox = document.getElementById('map');
const $1cd085a7ac742057$var$loginForm = document.querySelector('.form');
if ($1cd085a7ac742057$var$mapBox) {
	const locations = JSON.parse($1cd085a7ac742057$var$mapBox.dataset.locations);
	(0, $f6b1c9ed51ec7162$export$4c5dd147b21b9176)(locations);
}
if ($1cd085a7ac742057$var$loginForm)
	$1cd085a7ac742057$var$loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		(0, $e33d9ff231aec008$export$596d806903d1f59e)(email, password);
	});

//# sourceMappingURL=bundle.js.map
