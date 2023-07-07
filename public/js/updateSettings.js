import axios from 'axios';
import { showAlert } from './alerts.js';

export const updateSettings = async (name, email) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: 'http://localhost:3000/api/v1/users/updateMe',
			data: {
				name,
				email,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Settings are successfully updated');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
