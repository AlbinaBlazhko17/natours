import express from 'express';
import { getOverview, getTour } from '../controller/viewsController.js';

const viewRouter = express.Router();

viewRouter.get('/', getOverview);
viewRouter.get('/tour', getTour);

export default viewRouter;
