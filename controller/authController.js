import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOption = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOption.secure = true;

	res.cookie('jwt', token, cookieOption);

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

	createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Incorrect email or password', 401));

	if (email && password) {
		createSendToken(user, 200, res);
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

	if (!token)
		return next(new AppError('You are not logged in! Please log in to get access.', 401));

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

	const message = `Forgot yout password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this emai!`;

	try {
		await sendEmail({
			email: req.body.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});

		res.status(200).json({
			status: 'success',
			massage: 'Token sent to email',
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

	createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	if (await !user.correctPassword(req.body.passwordCurrent, user.password))
		return next(new AppError('Password in incorrect', 401));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;

	await user.save();

	createSendToken(user, 200, res);
});

export const isLoggedIn = catchAsync(async (req, res, next) => {
	if (req.cookies.jwt) {
		const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

		const currentUser = await User.findById(decoded.id);
		if (!currentUser) return next();
		if (currentUser.changePasswordAfter(decoded.iat)) return next();

		res.locals.user = currentUser;
		return next();
	}
	next();
});
