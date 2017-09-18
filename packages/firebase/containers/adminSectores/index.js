import { connect } from 'react-redux';
import { compose } from 'recompose';
import map from 'lodash/map';
import pick from 'lodash/pick';
import firebaseConnect from '_utils/firebase/connect';

import { deleteSectores, addSector, clearStatusAdmin } from '_store/actions';
import { selStatusAdmin } from '_store/selectors';

import AdminSectores from '_components/adminSectores';

export const firebaseDataMap = () => ({
  sectores: {
    path: 'sectores',
    fn: result => map(result, value => pick(value, 'idSector', 'descrCorta', 'descr')),
  },
});

export const mapStateToProps = state => ({
  status: selStatusAdmin(state),
});

export const mapDispatchToProps = dispatch => ({
  onDeleteSectores: idSectores => dispatch(deleteSectores(idSectores)),
  onUploadSector: fileName => dispatch(addSector(fileName)),
  onClearStatusAdmin: () => dispatch(clearStatusAdmin()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect(firebaseDataMap)
)(AdminSectores);
