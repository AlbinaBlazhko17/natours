import express from 'express';
import { getOverview, getTour, getLoginForm } from '../controller/viewsController.js';

const viewRouter = express.Router();

viewRouter.get('/', getOverview);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', getLoginForm);

export default viewRouter;
