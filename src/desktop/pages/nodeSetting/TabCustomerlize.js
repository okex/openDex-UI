import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NodeActions from '_app/redux/actions/NodeAction';
import { Dialog } from '_component/Dialog';
import iconNodeAdd from '_src/assets/images/icon_node_add.png';
import { MAX_LATENCY, NODE_TYPE } from '_constants/Node';
import { randomStrNumber } from '_src/utils/random';
import NodeItem from './NodeItem';
import './TabCustomerlize.less';

function mapStateToProps(state) {
  const { currentNode, customList } = state.NodeStore;
  return {
    currentNode,
    customList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    nodeActions: bindActionCreators(NodeActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class TabCustomerlize extends Component {
  constructor() {
    super();
    this.state = {
      isDialogShow: false,
      valueName: '',
      valueWs: '',
      valueHttp: '',
    };
  }

  onValueNameChange = (e) => {
    this.setState({ valueName: e.target.value });
  };

  onValueWsChange = (e) => {
    this.setState({ valueWs: e.target.value });
  };

  onValueHttpChange = (e) => {
    this.setState({ valueHttp: e.target.value });
  };

  onCancel = () => {
    this.closeDialog();
    this.clearInputValues();
  };

  onConfirm = () => {
    const { valueName, valueWs, valueHttp } = this.state;
    let id = '';
    const { customList } = this.props;
    let isExist = true;
    const checkExist = (node) => {
      return node.id === id;
    };
    while (isExist) {
      id = randomStrNumber(8);
      isExist = customList.some(checkExist);
    }
    const node = {
      id,
      name: valueName,
      wsUrl: valueWs,
      httpUrl: valueHttp,
      latency: MAX_LATENCY,
      type: NODE_TYPE.CUSTOM,
    };
    const newList = customList.slice();
    newList.push(node);
    const { nodeActions } = this.props;
    nodeActions.updateCustomList(newList);
    this.closeDialog();
    this.clearInputValues();
  };

  showDialog = () => {
    this.setState({ isDialogShow: true });
  };

  closeDialog = () => {
    this.setState({ isDialogShow: false });
  };

  clearInputValues = () => {
    this.setState({
      valueName: '',
      valueWs: '',
      valueHttp: '',
    });
  };

  handleChange = (node) => {
    return () => {
      const { nodeActions } = this.props;
      nodeActions.updateCurrentNode(node);
    };
  };

  handleDelete = (node) => {
    return (e) => {
      e.stopPropagation();
      const { customList } = this.props;
      const newList = customList.slice();
      const idx = newList.findIndex((n) => {
        return n.id === node.id;
      });
      if (idx > -1) {
        newList.splice(idx, 1);
        const { nodeActions } = this.props;
        nodeActions.updateCustomList(newList);
      }
    };
  };

  render() {
    const { isDialogShow, valueName, valueWs, valueHttp } = this.state;
    const { customList, currentNode } = this.props;
    const showList = customList.filter((node) => {
      return currentNode.id !== node.id;
    });

    return (
      <div className="node-customerlize-container">
        <div className="customerlize-add" onClick={this.showDialog}>
          <div className="add-text">ADD NODE</div>
          <div className="add-action">
            <img width="100%" src={iconNodeAdd} alt="pool" />
          </div>
        </div>
        <Dialog
          theme="base-dialog customerlize-dialog"
          visible={isDialogShow}
          onClose={this.closeDialog}
          title="Add Node"
        >
          <div className="cd-main">
            <div className="cd-input-container">
              <label className="cd-label">Name</label>
              <input
                className="cd-input"
                type="text"
                value={valueName}
                onChange={this.onValueNameChange}
              />
            </div>
            <div className="cd-input-container">
              <label className="cd-label">WS</label>
              <input
                className="cd-input"
                type="text"
                value={valueWs}
                onChange={this.onValueWsChange}
              />
            </div>
            <div className="cd-input-container">
              <label className="cd-label">RPC</label>
              <input
                className="cd-input"
                type="text"
                value={valueHttp}
                onChange={this.onValueHttpChange}
              />
            </div>
          </div>
          <div className="cd-btn-container">
            <div className="cd-btn cd-btn-cancel" onClick={this.closeDialog}>
              Cancel
            </div>
            <div className="cd-btn cd-btn-confirm" onClick={this.onConfirm}>
              Confirm
            </div>
          </div>
        </Dialog>
        {showList.length > 0 && (
          <ul className="custom-node-list">
            {showList.map((node) => {
              const { id, name, wsUrl, httpUrl, latency } = node;
              return (
                <li className="node-set-list-item" key={id}>
                  <NodeItem
                    name={name}
                    ws={wsUrl}
                    http={httpUrl}
                    delayTime={latency}
                    disabled={false}
                    onClick={this.handleChange(node)}
                    isRenderDelete
                    onDelete={this.handleDelete(node)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default TabCustomerlize;
