import Reflux from 'reflux';
const SYNC = {},
	ASYNC = {
		asyncResult: true
	};

export default Reflux.createActions({
	loadSectores: ASYNC,
	setLocalConfig: SYNC,
	closeTabSector: SYNC,
	openTabSector: ASYNC,
	error: SYNC,
	clickCelda: SYNC,
	clickSenal: SYNC,
	sectorUpdated: SYNC,
	closeEstado: SYNC,
	cambio: SYNC,
	triple: SYNC,
	manual: SYNC,
	teletipo: SYNC,
	senal: SYNC
});
