import Tour from '../models/toursModel.js';
import APIFeatures from '../utils/apiFeatures.js';

export const aliasTopTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
	next();
};

export const createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);

		res.status(201).json({
			status: 'success',
			data: { tour: newTour },
		});
	} catch (err) {
		res.status(400).json({ status: 'fail', message: err });
	}
};

export const getAllTours = async (req, res) => {
	try {
		const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().paginate();
		const allTours = await features.query;

		res.status(200).json({
			status: 'success',
			results: allTours.length,
			data: { allTours },
		});
	} catch (err) {
		res.status(404).json({ status: 'fail', message: 'Cannot find tours' });
	}
};

export const getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({ status: 'success', data: { tour } });
	} catch (err) {
		res.status(404).json({ status: 'fail', message: 'Doesn`t exist tour' });
	}
};

export const updateTour = async (req, res) => {
	try {
		const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: 'success',
			data: { updatedTour },
		});
	} catch (err) {
		res.status(404).json({ status: 'fail', message: 'Cannot update tour' });
	}
};

export const deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(404).json({ status: 'fail', message: 'Cannot delete tour' });
	}
};

export const getTourStats = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({ status: 'fail', message: 'Cannot get stats of tour' });
	}
};

export const getMonthlyPlan = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({ status: 'fail', message: `${err.message}` });
	}
};
