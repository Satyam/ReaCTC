/*
import Reflux from 'reflux';
const SYNC = {},
	ASYNC = {
		asyncResult: true
	};

export default Reflux.createActions({
	loadSectores: ASYNC,  // sectores.js                    on: sectores.js
	setLocalConfig: SYNC, // db.js,                         on: loadConfig
	closeTabSector: SYNC, // mimico.jsx                     on: localConfig, sector.js
	openTabSector: ASYNC, // mimico.jsx                     on: localConfig, sector.js

	error: SYNC,          // mimico.jsx, sector.js, sectores.js on: mimico.jsx
	teletipo: SYNC,       // sector.js                      on: teletipo.js

	clickCelda: SYNC,     // celda.jsx                      on: estado.js
	clickSenal: SYNC,     // senal.jsx                      on: estado.js

	sectorUpdated: SYNC,  // sector.jsx                     on: estado.js
	closeEstado: SYNC,    // estado.jsx                     on: estado.js

	cambio: SYNC,         // estado.jsx sector.js           on: db.js estado.js sector.js
	triple: SYNC,         // estado.jsx                     on: db.js estado.js sector.js
	manual: SYNC,         // estado.jsx                     on: db.js sector.js
	senal: SYNC           // estado.jsx sector.js           on: db.js sector.js
});
*/
import alt from './alt.js';

export default alt.generateActions(
	'closeTabSector',
	'openTabSector',
	'tabSectorOpenned',

	'error',
	'teletipo',

	'clickCelda',
	'clickSenal',

	'sectorUpdated', // ver de cambiar el nombre
	'closeEstado',

	'cambio',
	'triple',
	'manual',
	'senal'
);
