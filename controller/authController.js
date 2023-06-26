import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { promisify } from 'util';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
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

	const token = signToken(newUser._id);

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password)))
		return next(new AppError('Incorrect email or password', 401));

	if (email && password) {
		const token = signToken(user._id);

		res.status(200).json({
			status: 'success',
			token,
		});
	} else {
		return next(new AppError('Please provide email and password!', 400));
	}
});

export const protect = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token)
		return next(new AppError('You are not logged in! Please log in to get access.', 401));

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const freshUser = await User.findById(decoded.id);
	if (!freshUser)
		return next(new AppError('The user belonging to this token does no longer exist', 401));
	if (freshUser.changePasswordAfter(decoded.iat))
		next(new AppError('User recently changed password! Please log in again.', 401));

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

	if (!user) return next(new Error('Token is invalid or has expired', 400));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	const token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
	});
});
