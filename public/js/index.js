import { login } from './login.js';
import { displayMap } from './mapbox.js';
import { register } from './register.js';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

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
