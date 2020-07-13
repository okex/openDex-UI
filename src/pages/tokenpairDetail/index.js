import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import './index.less';

class TokenpairDetail extends Component {
  constructor() {
    super();
    this.state = {
      isActionLoading: false,
    };
  }

  render() {
    const { isActionLoading } = this.state;

    return (
      <DexDesktopContainer
        className="tokenpair-detail-page"
        isShowAddress
        needLogin
        loading={isActionLoading}
      >
        123
      </DexDesktopContainer>
    );
  }
}

export default TokenpairDetail;
