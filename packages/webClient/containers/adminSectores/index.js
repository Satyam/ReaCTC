// @flow
import { connect } from 'react-redux';
import { compose } from 'recompose';
import initStore from 'init-store';

import { listSectores, deleteSectores, addSector, clearStatusAdmin } from '_store/actions';
import { selSectores, selStatusAdmin } from '_store/selectors';

import AdminSectores from '_components/adminSectores';

import type { MapStateToProps, MapDispatchToProps } from 'react-redux';

export const storeInitializer: Dispatch => void = dispatch => dispatch(listSectores());

export const mapStateToProps: MapStateToProps<*, Object, Object> = state => ({
  sectores: selSectores(state),
  status: selStatusAdmin(state),
});

export const mapDispatchToProps: MapDispatchToProps<{}, Object, Object> = dispatch => ({
  onDeleteSectores: idSectores => dispatch(deleteSectores(idSectores)),
  onUploadSector: fileName => dispatch(addSector(fileName)),
  onClearStatusAdmin: () => dispatch(clearStatusAdmin()),
});

export default compose(initStore(storeInitializer), connect(mapStateToProps, mapDispatchToProps))(
  AdminSectores
);
