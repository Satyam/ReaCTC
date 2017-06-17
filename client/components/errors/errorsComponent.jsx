import React from 'react';
import PropTypes from 'prop-types';
import isPlainClick from '_utils/isPlainClick';

import { List, ListItem, ListDivider } from 'react-toolbox/lib/list';

export default function ErrorsComponent({ errors, onCloseErrors }) {
  const closeErrorsHandler = ev => isPlainClick(ev) && onCloseErrors();
  return errors.length
    ? <List>
      <ListItem caption="Click here to close all" onClick={closeErrorsHandler} />
      <ListDivider />
      {errors.map((err, idx) =>
        <ListItem key={idx} leftIcon="warning" caption={JSON.stringify(err)} />
      )}
    </List>
    : null;
}

ErrorsComponent.propTypes = {
  errors: PropTypes.array,
  onCloseErrors: PropTypes.func,
};
