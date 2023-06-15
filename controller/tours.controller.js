import Tour from '../models/toursModel.js';

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
		const allTours = await Tour.find();
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
		const updatedTour = await Tour.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
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
