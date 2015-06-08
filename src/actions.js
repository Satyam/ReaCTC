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
	error: SYNC
});
