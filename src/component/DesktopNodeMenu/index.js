import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { withRouter } from 'react-router-dom';
import Icon from '_component/IconLite';
import navBack from '_src/assets/images/nav_back@2x.png';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
// import ont from '_src/utils/dataProxy';
// import URL from '_constants/URL';
import { setcurrentNode, getDelayType } from '_src/utils/node';
import './index.less';

function mapStateToProps(state) {
  const { latestHeight } = state.Common;
  const { currentNode, remoteList } = state.NodeStore;
  return {
    latestHeight,
    currentNode,
    remoteList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class DesktopNodeMenu extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    // this.heightTimer = setInterval(() => {
    //   ont.get(URL.GET_LATEST_HEIGHT).then((res) => {
    //     if (res.data) {
    //       const { commonAction } = this.props;
    //       commonAction.updateLatestHeight(res.data);
    //     }
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // }, 3000);
  }

  componentWillUnmount() {
    this.heightTimer && clearInterval(this.heightTimer);
  }

  onNodeClick = (node) => {
    return () => {
      setcurrentNode(node);
    };
  }

  handleToMore = () => {
    this.props.history.push(PageURL.nodeSettingPage);
  }

  render() {
    const { latestHeight, currentNode, remoteList } = this.props;
    const delayTime = 55; // 先写死
    const delayType = getDelayType(delayTime);
    const settingsNodeList = remoteList.filter((node) => {
      return node.wsUrl !== currentNode.wsUrl;
    }).slice(0, 3);
    return (
      <div className="desktop-node-menu-wrapper">
        <img className="node-menu-back" src={navBack} alt="node-set-img" />
        <div className="desktop-node-menu-container">
          <div className="node-menu-item remote-node-item">
            <div className="node-menu-type">
              <div className="node-type">{toLocale('nodeMenu.remote')}</div>
              <Icon className={`icon-node color-${delayType}`} />
              <Icon className="icon-retract" />
            </div>
            <div className="node-assist">{toLocale('nodeMenu.block')} #{latestHeight}</div>
            <div className={`node-assist color-${delayType}`}>{toLocale('nodeMenu.latency')} 55MS</div>
            <div className="node-sub-menu remote-node-submenu">
              {
                settingsNodeList.map((node, index) => {
                  const { region, country, location } = node;
                  return (
                    <div
                      className="node-detail-container"
                      key={index}
                      onClick={this.onNodeClick(node)}
                    >
                      <div className="node-name">{`${region} - ${country} - ${location}`}</div>
                      <Icon className={`icon-node color-${delayType}`} />
                    </div>
                  );
                })
              }
              <div className="node-more" onClick={this.handleToMore}>{toLocale('nodeMenu.more')}</div>
            </div>
          </div>
          <div className="node-menu-item local-node-item">
            <div className="node-menu-type">
              <div className="node-type">{toLocale('nodeMenu.local')}</div>
              <Icon className="icon-node" />
              <Icon className="icon-retract" />
            </div>
            <div className="node-assist">{toLocale('node.stopped')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default DesktopNodeMenu;
