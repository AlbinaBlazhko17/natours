export const getOverview = (req, res) => {
	res.status(200).render('overview', {
		tour: 'The forest hiker',
		user: 'Albinator',
	});
};

export const getTour = (req, res) => {
	res.status(200).render('tour', {
		title: 'All Tours',
	});
};
