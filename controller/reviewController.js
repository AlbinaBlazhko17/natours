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
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;

	const reviews = await Review.findOne();

	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data: {
			reviews,
		},
	});
});
