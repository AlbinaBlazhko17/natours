import { forgotPassword } from './forgot.js';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { register } from './register.js';
import { updateSettings } from './updateSettings.js';
import { resetPassword } from './reset.js';
import { bookTour } from './stripe.js';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const logOutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const fileInput = document.querySelector('.form__upload');
const passwordForgotForm = document.querySelector('.forgot-form');
const passwordResetForm = document.querySelector('.reset-form');
const bookBtn = document.getElementById('book-tour');

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

		updateSettings(form, 'data');
	});
}

if (fileInput) {
	fileInput.addEventListener('change', async (e) => {
		const form = new FormData();

		form.append('photo', document.getElementById('photo').files[0]);

		const newImage = await updateSettings(form, 'photo');

		if (newImage) {
			document.querySelector('.nav__user-img').setAttribute('src', `/img/users/${newImage}`);
			document
				.querySelector('.form__user-photo')
				.setAttribute('src', `/img/users/${newImage}`);
		}
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

if (passwordForgotForm) {
	passwordForgotForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;

		forgotPassword(email);
	});
}

if (passwordResetForm) {
	passwordResetForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;

		resetPassword(password, passwordConfirm);
	});
}

if (bookBtn) {
	bookBtn.addEventListener('click', (e) => {
		e.target.textContent = 'Processing...';
		const { tourId } = e.target.dataset;
		bookTour(tourId);
	});
}
