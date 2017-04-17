import React from 'react';
// import PropTypes from 'prop-types';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';

export default function Menu() {
  return (
    <IconMenu icon="menu" position="auto" menuRipple={false}>
      <MenuItem value="this" caption="This" />
      <MenuItem value="that" caption="That" />
      <MenuDivider />
      <MenuItem value="signout" icon="delete" caption="Delete" disabled />
    </IconMenu>
  );
}
