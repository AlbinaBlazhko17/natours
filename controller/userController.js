import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const filteredObj = (obj, ...allowedFildes) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFildes.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

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

export const updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.confirmPassword)
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword',
				400
			)
		);

	const filteredBody = filteredObj(req.body, 'name', 'email');

	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});
