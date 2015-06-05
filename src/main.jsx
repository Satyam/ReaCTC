/**
 * App entry point
 */

// Polyfill
import 'babel-core/polyfill';

// Libraries
import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute} = Router;


import Mimico from './components/mimico/mimico.jsx';
import Sector from './components/sector/sector.jsx';
import Teletipo from './components/teletipo/teletipo.jsx';

var routes = (
	<Route name='app' path='/' handler={Mimico}>
		<Route name='sector' path='sector/:sector' handler={Sector} />
		<Route name='teletipo' path='teletipo' handler={Teletipo} />
		<DefaultRoute handler={Teletipo} />
    </Route>
);


// Start the router
Router.run(routes, Router.HistoryLocation, function(Handler, state) {
    React.render(<Handler/>, global.document.getElementById('app'));
});
