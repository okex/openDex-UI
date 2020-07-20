import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import * as NodeActions from '_src/redux/actions/NodeAction';
import { withRouter } from 'react-router-dom';
import Icon from '_component/IconLite';
import navBack from '_src/assets/images/nav_back@2x.png';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
// import ont from '_src/utils/dataProxy';
// import URL from '_constants/URL';
import { getDelayType, timeUnit, getNodeRenderName } from '_src/utils/node';
import { NODE_TYPE } from '_constants/Node';
import { DEFAULT_NODE, NONE_NODE } from '_constants/apiConfig';
import './index.less';

function mapStateToProps(state) {
  const { latestHeight } = state.Common;
  const { currentNode, remoteList, customList } = state.NodeStore;
  return {
    latestHeight,
    currentNode,
    remoteList,
    customList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
    nodeActions: bindActionCreators(NodeActions, dispatch),
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
      const { nodeActions } = this.props;
      nodeActions.updateCurrentNode(node);
    };
  }

  handleToMore = () => {
    this.props.history.push(PageURL.nodeSettingPage);
  }

  render() {
    const {
      latestHeight, currentNode, customList
    } = this.props;
    const { latency, type } = currentNode;
    const currentDelayType = getDelayType(latency);
    const remoteNode = type === NODE_TYPE.REMOTE ? currentNode : DEFAULT_NODE;
    const customNode = type === NODE_TYPE.CUSTOM ? currentNode : (customList[0] || {});
    const settingsNodeList = [remoteNode, customNode, NONE_NODE];

    return (
      <div className="desktop-node-menu-wrapper">
        <img className="node-menu-back" src={navBack} alt="node-set-img" />
        <div className="desktop-node-menu-container">
          <div className="node-menu-item remote-node-item">
            <div className="node-menu-type">
              <div className="node-type">{toLocale('nodeMenu.remote')}</div>
              <Icon className={`icon-node color-${currentDelayType}`} />
              <Icon className="icon-retract" />
            </div>
            {
              type === NODE_TYPE.NONE ? (
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
            <div className="node-assist">{toLocale('node.stopped')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default DesktopNodeMenu;
