import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import * as NodeActions from '_app/redux/actions/NodeAction';
import * as LocalNodeAction from '_app/redux/actions/LocalNodeAction';
import { withRouter } from 'react-router-dom';
import Icon from '_component/IconLite';
import DexSwitch from '_component/DexSwitch';
import { Dialog } from '_component/Dialog';
import navBack from '_src/assets/images/nav_back@2x.png';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import {
  getDelayType,
  timeUnit,
  getNodeRenderName,
  formatEstimatedTime,
} from '_src/utils/node';
import { NODE_TYPE, NODE_LATENCY_TYPE } from '_constants/Node';
import { DEFAULT_NODE, NONE_NODE } from '_constants/apiConfig';
import util from '_src/utils/util';
import './index.less';

function mapStateToProps(state) {
  const { latestHeight } = state.Common;
  const {
    currentNode,
    remoteList,
    customList,
    breakTime: remoteNodeBreakTime,
    tempBreakTime: remoteNodeTempBreakTime,
  } = state.NodeStore;
  const {
    isStarted,
    datadir,
    localHeight,
    estimatedTime,
    isSync,
    breakTime: localNodeBreakTime,
    tempBreakTime: localNodeTempBreakTime,
  } = state.LocalNodeStore;
  return {
    latestHeight,
    currentNode,
    remoteList,
    customList,
    isStarted,
    datadir,
    localHeight,
    estimatedTime,
    isSync,
    localNodeBreakTime,
    localNodeTempBreakTime,
    remoteNodeBreakTime,
    remoteNodeTempBreakTime,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
    nodeActions: bindActionCreators(NodeActions, dispatch),
    localNodeAction: bindActionCreators(LocalNodeAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class DesktopNodeMenu extends Component {
  constructor() {
    super();
    this.state = {
      isMenuShow: false,
    };
    this.onSwitchChange = util.debounce(this.onSwitchChange, 300);
  }

  componentDidMount() {
    const { isStarted, localNodeAction } = this.props;
    if (isStarted) localNodeAction.startListen();
    this.heightTimer = setInterval(() => {
      ont.get(URL.GET_LATEST_HEIGHT_MASTER).then((res) => {
        if (res.data) {
          const { commonAction } = this.props;
          commonAction.updateLatestHeight(res.data);
        }
      });
    }, 3000);
  }

  componentWillUnmount() {
    this.heightTimer && clearInterval(this.heightTimer);
  }

  onNodeClick = (node) => () => {
    const { nodeActions } = this.props;
    nodeActions.updateCurrentNode(node);
  };

  onSwitchChange = (checked) => {
    const { localNodeAction, datadir, currentNode } = this.props;
    if (checked) {
      localNodeAction.startOkexchaind(datadir, () => {
        if (currentNode === NODE_TYPE.NONE) {
          this.props.nodeActions.updateCurrentNode({
            type: NODE_TYPE.LOCAL,
          });
        }
      });
    } else {
      localNodeAction.stopOkexchaind();
    }
  };

  handleToMore = () => {
    this.props.history.push(PageURL.nodeSettingPage);
  };

  showMenu = () => {
    this.setState({ isMenuShow: true });
  };

  hideMenu = () => {
    this.setState({ isMenuShow: false });
  };

  handleDialogClose = () => {
    const { currentNode = {} } = this.props;
    const { type } = currentNode;
    if (type === NODE_TYPE.REMOTE || type === NODE_TYPE.CUSTOM) {
      this.props.nodeActions.restartTempBreakTimer();
    }
  };

  render() {
    const {
      latestHeight,
      currentNode,
      customList,
      isStarted,
      localHeight,
      estimatedTime,
      localNodeBreakTime,
      remoteNodeBreakTime,
      localNodeTempBreakTime,
      remoteNodeTempBreakTime,
    } = this.props;
    const { isMenuShow } = this.state;
    const { latency, type } = currentNode;
    const currentDelayType = getDelayType(latency);
    const remoteNode = type === NODE_TYPE.REMOTE ? currentNode : DEFAULT_NODE;
    const customNode =
      type === NODE_TYPE.CUSTOM ? currentNode : customList[0] || {};
    const settingsNodeList = [remoteNode, customNode, NONE_NODE];
    const fEstimatedTime = formatEstimatedTime(estimatedTime);
    const isNoneOrLocalNode =
      type === NODE_TYPE.NONE || type === NODE_TYPE.LOCAL;
    const isRemoteOrCustom =
      type === NODE_TYPE.REMOTE || type === NODE_TYPE.CUSTOM;
    let nodeBreakTime = 0;
    let tempNodeBreakTime = 0;
    if (type === NODE_TYPE.LOCAL) {
      nodeBreakTime = localNodeBreakTime;
      tempNodeBreakTime = localNodeTempBreakTime;
    } else if (isRemoteOrCustom) {
      nodeBreakTime = remoteNodeBreakTime;
      tempNodeBreakTime = remoteNodeTempBreakTime;
    }

    return (
      <div
        className="desktop-node-menu-wrapper"
        onMouseEnter={this.showMenu}
        onMouseLeave={this.hideMenu}
      >
        <img className="node-menu-back" src={navBack} alt="node-set-img" />
        <div
          className="desktop-node-menu-container"
          style={{ display: isMenuShow ? 'block' : 'none' }}
        >
          <div className="node-menu-item remote-node-item">
            <div className="node-menu-type">
              <div className="node-type">{toLocale('nodeMenu.remote')}</div>
              <Icon className={`icon-node color-${currentDelayType}`} />
              <Icon className="icon-retract" />
            </div>
            {isNoneOrLocalNode ? (
              <div className="node-assist">None</div>
            ) : (
              <>
                <div className="node-assist">
                  {toLocale('nodeMenu.block')} #{latestHeight}
                </div>
                <div className={`node-assist color-${currentDelayType}`}>
                  {toLocale('nodeMenu.latency')} {timeUnit(latency)}
                </div>
              </>
            )}
            <div className="node-sub-menu remote-node-submenu">
              {settingsNodeList.map((node, index) => {
                const { id } = node;
                const renderName = getNodeRenderName(node);
                const delayType = isNoneOrLocalNode
                  ? NODE_LATENCY_TYPE.UNREACHABLE
                  : getDelayType(node.latency);
                const extraStyle =
                  id === currentNode.id
                    ? {
                        color: '#2D60E0',
                      }
                    : {};
                return (
                  id && (
                    <div
                      className="node-detail-container"
                      key={index}
                      onClick={this.onNodeClick(node)}
                    >
                      <div className="node-name" style={extraStyle}>
                        {renderName}
                      </div>
                      <Icon className={`icon-node color-${delayType}`} />
                    </div>
                  )
                );
              })}
              <div className="node-more" onClick={this.handleToMore}>
                {toLocale('nodeMenu.more')}
              </div>
            </div>
          </div>
          <div className="node-menu-item local-node-item">
            <div className="node-menu-type">
              <div className="node-type">{toLocale('nodeMenu.local')}</div>
              <Icon className="icon-node" />
              <Icon className="icon-retract" />
            </div>
            {isStarted ? (
              <>
                <div className="node-assist">
                  {toLocale('nodeMenu.block')} #{localHeight}
                </div>
                {estimatedTime !== 0 && (
                  <div className="node-estimated">
                    Estimated time {fEstimatedTime}
                  </div>
                )}
              </>
            ) : (
              <div className="node-assist">{toLocale('node.stopped')}</div>
            )}
            <div className="node-sub-menu local-node-submenu">
              <div className="local-node-container">
                <div className="local-node-text">go-okexchain</div>
                <DexSwitch
                  checked={isStarted}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  onChange={this.onSwitchChange}
                />
              </div>
              <div className="node-more" onClick={this.handleToMore}>
                {toLocale('nodeMenu.more')}
              </div>
            </div>
          </div>
        </div>
        <Dialog
          className="out-of-dialog"
          title="Connection out of sync"
          onClose={this.handleDialogClose}
          visible={tempNodeBreakTime > 15}
        >
          <div className="out-of-dialog-main">
            <div className="out-of-dialog-text">
              Your connection has been out of sync for {nodeBreakTime} seconds.
              If the connection can be recovered this message will disappear
              automatically.
            </div>
            <div className="out-of-dialog-btn-content">
              {isRemoteOrCustom && (
                <div
                  className="ouf-of-dialog-solid-btn ouf-of-dialog-btn ouf-of-dialog-reload-btn"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  TRY RECONNECTING NOW
                </div>
              )}
              <div
                className="ouf-of-dialog-solid-btn ouf-of-dialog-btn ouf-of-dialog-setting-btn"
                onClick={() => {
                  this.props.history.push(PageURL.nodeSettingPage);
                }}
              >
                NODES SETTINGS
              </div>
              <div
                className="ouf-of-dialog-hollow-btn ouf-of-dialog-btn ouf-of-dialog-cancel-btn"
                onClick={this.handleDialogClose}
              >
                Cancel
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default DesktopNodeMenu;
