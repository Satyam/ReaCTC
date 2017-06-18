import { connect } from 'react-redux';

import { selMensajes } from '_store/selectors';

import TeletipoComponent from '_components/teletipo';

export const mapStateToProps = state => ({ mensajes: selMensajes(state) });

export default connect(mapStateToProps)(TeletipoComponent);
