import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import { createOne, deleteOne, updateOne } from './handlerFactory.js';

export const setTourUserIds = (req, res, next) => {
	if (!req.body.tour) req.body.tour = req.params.tourId;
	req.body.user = req.user.id;
	next();
};

export const createReview = createOne(Review);
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
