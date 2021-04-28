import React from 'react';
import DepthWrapper from '../../wrapper/DepthWrapper';
import Depth from '../../component/depth/Depth';

const FullDepth = (props) => (
  <Depth {...props} theme="dark" needHeadBtn={true} needBgColor={true} />
);
export default DepthWrapper(FullDepth);
