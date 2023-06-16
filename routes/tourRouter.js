import express from 'express';
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
} from '../controller/tours.controller.js';

const tourRouter = express.Router();
tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
