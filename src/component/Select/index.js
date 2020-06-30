import React from 'react';
import Select from 'react-select';
import Icon from '_src/component/IconLite';

const arrowRenderer = ({ isOpen }) => {
  return <Icon className={isOpen ? 'icon-fold' : 'icon-Unfold'} />;
};

const index = ({ ...props }) => {
  return (
    <Select {...props} arrowRenderer={arrowRenderer} />
  );
};

export default index;
