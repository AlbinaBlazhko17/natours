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
const $e33d9ff231aec008$export$a0973bcfe11b05c9 = async () => {
	try {
		const res = await (0, $iniLV$axios)({
			method: 'GET',
			url: 'http://localhost:3000/api/v1/users/logout',
		});
		if (res.data.status === 'success') {
			(0, $1eb0cc260df27e1b$export$de026b00723010c1)('success', 'Logged out successfully!');
			location.reload(true);
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		(0, $1eb0cc260df27e1b$export$de026b00723010c1)('error', 'Error logging out! Try again.');
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

const $063fc4c5866f54d6$export$6503ec6e8aabbaf = async (name, email, password, passwordConfirm) => {
	try {
		const res = await (0, $iniLV$axios)({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/users/signup',
			data: {
				name: name,
				email: email,
				password: password,
				passwordConfirm: passwordConfirm,
			},
		});
		if (res.data.status === 'success') {
			(0, $1eb0cc260df27e1b$export$de026b00723010c1)('success', 'Registered successfully!');
			window.setTimeout(() => {
				location.assign('/me');
			}, 1500);
		}
	} catch (err) {
		(0, $1eb0cc260df27e1b$export$de026b00723010c1)('error', err.response.data.message);
	}
};

const $a7bd2b0e83ecbd10$export$f558026a994b6051 = async (data, type) => {
	try {
		const url =
			type === 'password'
				? 'http://localhost:3000/api/v1/users/updateMyPassword'
				: 'http://localhost:3000/api/v1/users/updateMe';
		const res = await (0, $iniLV$axios)({
			method: 'PATCH',
			url: url,
			data: data,
		});
		if (res.data.status === 'success') {
			(0, $1eb0cc260df27e1b$export$de026b00723010c1)(
				'success',
				`${type.toUpperCase()} are successfully updated`
			);
			if (type === 'photo') return res.data.data.user.photo;
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		(0, $1eb0cc260df27e1b$export$de026b00723010c1)('error', err.response.data.message);
	}
};

const $1cd085a7ac742057$var$mapBox = document.getElementById('map');
const $1cd085a7ac742057$var$loginForm = document.querySelector('.login-form');
const $1cd085a7ac742057$var$registerForm = document.querySelector('.register-form');
const $1cd085a7ac742057$var$logOutBtn = document.querySelector('.nav__el--logout');
const $1cd085a7ac742057$var$formUserData = document.querySelector('.form-user-data');
const $1cd085a7ac742057$var$formUserPassword = document.querySelector('.form-user-password');
const $1cd085a7ac742057$var$fileInput = document.querySelector('.form__upload');
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
if ($1cd085a7ac742057$var$registerForm)
	$1cd085a7ac742057$var$registerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		(0, $063fc4c5866f54d6$export$6503ec6e8aabbaf)(name, email, password, passwordConfirm);
	});
if ($1cd085a7ac742057$var$logOutBtn)
	$1cd085a7ac742057$var$logOutBtn.addEventListener('click', (e) => {
		e.preventDefault();
		(0, $e33d9ff231aec008$export$a0973bcfe11b05c9)();
	});
if ($1cd085a7ac742057$var$formUserData)
	$1cd085a7ac742057$var$formUserData.addEventListener('submit', (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		(0, $a7bd2b0e83ecbd10$export$f558026a994b6051)(form, 'data');
	});
if ($1cd085a7ac742057$var$fileInput)
	$1cd085a7ac742057$var$fileInput.addEventListener('change', async (e) => {
		const form = new FormData();
		form.append('photo', document.getElementById('photo').files[0]);
		const newImage = await (0, $a7bd2b0e83ecbd10$export$f558026a994b6051)(form, 'photo');
		if (newImage) {
			document.querySelector('.nav__user-img').setAttribute('src', `/img/users/${newImage}`);
			document
				.querySelector('.form__user-photo')
				.setAttribute('src', `/img/users/${newImage}`);
		}
	});
if ($1cd085a7ac742057$var$formUserPassword)
	$1cd085a7ac742057$var$formUserPassword.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.btn--save-password').innerHTML = 'Updating...';
		const email = document.getElementById('email').value;
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await (0, $a7bd2b0e83ecbd10$export$f558026a994b6051)(
			{
				email: email,
				passwordCurrent: passwordCurrent,
				password: password,
				passwordConfirm: passwordConfirm,
			},
			'password'
		);
		document.querySelector('.btn--save-password').innerHTML = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});

//# sourceMappingURL=bundle.js.map
