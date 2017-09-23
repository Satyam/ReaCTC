import React from 'react';
import PropTypes from 'prop-types';
import { isPlainClick } from 'ctc-utils';

import { List, ListItem, ListDivider } from 'react-toolbox/lib/list';

export default function ErrorsComponent({ errors, onCloseErrors }) {
  const closeErrorsHandler = ev => isPlainClick(ev) && onCloseErrors();
  return errors.length
    ? <List>
      <ListItem caption="Click here to close all" onClick={closeErrorsHandler} />
      <ListDivider />
      {errors.map(err => <ListItem leftIcon="warning" caption={JSON.stringify(err)} />)}
    </List>
    : null;
}

ErrorsComponent.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  onCloseErrors: PropTypes.func,
};
