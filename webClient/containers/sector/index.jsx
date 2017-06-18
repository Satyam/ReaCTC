import { connect } from 'react-redux';
import { compose } from 'recompose';

import initStore from '_utils/initStore';

import { getSector } from '_store/actions';
import { selSector } from '_store/selectors';

import SectorComponent from '_components/sector';

export const storeInitializer = (dispatch, getState, { match }) =>
  dispatch(getSector(match.params.idSector));

export const mapStateToProps = (state, { match }) => selSector(state, match.params.idSector);

export default compose(initStore(storeInitializer), connect(mapStateToProps))(SectorComponent);
