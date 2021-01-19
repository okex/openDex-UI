import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import FarmContext from './FarmContext';
import FarmPanel from './FarmPanel';
import DashboardPanel from './DashboardPanel';
import { toLocale } from '_src/locale/react-locale';
import SwapPushWrapper from '_app/wrapper/SwapPushWrapper';
import FirstPanel from './FirstPanel';
import './index.less';

const FIRST = '0';
const FARM = '1';
const DASHBOARD = '2';

@SwapPushWrapper
export default class Farm extends React.Component {
  constructor() {
    super();
    this.state = {
      activekey: FIRST,
    };
    this.farm = null;
    this.dashboard = null;
  }

  onChange = (activekey) => {
    this.setState({ activekey });
  };

  onFarm = () => {
    this.setState({ activekey: FARM });
  };

  onDashboard = () => {
    this.setState({ activekey: DASHBOARD });
  }

  componentDidMount() {
    this.preSeoTitle = document.title;
    document.title = toLocale('seoFarmTitle');
  }

  componentWillUnmount() {
    document.title = this.preSeoTitle;
  }

  render() {
    const { wsV3 } = this.props;
    const { activekey } = this.state;
    return (
      <FarmContext.Provider value={wsV3}>
        <div className="farm-container">
          <Tabs
            activeKey={activekey}
            prefixCls="farm"
            onChange={this.onChange}
            destroyInactiveTabPane
          >
            <TabPane tab={toLocale('First Pool')} key={FIRST}>
              <FirstPanel onDashboard={this.onDashboard}/>
            </TabPane>
            <TabPane tab={toLocale('Farm')} key={FARM}>
              <FarmPanel />
            </TabPane>
            <TabPane tab={toLocale('Dashboard')} key={DASHBOARD}>
              <DashboardPanel onFarm={this.onFarm} />
            </TabPane>
          </Tabs>
        </div>
      </FarmContext.Provider>
    );
  }
}
