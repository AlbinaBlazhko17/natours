import express from 'express';
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
} from '../controller/tours.controller.js';

const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
