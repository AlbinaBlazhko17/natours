import express from 'express';
import { getAllReviews, createReview, deleteReview } from '../controller/reviewController.js';
import { protect, restrictTo } from '../controller/authController.js';

const reviewRouter = express.Router({
	mergeParams: true,
});

reviewRouter.route('/').get(getAllReviews).post(protect, restrictTo('user'), createReview);

reviewRouter.route('/:id').delete(protect, restrictTo('admin'), deleteReview);

export default reviewRouter;
