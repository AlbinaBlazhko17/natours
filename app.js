import express from 'express';
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
} from './functions.js';

const app = express();

app.use(express.json());

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
