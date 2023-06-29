import User from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';

const filteredObj = (obj, ...allowedFildes) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFildes.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

export const getAllUsers = getAll(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const getUser = getOne(User);

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

export const deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
