import PropTypes from 'prop-types';

export default PropTypes.shape({
  app: PropTypes.func.isRequired,
  auth: PropTypes.func.isRequired,
  database: PropTypes.func.isRequired,
  messaging: PropTypes.func.isRequired,
  storage: PropTypes.func.isRequired,
});
