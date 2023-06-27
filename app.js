import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import globalErrorHandler from './controller/errorController.js';
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/userRouter.js';
import { AppError } from './utils/appError.js';

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many request from this API, please try again in an hour!',
});

app.use('/api', limiter);

app.use(
	express.json({
		limit: '10kb',
	})
);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
