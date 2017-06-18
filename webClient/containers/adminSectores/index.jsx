import { connect } from 'react-redux';
import { compose } from 'recompose';
import initStore from '_utils/initStore';

import { listSectores, deleteSectores, addSector, clearStatusAdmin } from '_store/actions';
import { selSectores, selStatusAdmin } from '_store/selectors';

import AdminSectoresComponent from '_components/adminSectores';

export const storeInitializer = dispatch => dispatch(listSectores());

export const mapStateToProps = state => ({
  sectores: selSectores(state),
  status: selStatusAdmin(state),
});

export const mapDispatchToProps = dispatch => ({
  onDeleteSectores: idSectores => dispatch(deleteSectores(idSectores)),
  onUploadSector: fileName => dispatch(addSector(fileName)),
  onClearStatusAdmin: () => dispatch(clearStatusAdmin()),
});

export default compose(initStore(storeInitializer), connect(mapStateToProps, mapDispatchToProps))(
  AdminSectoresComponent
);
