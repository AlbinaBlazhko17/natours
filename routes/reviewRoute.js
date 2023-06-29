import express from 'express';
import {
	getAllReviews,
	createReview,
	deleteReview,
	updateReview,
	setTourUserIds,
	getReview,
} from '../controller/reviewController.js';
import { protect, restrictTo } from '../controller/authController.js';

const reviewRouter = express.Router({
	mergeParams: true,
});

reviewRouter
	.route('/')
	.get(getAllReviews)
	.post(protect, restrictTo('user'), setTourUserIds, createReview);

reviewRouter
	.route('/:id')
	.delete(protect, restrictTo('admin'), deleteReview)
	.patch(protect, updateReview)
	.get(getReview);

export default reviewRouter;
