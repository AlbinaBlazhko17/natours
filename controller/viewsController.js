import Tour from '../models/toursModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getOverview = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();

	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

export const getTour = catchAsync(async (req, res, next) => {
	res.status(200).render('tour', {
		title: 'All Tours',
	});
});
