import { showAlert } from './alerts.js';

export const bookTour = async (tourId) => {
	const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
	try {
		const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

		await stripe.redirectToCheckout({
			sessionId: session.data.session.id,
		});
	} catch (err) {
		console.log(err);
		showAlert('error', err);
	}
};
