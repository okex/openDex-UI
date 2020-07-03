import React from 'react';
import RcSwitch from 'rc-switch';
import './index.less';

const DexSwitch = (props) => {
  const { className = '' } = props;
  const p = {
    ...props,
    className: className ? `dex-switch ${className}` : 'dex-switch',
  };
  return <RcSwitch {...p} />;
};

export default DexSwitch;
