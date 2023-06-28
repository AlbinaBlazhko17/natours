import express from 'express';
import { getAllReviews, createReview } from '../controller/reviewController.js';
import { protect, restrictTo } from '../controller/authController.js';

const reviewRouter = express.Router();

reviewRouter.route('/').get(getAllReviews).post(protect, restrictTo('user'), createReview);

export default reviewRouter;
