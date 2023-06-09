import express from 'express';
import fs from 'fs';

const app = express();

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json'));

app.get('/api/v1/tours', (req, res) => {
	if (tours) res.status(200).json({ status: 'success', data: { tours } });
});

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
