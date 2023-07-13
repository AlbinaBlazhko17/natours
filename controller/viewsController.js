import Tour from '../models/toursModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';

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

	res.status(200)
		.set(
			'Content-Security-Policy',
			"default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
		)
		.render('tour', {
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

export const updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).render('account', {
		title: 'Your account',
		user: updatedUser,
	});
});

export const getForgotPassword = (req, res) => {
	res.status(200).render('forgotPassword', {
		title: 'Forgot password',
	});
};

export const getResetPassword = (req, res) => {
	res.status(200).render('reset', {
		title: 'Reset password',
	});
};
