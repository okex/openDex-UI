import React from 'react';
import DepthWrapper from '../../wrapper/DepthWrapper';
import Depth from '../../component/depth/Depth';

const FullDepth = (props) => {
  return (<Depth
    {...props}
    theme="dark"
    needHeadBtn
    needBgColor
  />);
};
export default DepthWrapper(FullDepth);
