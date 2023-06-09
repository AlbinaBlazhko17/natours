import fs from 'fs';

let tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

export const getAllTours = (req, res) => {
	if (tours)
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: { tours },
		});
};

export const getTour = (req, res) => {
	const id = +req.params.id;
	const tour = tours.find((el) => el.id === id);
	if (tour && id < tours.length - 1 && id > 0) {
		res.status(200).json({ status: 'success', data: { tour } });
	} else
		return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
};

export const createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = { id: newId, ...req.body };
	tours = [...tours, newTour];
	fs.writeFile(
		'./dev-data/data/tours-simple.json',
		JSON.stringify(tours),
		(err) => {
			if (err) {
				return res
					.send(400)
					.json(`Cannot POST: ${err.message} ${err.code}`);
			} else {
				res.status(201).json({
					status: 'success',
					data: { tour: newTour },
				});
			}
		}
	);
};

export const updateTour = (req, res) => {
	const id = +req.params.id;
	if (id < tours.length) {
		res.status(200).json({
			status: 'success',
			data: { tour: 'Updated tour here' },
		});
	} else
		return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
};

export const deleteTour = (req, res) => {
	if (id < tours.length) {
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} else
		return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
};
