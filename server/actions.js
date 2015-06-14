/*eslint-disable no-console*/

var Q = require('q');

module.exports = function (app, db) {
	console.log('actions called', db);

	app.post('/action/:sector/:coords/:action', function (req, res) {
		var p = req.params;
		console.log('action', p.sector,
				p.coords,
				p.action,
				req.body);
		db.run(
			'insert into actions (sector, celda, action, data) values (?, ?, ?, ?)',
			[
				p.sector,
				p.coords,
				p.action,
				JSON.stringify(req.body)
			],
			function (err) {
				if (err) {
					res.status(500).send(err);
				}
				res.send({
					id: this.lastID,
					changes: this.changes
				});
			}
		);
	});

	return Q.ninvoke(
		db,
		'run',
		'create table if not exists actions (' +
		'	id integer primary key,' +
		'	timestamp text default CURRENT_TIMESTAMP,' +
		'	sector text,' +
		'   celda text,' +
		'	action text,' +
		'	data Text' +
		');',
		[]
	);
};
