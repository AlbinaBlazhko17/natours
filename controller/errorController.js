import { AppError } from '../utils/appError.js';

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((val) => val.message);
	const message = `Invalid input data. ${errors.join('. ')}`;

	return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handeJWTExpiredError = () =>
	new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}
	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong',
		msg: err.message,
	});
};

const sendErrorProd = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		console.error('ERROR 💥', err);
		// 2) Send generic message
		return res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
	if (err.isOperational) {
		return res.status(err.statusCode).render('error', {
			title: 'Something went wrong',
			msg: err.message,
		});
	}
	console.error('ERROR 💥', err);

	return res.status(err.statusCode).render('error', {
		title: 'Something went wrong',
		msg: 'Please try again later.',
	});
};

export default (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = Object.assign(err);

		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.name === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handeJWTExpiredError();

		sendErrorProd(error, req, res);
	}
	next();
};
