import cookieParser from 'cookie-parser';
import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import xss from 'xss-clean';
import globalErrorHandler from './controller/errorController.js';
import reviewRouter from './routes/reviewRoute.js';
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/userRouter.js';
import viewRouter from './routes/viewRoutes.js';
import { AppError } from './utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(cookieParser());

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", 'data:', 'blob:'],

			fontSrc: ["'self'", 'https:', 'data:'],

			scriptSrc: ["'self'", 'unsafe-inline'],

			scriptSrc: [
				"'self'",
				'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
			],

			scriptSrcElem: [
				"'self'",
				'https:',
				'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
			],

			styleSrc: ["'self'", 'https:', 'unsafe-inline'],

			connectSrc: [
				"'self'",
				'data',
				'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
			],
		},
	})
);

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
app.use(ExpressMongoSanitize());
app.use(xss());

app.use(
	hpp({
		whitelist: [
			'duration',
			'ratingsQuantity',
			'ratingsAverage',
			'maxGroupSize',
			'difficulty',
			'price',
		],
	})
);

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
