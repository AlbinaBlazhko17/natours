import * as cp from 'cookie-parser';
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
import reviewRouter from './routes/reviewRouter.js';
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/userRouter.js';
import viewRouter from './routes/viewRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import { AppError } from './utils/appError.js';
import cors from 'cors';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.enable('trust proxy');

app.use(cp());

app.use(
	cors({
		credentials: true,
	})
);

app.options('*', cors());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

app.use(
	express.urlencoded({
		extended: true,
		limit: '10kb',
	})
);

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
			baseUri: ["'self'"],
			fontSrc: ["'self'", 'https:', 'data:'],
			scriptSrc: [
				"'self'",
				'https:',
				'http:',
				'blob:',
				'https://*.mapbox.com',
				'https://js.stripe.com',
				'https://m.stripe.network',
				'https://*.cloudflare.com',
			],
			frameSrc: ["'self'", 'https://js.stripe.com'],
			objectSrc: ["'none'"],
			styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
			workerSrc: [
				"'self'",
				'data:',
				'blob:',
				'https://*.tiles.mapbox.com',
				'https://api.mapbox.com',
				'https://events.mapbox.com',
				'https://m.stripe.network',
			],
			childSrc: ["'self'", 'blob:'],
			imgSrc: ["'self'", 'data:', 'blob:'],
			formAction: ["'self'"],
			connectSrc: [
				"'self'",
				"'unsafe-inline'",
				'data:',
				'blob:',
				'https://*.stripe.com',
				'https://*.mapbox.com',
				'https://*.cloudflare.com/',
				'https://bundle.js:*',
				'ws://localhost:3000/',
			],
			upgradeInsecureRequests: [],
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

app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
