import Stripe from 'stripe';
import Tour from '../models/toursModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
	// 1) Get the currently booked tour
	const tour = await Tour.findById(req.params.tourId).exec();
	// console.log(tour);

	const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
	// 2) Create checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://localhost:${process.env.PORT}/`,
		cancel_url: `${req.protocol}://localhost:${process.env.PORT}/tours/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: tour.price * 100,
					currency: 'usd',
					product_data: {
						name: `${tour.name} Tour`,
						description: tour.summary,
						images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
					},
				},
				quantity: 1,
			},
		],
	});

	// 3) Create session as response
	res.status(200).json({
		status: 'success',
		session,
	});
});
