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
} from '../controller/toursController.js';
import { protect, restrictTo } from '../controller/authController.js';

const tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
tourRouter.route('/tour-stats').get(protect, getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter
	.route('/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default tourRouter;
