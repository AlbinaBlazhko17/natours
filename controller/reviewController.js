import Review from '../models/reviewModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const createReview = catchAsync(async (req, res, next) => {
	const newReview = await Review.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			review: newReview,
		},
	});
});

export const getAllReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.findOne();

	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data: {
			reviews,
		},
	});
});
