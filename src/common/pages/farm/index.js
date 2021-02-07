import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import FarmContext from './FarmContext';
import FarmPanel from './FarmPanel';
import DashboardPanel from './DashboardPanel';
import { toLocale } from '_src/locale/react-locale';
import SwapPushWrapper from '_app/wrapper/SwapPushWrapper';
import { Dialog } from '../../component/Dialog';
import env from '../../constants/env';
import './index.less';

const FARM = '1';
const DASHBOARD = '2';

@SwapPushWrapper
export default class Farm extends React.Component {
  constructor() {
    super();
    this.state = {
      activekey: FARM,
      show: false,
    };
    this.farm = null;
    this.dashboard = null;
  }

  showDialog = (show = true) => {
    window.localStorage.setItem(
      env.envConfig.firstPoolConf.noticeSetting,
      'true'
    );
    this.setState({ show });
  };

  onChange = (activekey) => {
    this.setState({ activekey });
  };

  onFarm = () => {
    this.setState({ activekey: FARM });
  };

  onDashboard = () => {
    this.setState({ activekey: DASHBOARD });
  };

  componentDidMount() {
    this.preSeoTitle = document.title;
    document.title = toLocale('seoFarmTitle');
  }

  componentWillUnmount() {
    document.title = this.preSeoTitle;
  }

  render() {
    const { wsV3 } = this.props;
    const { activekey, show } = this.state;
    return (
      <>
        <FarmContext.Provider value={wsV3}>
          <div className="farm-container">
            <Tabs
              activeKey={activekey}
              prefixCls="farm"
              onChange={this.onChange}
              destroyInactiveTabPane
            >
              <TabPane tab={toLocale('Farm')} key={FARM}>
                <FarmPanel onDashboard={this.onDashboard}/>
              </TabPane>
              <TabPane tab={toLocale('Dashboard')} key={DASHBOARD}>
                <DashboardPanel onFarm={this.onFarm} />
              </TabPane>
            </Tabs>
          </div>
        </FarmContext.Provider>

        <Dialog visible={show} hideCloseBtn>
          <div className="dialog-stake-panel" style={{ width: '496px' }}>
            <div className="stake-panel-title">
              {toLocale('notice')}
              <span className="close" onClick={() => this.showDialog(false)}>
                ×
              </span>
            </div>
            <div className="stake-panel-content">
              <div className="infotip">{toLocale('first pool end')}</div>
            </div>
            <div className="stake-panel-footer nomargin noshadow">
              <div
                className="farm-btn cancel"
                onClick={() => this.showDialog(false)}
              >
                {toLocale('cancel')}
              </div>
              <div
                className="farm-btn"
                onClick={() => {
                  this.showDialog(false);
                  this.onDashboard();
                }}
              >
                {toLocale('Check')}
              </div>
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}
