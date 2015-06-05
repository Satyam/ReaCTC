import Reflux from 'reflux';
const SYNC = {},
	ASYNC = {
		asyncResult: true
	};

export default Reflux.createActions({
	loadSectores: ASYNC,
	loadSector: ASYNC,
	setLocalConfig: SYNC,
	closeTabSector: SYNC,
	openTabSector: SYNC

});
