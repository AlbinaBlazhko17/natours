import { showAlert } from './alerts.js';

export const updateSettings = async (data, type) => {
	try {
		const url =
			type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';
		const res = await axios({
			method: 'PATCH',
			url,
			data,
		});

		if (res.data.status === 'success') {
			showAlert('success', `${type.toUpperCase()} are successfully updated`);
			if (type === 'photo') {
				return res.data.data.user.photo;
			}

			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
