import express from 'express';
import fs from 'fs';

const app = express();

app.use(express.json());

let tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

app.get('/api/v1/tours', (req, res) => {
	if (tours)
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: { tours },
		});
});

app.get('/api/v1/tours/:id', (req, res) => {
	const id = +req.params.id;
	const tour = tours.find((el) => el.id === id);
	if (tour && id < tours.length - 1 && id > 0) {
		res.status(200).json({ status: 'success', data: { tour } });
	} else res.status(404).json({ status: 'fail', message: 'Invalid ID' });
});

app.post('/api/v1/tours', (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = { id: newId, ...req.body };
	tours = [...tours, newTour];
	fs.writeFile(
		'./dev-data/data/tours-simple.json',
		JSON.stringify(tours),
		(err) => {
			if (err) res.send(400).json(`Error!!! ${err.message} ${err.code}`);
			else
				res.status(201).json({
					status: 'success',
					data: { tour: newTour },
				});
		}
	);
});

app.patch('/api/v1/tours/:id', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: { tour: 'Updated tour here' },
	});
});

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
