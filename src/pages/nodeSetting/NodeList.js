import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NodeActions from '_src/redux/actions/NodeAction';
import { NONE_NODE } from '_constants/apiConfig';
import NodeItem from './NodeItem';
import './NodeList.less';

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    currentNode, remoteList
  } = state.NodeStore;
  return {
    currentNode,
    remoteList,
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    nodeActions: bindActionCreators(NodeActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class NodeList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleChange = (node) => {
    return () => {
      const { nodeActions } = this.props;
      nodeActions.updateCurrentNode(node);
    };
  }

  render() {
    const { remoteList, currentNode } = this.props;
    const showList = remoteList.filter((node) => {
      return currentNode.id !== node.id;
    });

    return (
      <ul className="node-set-list">
        {
          showList.map((node) => {
            const {
              id, region, country, location, wsUrl, latency, httpUrl
            } = node;
            const name = node.id === NONE_NODE.id ? 'None' : `${region} - ${country} - ${location}`;
            return (
              <li className="node-set-list-item" key={id}>
                <NodeItem
                  name={name}
                  ws={wsUrl || '- -'}
                  http={httpUrl || '- -'}
                  delayTime={latency}
                  disabled={false}
                  onClick={this.handleChange(node)}
                />
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default NodeList;
