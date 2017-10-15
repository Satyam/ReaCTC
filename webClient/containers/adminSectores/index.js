// @flow
import { connect } from 'react-redux';
import { compose } from 'recompose';
import initStore from '_utils/initStore';

import { listSectores, deleteSectores, addSector, clearStatusAdmin } from '_store/actions';
import { selSectores, selStatusAdmin } from '_store/selectors';

import AdminSectores from '_components/adminSectores';

import type { State } from '_store/flowtypes';

export const storeInitializer: Dispatch => void = dispatch => dispatch(listSectores());

export const mapStateToProps = (state: State) => ({
  sectores: selSectores(state),
  status: selStatusAdmin(state),
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDeleteSectores: (idSectores: IdType[]): Promise<any> => dispatch(deleteSectores(idSectores)),
  onUploadSector: (fileName: string): Promise<any> => dispatch(addSector(fileName)),
  onClearStatusAdmin: (): Promise<any> => dispatch(clearStatusAdmin()),
});

export default compose(initStore(storeInitializer), connect(mapStateToProps, mapDispatchToProps))(
  AdminSectores
);
