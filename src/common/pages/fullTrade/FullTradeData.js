import React from 'react';
import DialogSet from '../../pages/DialogSet';
import SpotTradeWrapper from '../../wrapper/SpotTradeWrapper';
import InitWrapper from '_app/wrapper/InitWrapper';

@InitWrapper
@SpotTradeWrapper
class FullTradeData extends React.Component {
  render() {
    return <DialogSet />;
  }
}
export default FullTradeData;
