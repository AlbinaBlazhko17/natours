import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

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

export const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		status: 'success',
		result: users.length,
		data: {
			users,
		},
	});
});
