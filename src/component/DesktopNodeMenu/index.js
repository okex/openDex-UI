import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import * as NodeActions from '_src/redux/actions/NodeAction';
import * as LocalNodeAction from '_src/redux/actions/LocalNodeAction';
import { withRouter } from 'react-router-dom';
import Icon from '_component/IconLite';
import DexSwitch from '_component/DexSwitch';
import { Dialog } from '_component/Dialog';
import navBack from '_src/assets/images/nav_back@2x.png';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { getDelayType, timeUnit, getNodeRenderName, formatEstimatedTime } from '_src/utils/node';
import { NODE_TYPE } from '_constants/Node';
import { DEFAULT_NODE, NONE_NODE } from '_constants/apiConfig';
import './index.less';

function mapStateToProps(state) {
  const { latestHeight } = state.Common;
  const { currentNode, remoteList, customList } = state.NodeStore;
  const {
    logs, isStarted, datadir, localHeight, estimatedTime, isSync,
  } = state.LocalNodeStore;
  return {
    latestHeight,
    currentNode,
    remoteList,
    customList,
    logs,
    isStarted,
    datadir,
    localHeight,
    estimatedTime,
    isSync,
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
      isMenuShow: false
    };
    this.outOfSyncDialog = null;
  }

  componentDidMount() {
    this.heightTimer = setInterval(() => {
      ont.get(URL.GET_LATEST_HEIGHT_MASTER).then((res) => {
        if (res.data) {
          const { commonAction } = this.props;
          commonAction.updateLatestHeight(res.data);
        }
      }).catch((err) => {
        console.log(err);
      });
    }, 3000);
  }

  componentDidUpdate(prevProps) {
    const { isSync: oldIsSync } = prevProps;
    const { isSync: nowIsSync, location = {} } = this.props;
    const isShowDialog = oldIsSync && !nowIsSync && location.pathname === PageURL.spotFullPage && !this.outOfSyncDialog;
    if (isShowDialog) {
      this.outOfSyncDialog = Dialog.show({
        onClose: () => {
          this.outOfSyncDialog.destroy();
          this.outOfSyncDialog = null;
        },
        className: 'out-of-dialog',
        title: 'Connection out of sync',
        children: (
          <div className="out-of-dialog-main">
            <div className="out-of-dialog-text">Your connection has been out of sync for 18 seconds.
          If the connection can be recovered this message will disappear automatically.
            </div>
            <div className="out-of-dialog-btn-content">
              <div
                className="ouf-of-dialog-solid-btn ouf-of-dialog-btn ouf-of-dialog-setting-btn"
                onClick={() => {
                  this.outOfSyncDialog.destroy();
                  this.outOfSyncDialog = null;
                  this.props.history.push(PageURL.nodeSettingPage);
                }}
              >
                NODES SETTINGS
              </div>
              <div
                className="ouf-of-dialog-hollow-btn ouf-of-dialog-btn ouf-of-dialog-cancel-btn"
                onClick={() => {
                  this.outOfSyncDialog.destroy();
                  this.outOfSyncDialog = null;
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        )
      });
    }
  }

  componentWillUnmount() {
    this.heightTimer && clearInterval(this.heightTimer);
  }

  onNodeClick = (node) => {
    return () => {
      const { nodeActions } = this.props;
      nodeActions.updateCurrentNode(node);
    };
  }

  onSwitchChange = (checked) => {
    const { localNodeAction, datadir } = this.props;
    if (checked) {
      localNodeAction.switchIsStarted(true);
      localNodeAction.startOkchaind(datadir);
    } else {
      localNodeAction.switchIsStarted(false);
      localNodeAction.stopOkchaind();
    }
  }

  handleToMore = () => {
    this.props.history.push(PageURL.nodeSettingPage);
  }

  showMenu = () => {
    this.setState({ isMenuShow: true });
  }

  hideMenu = () => {
    this.setState({ isMenuShow: false });
  }

  render() {
    const {
      latestHeight, currentNode, customList,
      isStarted, localHeight, estimatedTime,
    } = this.props;
    const { isMenuShow } = this.state;
    const { latency, type } = currentNode;
    const currentDelayType = getDelayType(latency);
    const remoteNode = type === NODE_TYPE.REMOTE ? currentNode : DEFAULT_NODE;
    const customNode = type === NODE_TYPE.CUSTOM ? currentNode : (customList[0] || {});
    const settingsNodeList = [remoteNode, customNode, NONE_NODE];
    const fEstimatedTime = formatEstimatedTime(estimatedTime);

    return (
      <div
        className="desktop-node-menu-wrapper"
        onMouseEnter={this.showMenu}
        onMouseLeave={this.hideMenu}
      >
        <img className="node-menu-back" src={navBack} alt="node-set-img" />
        <div className="desktop-node-menu-container" style={{ display: isMenuShow ? 'block' : 'none' }}>
          <div className="node-menu-item remote-node-item">
            <div className="node-menu-type">
              <div className="node-type">{toLocale('nodeMenu.remote')}</div>
              <Icon className={`icon-node color-${currentDelayType}`} />
              <Icon className="icon-retract" />
            </div>
            {
              (type === NODE_TYPE.NONE || type === NODE_TYPE.LOCAL) ? (
                <div className="node-assist">None</div>
              ) : (
                <Fragment>
                  <div className="node-assist">{toLocale('nodeMenu.block')} #{latestHeight}</div>
                  <div className={`node-assist color-${currentDelayType}`}>{toLocale('nodeMenu.latency')} {timeUnit(latency)}</div>
                </Fragment>
              )
            }
            <div className="node-sub-menu remote-node-submenu">
              {
                settingsNodeList.map((node, index) => {
                  const { id } = node;
                  const renderName = getNodeRenderName(node);
                  const delayType = getDelayType(node.latency);
                  const extraStyle = id === currentNode.id ? {
                    color: '#2D60E0',
                  } : {};
                  return id && (
                    <div
                      className="node-detail-container"
                      key={index}
                      onClick={this.onNodeClick(node)}
                    >
                      <div className="node-name" style={extraStyle}>{renderName}</div>
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
            {
              isStarted ? (
                <Fragment>
                  <div className="node-assist">{toLocale('nodeMenu.block')} #{localHeight}</div>
                  {
                    estimatedTime !== 0 && <div className="node-estimated">Estimated time {fEstimatedTime}</div>
                  }
                </Fragment>
              ) : (
                <div className="node-assist">{toLocale('node.stopped')}</div>
              )
            }
            <div className="node-sub-menu local-node-submenu">
              <div className="local-node-container">
                <div className="local-node-text">go-okchain</div>
                <DexSwitch
                  checked={isStarted}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  onChange={this.onSwitchChange}
                />
              </div>
              <div className="node-more" onClick={this.handleToMore}>{toLocale('nodeMenu.more')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DesktopNodeMenu;
