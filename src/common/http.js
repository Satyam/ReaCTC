/* jshint node:true, esnext:true */

/**
@module utilities
@submodule http
*/

/**
Helper functions to generate standard HTTP requests using the
[xhr](https://www.npmjs.com/package/xhr) npm module.

All methods return a Promise.

It is integrated with the rendering engine so that upon completion of a request,
a redraw is requested.

@class http
@static
*/

var xhr = require('xhr');

/**
Generic entry point for HTTP requests.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object||String} It the request was for JSON data, it will be returned as an object, otherwise, the plain XHR `responseText`.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The HTTP method that had been requested
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.

@method http
@param config {Object}  See [xhr](https://www.npmjs.com/package/xhr)
@return {Promise} as described above.
@static
*/
var http = function (config) {
	return new Promise(function (resolve, reject) {
		xhr(config, function (err, res) {
			if (err) {
				reject(err);
			} else if (res.statusCode > 300) {
				reject(res);
			} else {
				resolve(res);
			}
		});
	});
};

/**
Produces an HTTP GET request accepting JSON data.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object} An object with the JSON response already parsed.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The value `GET`
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.

@method get
@param url {String} URL for the request
@return {Promise} as described above.
@static
*/
http.get = function (url) {
	return http({
		json: true,
		url: url
	});
};

/**
Produces an HTTP POST (create) request sending and accepting JSON data.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object} An object with the JSON response already parsed.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The value `POST`
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.


@method post
@param url {String} URL for the request
@param body {Object} Data to be sent.  It will be turned into JSON before sending
@static
*/
http.post = function (url, body, cb) {
	return http({
		method: 'POST',
		json: body,
		url: url
	}, cb);
};
/**
Alias of [post](#method_post).
Produces an HTTP POST (create) request accepting JSON data.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object} An object with the JSON response already parsed.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The value `POST`
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.


@method create
@param url {String} URL for the request
@param body {Object} Data to be sent.  It will be turned into JSON before sending
@return {Promise} as described above.
@static
*/
http.create = http.post;
/**
Produces an HTTP PUT (update) request accepting JSON data.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object} An object with the JSON response already parsed.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The value `PUT`
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.


@method put
@param url {String} URL for the request
@param body {Object} Data to be sent.  It will be turned into JSON before sending
@return {Promise} as described above.
@static
*/
http.put = function (url, body, cb) {
	return http({
		method: 'PUT',
		json: body,
		url: url
	}, cb);
};

/**
Alias of [put](#method_put).
Produces an HTTP PUT (update) request accepting JSON data.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object} An object with the JSON response already parsed.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The value `PUT`
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.


@method update
@param url {String} URL for the request
@param body {Object} Data to be sent.  It will be turned into JSON before sending
@return {Promise} as described above.
@static
*/
http.update = http.put;
/**
Produces an HTTP DELETE request.
It returns a Promise.
It queues and resolves a redraw request.

When resolved successfully, the response will contain:

* `body`{Object} An object with the JSON response already parsed.
* `statusCode` {Number} Values in the 2xx range will be considered successful, others, a rejection
* `method` {String} The value `DEL`
* `headers` {Object} The XHR response headers
* `url` {String} The URL requested
* `rawRequest` {XMLHttpRequest} The XHR object for this request

The promise can be rejected with a standard JavaScript `Error` object with at least `name` and `message` properties if the request could not be processed due to erroneous arguments.  If the response comes with an error code above the 2xx range, it will also be rejected with the same response object as a successful response.


@method del
@param url {String} URL for the request
@return {Promise} as described above.
@static
*/
http.del = function (url, cb) {
	return http({
		method: 'DEL',
		json: true,
		url: url
	}, cb);
};

module.exports = http;
