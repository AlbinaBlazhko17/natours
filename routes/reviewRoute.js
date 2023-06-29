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

reviewRouter.use(protect);

reviewRouter.route('/').get(getAllReviews).post(restrictTo('user'), setTourUserIds, createReview);

reviewRouter
	.route('/:id')
	.delete(restrictTo('admin', 'user'), deleteReview)
	.patch(restrictTo('admin', 'user'), updateReview)
	.get(getReview);

export default reviewRouter;
