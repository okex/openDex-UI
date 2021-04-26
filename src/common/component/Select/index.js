import React from 'react';
import Select from 'react-select';
import Icon from '_src/component/IconLite';

const arrowRenderer = ({ isOpen }) => (
  <Icon className={isOpen ? 'icon-fold' : 'icon-Unfold'} />
);

const index = ({ ...props }) => (
  <Select {...props} arrowRenderer={arrowRenderer} />
);

export default index;
