import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isPlainClick from '_utils/isPlainClick';

import { List, ListItem, ListDivider } from 'react-toolbox/lib/list';

import { clearHttpErrors } from '_store/actions';
import { selErrors } from '_store/selectors';

export const ErrorsComponent = ({ errors, onCloseErrors }) => {
  const closeErrorsHandler = ev => isPlainClick(ev) && onCloseErrors();
  return errors.length
    ? <List>
      <ListItem
        caption="Close"
        legend="Click individual errors to dismiss"
        onClick={closeErrorsHandler}
        rightIcon="delete_sweep"
      />
      <ListDivider />
      {errors.map(err => <ListItem leftIcon="warning" caption={JSON.stringify(err)} />)}
    </List>
    : null;
};

ErrorsComponent.propTypes = {
  errors: PropTypes.array,
  onCloseErrors: PropTypes.func,
};

export const mapStateToProps = state => ({
  errors: selErrors(state),
});

export const mapDispatchToProps = dispatch => ({
  onCloseErrors: () => dispatch(clearHttpErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorsComponent);
