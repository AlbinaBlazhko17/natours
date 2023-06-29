import Tour from '../models/toursModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { createOne, deleteOne, updateOne } from './handlerFactory.js';

export const aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

export const createTour = createOne(Tour);

export const getAllTours = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().paginate();
	const allTours = await features.query;

	res.status(200).json({
		status: 'success',
		results: allTours.length,
		data: { allTours },
	});
});

export const getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id).populate('reviews');
	if (!tour) return next(new AppError('No tour found with that ID', 404));
	res.status(200).json({ status: 'success', data: { tour } });
});

export const updateTour = updateOne(Tour);

export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } },
		},
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
	]);
	res.status(200).json({
		status: 'success',
		data: { stats },
	});
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = +req.params.year;
	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates',
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numTourStarts: { $sum: 1 },
				tours: { $push: '$name' },
			},
		},
		{
			$addFields: { month: '$_id' },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numTourStarts: -1 },
		},
		{
			$limit: 12,
		},
	]);
	res.status(200).json({
		status: 'success',
		data: { plan },
	});
});
