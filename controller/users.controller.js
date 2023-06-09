import fs from 'fs';

let users = JSON.parse(fs.readFileSync('./dev-data/data/users.json'));

export const getAllUsers = (req, res) => {
	if (users)
		res.status(200).json({
			status: 'success',
			results: users.length,
			data: { users },
		});
};

export const getUser = (req, res) => {
	const id = +req.params.id;
	const user = users.find((el) => el.id === id);
	if (user && id < users.length - 1 && id > 0) {
		res.status(200).json({ status: 'success', data: { user } });
	} else
		return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
};

export const createUser = (req, res) => {
	const newId = users[users.length - 1].id + 1;
	const newuser = { id: newId, ...req.body };
	users = [...users, newuser];
	fs.writeFile('./dev-data/data/users.json', JSON.stringify(users), (err) => {
		if (err) {
			return res
				.send(400)
				.json(`Cannot POST: ${err.message} ${err.code}`);
		} else {
			res.status(201).json({
				status: 'success',
				data: { user: newuser },
			});
		}
	});
};

export const updateUser = (req, res) => {
	const id = +req.params.id;
	if (id < users.length) {
		res.status(200).json({
			status: 'success',
			data: { user: 'Updated user here' },
		});
	} else
		return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
};

export const deleteUser = (req, res) => {
	if (id < users.length) {
		res.status(204).json({
			status: 'success',
			data: null,
		});
	} else
		return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
};
