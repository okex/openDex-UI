import React from 'react';

const getRef = (Component) => (props) => {
  const { getRef, ...otherProps } = props;
  return <Component ref={getRef} {...otherProps} />;
};

export default getRef;
