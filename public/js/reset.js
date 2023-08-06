import { showAlert } from './alerts.js';

export const resetPassword = async (password, passwordConfirm) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: `/api/v1/users/resetPassword/${window.location.pathname.split('/')[2]}`,
			data: {
				password,
				passwordConfirm,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Password has been successfully reset!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
