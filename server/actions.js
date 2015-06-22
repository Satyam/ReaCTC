/*eslint-disable no-console*/

var Q = require('q'),
	FS = require('q-io/fs');

var insertAction, insertClient;

module.exports = function (app, db) {
	console.log('actions called', db);

	app.post('/action/:sector/:coords/:action', function (req, res) {
		var p = req.params;
		console.log('action', p.sector,
				p.coords,
				p.action,
				req.body);
		insertAction.run(
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

	app.get('/action/id', function (req, res) {
		console.log('get id', req.ip, req.ips, req.get('user-agent'));
		insertClient.run(
			[
				req.ip,
				req.get('user-agent')
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

	var prepare = function (sql) {
		var def = Q.defer();
		var prepared = db.prepare(
			sql,
			[],
			function (err) {
				if (err) def.reject(err);
				else def.resolve(prepared);
			}
		);
		return def.promise;
	};
	return FS.read('./server/setup.sql')
		.then(function (sql) {
			return Q.ninvoke(db, 'exec', sql);
		})
		.then(function() {
			return prepare('insert into actions (sector, celda, action, data) values (?, ?, ?, ?)')
				.then(function (prepared) {
					insertAction = prepared;
				});
		})
		.then(function () {
			return prepare('insert into terminalIds (ip, ua) values (?, ?)')
				.then(function (prepared) {
					insertClient = prepared;
				});
		})
		.catch(function (err) {
			console.error(err);
		});
};
