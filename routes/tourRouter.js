import express from 'express';
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
	getTourStats,
	getMonthlyPlan,
	getTourWithin,
	getDistances,
	uploadTourImages,
	resizeTourImages,
} from '../controller/toursController.js';
import { protect, restrictTo } from '../controller/authController.js';
import reviewRouter from './reviewRouter.js';

const tourRouter = express.Router();

tourRouter
	.route('/')
	.get(getAllTours)
	.post(protect, restrictTo('admin', 'leaad-guide'), createTour);

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(protect, getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getTourWithin);
tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);

tourRouter
	.route('/:id')
	.get(getTour)
	.patch(
		protect,
		restrictTo('admin', 'leaad-guide'),
		uploadTourImages,
		resizeTourImages,
		updateTour
	)
	.delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default tourRouter;
