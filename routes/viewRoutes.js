import express from 'express';
import { getOverview, getTour } from '../controller/viewsController.js';

const viewRouter = express.Router();

// viewRouter.get('/', (req, res) => {
// 	res.status(200).render('base', {
// 		tour: 'The forest hiker',
// 		user: 'Albinator',
// 	});
// });

viewRouter.get('/', getOverview);
viewRouter.get('/tour', getTour);

export default viewRouter;
