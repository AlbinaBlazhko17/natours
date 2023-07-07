import Tour from '../models/toursModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getOverview = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();

	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

export const getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	if (!tour) {
		return next(new AppError('There is no tour with that name', 404));
	}

	res.set(
		'Content-Security-Policy',
		'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
	);

	res.status(200).render('tour', {
		title: `${tour.name} tour`,
		tour,
	});
});

export const getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account',
	});
};

export const getRegisterForm = (req, res) => {
	res.status(200).render('register', {
		title: 'Register your account',
	});
};

export const getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your account',
	});
};
