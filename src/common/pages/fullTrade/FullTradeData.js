import React from 'react';
import InitWrapper from '_app/wrapper/InitWrapper';
import DialogSet from '../DialogSet';
import SpotTradeWrapper from '../../wrapper/SpotTradeWrapper';

@InitWrapper
@SpotTradeWrapper
class FullTradeData extends React.Component {
  render() {
    return <DialogSet />;
  }
}
export default FullTradeData;
