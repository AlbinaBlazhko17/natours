import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

export const deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc)
			return next(
				new AppError(`No ${Model.modelName.toLowerCase()} found with that ID`, 404)
			);
		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

export const deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	if (!tour) return next(new AppError('No tour found with that ID', 404));
	res.status(204).json({
		status: 'success',
		data: null,
	});
});
