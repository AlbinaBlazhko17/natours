import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Email from '../utils/email.js';

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user._id);

	res.cookie('jwt', token, {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: false,
	});

	user.password = undefined;

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

export const signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		changePasswordAfter: req.body.changePasswordAfter,
	});

	const url = `${req.protocol}://${req.get('host')}/me`;

	await new Email(newUser, url).sendWelcome();

	createSendToken(newUser, 201, req, res);
});

export const logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expired: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Incorrect email or password', 401));

	if (email && password) {
		createSendToken(user, 200, req, res);
	} else {
		return next(new AppError('Please provide email and password!', 400));
	}
});

export const protect = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		res.redirect('/');
		return next(new AppError('You are not logged in! Please log in to get access.', 401));
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const freshUser = await User.findById(decoded.id);
	if (!freshUser)
		return next(new AppError('The user belonging to this token does no longer exist', 401));
	if (freshUser.changePasswordAfter(decoded.iat))
		return next(new AppError('User recently changed password! Please log in again.', 401));

	req.user = freshUser;
	next();
});

export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(new AppError('You do not have permission to perform action', 403));
		next();
	};
};

export const forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) return next(new AppError('There is no user with email address', 404));

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/resetPassword/${resetToken}`;

	try {
		await new Email(user, resetURL).sendPasswordReset();

		res.status(200).json({
			status: 'success',
			massage: 'Token sent to email',
			credentials: 'include',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(`There was an error sending email. Try again later!\n ${err.message}`)
		);
	}
});

export const resetPassword = catchAsync(async (req, res, next) => {
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) return next(new AppError('Token is invalid or has expired', 400));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	createSendToken(user, 200, req, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	if (await !user.correctPassword(req.body.passwordCurrent, user.password))
		return next(new AppError('Password in incorrect', 401));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	await user.save();

	createSendToken(user, 200, req, res);
});

export const isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			// 1) verify token
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

			// 2) Check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}

			// 3) Check if user changed password after the token was issued
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}

			// THERE IS A LOGGED IN USER
			res.user = currentUser;
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}
	next();
};
