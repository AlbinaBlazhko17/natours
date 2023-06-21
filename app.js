import express from 'express';
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/userRouter.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controller/errorController.js';

const app = express();

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
