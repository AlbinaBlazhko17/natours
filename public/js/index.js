import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { register } from './register.js';
import { updateSettings } from './updateSettings.js';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const logOutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');

if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

if (loginForm) {
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});
}

if (registerForm) {
	registerForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		register(name, email, password, passwordConfirm);
	});
}

if (logOutBtn) {
	logOutBtn.addEventListener('click', (e) => {
		e.preventDefault();
		logout();
	});
}

if (formUserData) {
	formUserData.addEventListener('submit', (e) => {
		e.preventDefault();

		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);

		updateSettings(form, 'data');
	});
}

if (formUserPassword) {
	formUserPassword.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.btn--save-password').innerHTML = 'Updating...';

		const email = document.getElementById('email').value;
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;

		await updateSettings({ email, passwordCurrent, password, passwordConfirm }, 'password');
		document.querySelector('.btn--save-password').innerHTML = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
}
