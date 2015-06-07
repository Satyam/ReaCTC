import Reflux from 'reflux';
const SYNC = {},
	ASYNC = {
		asyncResult: true
	};

export default Reflux.createActions({
	loadSectores: ASYNC,
	setLocalConfig: SYNC,
	closeTabSector: SYNC,
	newTabSector: ASYNC,
	activeTabSector: ASYNC
});
