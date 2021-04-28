import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import { withRouter } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import SwapPushWrapper from '_app/wrapper/SwapPushWrapper';
import FarmContext from './FarmContext';
import './index.less';

const FARM = '1';
const DASHBOARD = '2';

@withRouter
@SwapPushWrapper
export default class Farm extends React.Component {
  onChange = (activekey) => {
    let route = PageURL.farmPage;
    if (activekey === DASHBOARD) {
      route = PageURL.myfarmingsPage;
    }
    this.props.history.push(route);
  };

  componentDidMount() {
    this.preSeoTitle = document.title;
    document.title = toLocale('seoFarmTitle');
  }

  componentWillUnmount() {
    document.title = this.preSeoTitle;
  }

  render() {
    const { wsV3, activekey = FARM, children } = this.props;
    return (
      <>
        <FarmContext.Provider value={wsV3}>
          <div className="farm-container">
            <Tabs
              activeKey={activekey}
              prefixCls="farm"
              onChange={this.onChange}
              destroyInactiveTabPane={true}
            >
              <TabPane tab={toLocale('Farm')} key={FARM}>
                {children}
              </TabPane>
              <TabPane tab={toLocale('Dashboard')} key={DASHBOARD}>
                {children}
              </TabPane>
            </Tabs>
          </div>
        </FarmContext.Provider>
      </>
    );
  }
}
