import { connect } from 'react-redux';

import { selMensajes } from '_store/selectors';

import Teletipo from '_components/teletipo';

export const mapStateToProps = state => ({ mensajes: selMensajes(state) });

export default connect(mapStateToProps)(Teletipo);
