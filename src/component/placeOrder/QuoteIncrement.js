import React from 'react';
import { toLocale } from '_src/locale/react-locale';

export default class QuoteIncrement extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      extra: ''
    };
  }

  render() {
    const { productConfig } = window.OK_GLOBAL;
    const { quoteIncrement } = productConfig;
    if (quoteIncrement != 0) {
      return (
        <div className="tooltip-content">
          {
            toLocale('spot.place.tips.must') +
            quoteIncrement + this.state.extra +
            toLocale('spot.place.tips.multiple')
          }
        </div>
      );
    }
    return (<div />);
  }
}
