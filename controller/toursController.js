import multer from 'multer';
import sharp from 'sharp';
import Tour from '../models/toursModel.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please uploaad only images.', 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	filter: multerFilter,
});

export const uploadTourImages = upload.fields([
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 3 },
]);

export const resizeTourImages = (req, res, next) => {
	next();
};

export const aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

export const createTour = createOne(Tour);
export const getAllTours = getAll(Tour);
export const getTour = getOne(Tour, { path: 'reviews' });
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

export const getTourWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');
	const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng)
		return next(
			new AppError('Please provide latitude and longitude in the format lat,lng.', 400)
		);

	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours,
		},
	});
});

export const getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(',');
	const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

	if (!lat || !lng)
		return next(
			new AppError('Please provide latitude and longitude in the format lat,lng.', 400)
		);

	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [+lng, +lat],
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	]);

	res.status(200).json({
		status: 'success',
		data: {
			distances,
		},
	});
});
