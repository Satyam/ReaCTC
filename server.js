/*eslint-disable no-process-env , no-console, no-mixed-requires*/
var app = require('express')(),
	path = require('path'),
	Q = require('q'),
	sqlite3 = require('sqlite3').verbose(),
	bodyParser = require('body-parser');

app.use(bodyParser.json());

console.log(process.env.PRODUCTION ? 'production' : 'development');

// Serve application file depending on environment
app.get('/app.js', function (req, res) {
	if (process.env.PRODUCTION) {
		console.log('get  app.js');
		res.sendFile(path.join(__dirname, 'build/app.js'));
	} else {
		console.log('get  app.js (hot load)');
		res.redirect('//localhost:9090/build/app.js');
	}
});


app.get('/data/sector/:nombre', function (req, res) {
	console.log('get  sector', req.params.nombre);
	res.sendFile(path.join(__dirname, 'data/sectores', req.params.nombre) + '.json');
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

var db = new sqlite3.Database(
	'data/db.db',
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
	function (errMsg) {
		if (errMsg) {
			console.error(errMsg);
		} else {

			Q.all([
				require('./server/listaSectores.js')(app),
				require('./server/actions.js')(app, db)
			])
				.then(function () {
					// The catch-all for whatever remains, should be last
					app.get('*', function (req, res) {
						console.log('get   *', req.originalUrl);
						// Serve index page
						res.sendFile(path.join(__dirname, 'src/index.html'));
					});
					// Launch Express server
					var port = process.env.PORT || 8080;
					var server = app.listen(port, function () {

						console.log('Listening at http://%s:%s', server.address().address, server.address().port);
					});
				})
				.catch(function (err) {
					console.error(err);
				});
		}
	}
);
