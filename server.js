/*eslint-disable no-process-env , no-console*/
var FS = require('q-io/fs'),
	Q = require('q'),
	express = require('express'),
	path = require('path');

var	app = express();

// Cached data
var listaSectores = [];

// Serve application file depending on environment
app.get('/app.js', function (req, res) {
	if (process.env.PRODUCTION) {
		res.sendFile(path.join(__dirname, 'build/app.js'));
	} else {
		res.redirect('//localhost:9090/build/app.js');
	}
});

app.get('/data/sectores', function (req, res) {
	res.json(listaSectores);
});

app.get('/data/sector/:nombre', function (req, res) {
	res.sendFile(path.join(__dirname, 'data/sectores', req.params.nombre) + '.json');
});

// Serve index page
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'src/index.html'));
});

/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
	var webpack = require('webpack');
	var WebpackDevServer = require('webpack-dev-server');
	var config = require('./webpack.local.config.js');

	new WebpackDevServer(webpack(config), {
		publicPath: config.output.publicPath,
		hot: true,
		noInfo: true,
		historyApiFallback: true
	}).listen(9090, 'localhost', function (err) {
		if (err) {
			console.log(err);
		}
	});
}


// Preload cached data
var SECTORES = './data/sectores';
FS.list(SECTORES)
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
	})
	.then(function () {
		// Launch Express server
		var port = process.env.PORT || 8080;
		var server = app.listen(port, function () {

			console.log('Essential React listening at http://%s:%s', server.address().address, server.address().port);
		});
	});
