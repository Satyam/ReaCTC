/*eslint-disable no-console*/

var	FS = require('q-io/fs'),
	Q = require('q');

// Cached data
var listaSectores = [];

var SECTORES = './data/sectores';

module.exports = function (app) {

	app.get('/data/sectores', function (req, res) {
		console.log('get  lista sectores');
		res.json(listaSectores);
	});


	// Preload cached data
	return FS.list(SECTORES)
		.then(function (sectores) {
			return Q.all(sectores.map(function (fileName) {
				var nombre = fileName.replace('.json', '');
				FS.read(SECTORES + '/' + fileName)
					.then(function (content) {
						var d = JSON.parse(content);
						listaSectores.push({
							nombre: nombre,
							label: d.descrCorta,
							descr: d.descr
						});
					});
			}));
		});
}
