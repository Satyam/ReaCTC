import { connect } from 'react-redux';

import { selMensajes } from '_store/selectors';

import TeletipoComponent from './teletipoComponent';

export const mapStateToProps = state => ({ mensajes: selMensajes(state) });

export default connect(mapStateToProps)(TeletipoComponent);
