import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne, updateOne } from './handlerFactory.js';

export const createReview = catchAsync(async (req, res, next) => {
	if (!req.body.tour) req.body.tour = req.params.tourId;
	req.body.user = req.user.id;
	const newReview = await Review.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			review: newReview,
		},
	});
});

export const updateReview = updateOne(Review);

export const getAllReviews = catchAsync(async (req, res, next) => {
	let filter = {};
	if (req.params.tourId) filter = { tour: req.params.tourId };

	const reviews = await Review.find(filter);

	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

export const deleteReview = deleteOne(Review);
