import { showAlert } from './alerts.js';

export const forgotPassword = async (email) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:3000/api/v1/users/forgotPassword',
			data: {
				email,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Reset password has been sent to your email!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.message);
	}
};
