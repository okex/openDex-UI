import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LocalNodeAction from '_app/redux/actions/LocalNodeAction';
import * as NodeActions from '_app/redux/actions/NodeAction';
import DexSwitch from '_component/DexSwitch';
import Select from '_component/ReactSelect';
import DexDesktopInput from '_component/DexDesktopInput';
import DexUpload from '_app/component/DexUpload';
import { formatEstimatedTime } from '_src/utils/node';
import { NODE_TYPE } from '_constants/Node';
import util from '_src/utils/util';
import './TabLocal.less';

const defaultOptions = [{ value: 0, label: 'TestNet' }];

function mapStateToProps(state) {
  const { currentNode } = state.NodeStore;
  const {
    isStarted,
    p2p,
    rest,
    ws,
    datadir,
    db,
    estimatedTime,
  } = state.LocalNodeStore;
  return {
    currentNode,
    isStarted,
    p2p,
    rest,
    ws,
    datadir,
    db,
    estimatedTime,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    localNodeAction: bindActionCreators(LocalNodeAction, dispatch),
    nodeActions: bindActionCreators(NodeActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class TabLocal extends Component {
  constructor() {
    super();
    this.state = {
      options: defaultOptions,
      selected: defaultOptions[0],
    };
    this.onSwitchChange = util.debounce(this.onSwitchChange, 300);
  }

  onChange = () => (option) => {
    this.setState({ selected: option });
  };

  onP2pChange = (e) => {
    const { localNodeAction } = this.props;
    localNodeAction.updateP2p(e.target.value);
  };

  onRestChange = (e) => {
    const { localNodeAction } = this.props;
    localNodeAction.updateRest(e.target.value);
  };

  onDatadirChange = (e) => {
    this.updateDatadir(e.target.value);
  };

  onDatadirUpdate = (path) => {
    this.updateDatadir(path);
  };

  onDbChange = (e) => {
    this.updateDb(e.target.value);
  };

  onDbUpdate = (path) => {
    this.updateDb(path);
  };

  onWsChange = (e) => {
    const { localNodeAction } = this.props;
    localNodeAction.updateWs(e.target.value);
  };

  onSwitchChange = (checked) => {
    const { localNodeAction, datadir, currentNode } = this.props;
    if (checked) {
      localNodeAction.startOkexchaind(
        datadir,
        () => {
          if (currentNode === NODE_TYPE.NONE) {
            this.props.nodeActions.updateCurrentNode({
              type: NODE_TYPE.LOCAL,
            });
          }
        },
        true
      );
    } else {
      localNodeAction.stopOkexchaind(true);
    }
  };

  updateDatadir = (datadir) => {
    const { localNodeAction } = this.props;
    localNodeAction.updateDatadir(datadir);
  };

  updateDb = (db) => {
    const { localNodeAction } = this.props;
    localNodeAction.updateDb(db);
  };

  render() {
    const { isStarted, p2p, rest, ws, datadir, db, estimatedTime } = this.props;
    const { options, selected } = this.state;
    const fEstimatedTime = formatEstimatedTime(estimatedTime);

    return (
      <div className="node-local-container">
        <div className="node-local-switch">
          <div className="local-switch-title">Locally hosted</div>
          {estimatedTime > 0 && (
            <div className="local-switch-desc">
              （Estimated time {fEstimatedTime}）
            </div>
          )}
          <DexSwitch
            checked={isStarted}
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={this.onSwitchChange}
          />
        </div>
        <div className="local-set-container">
          <div className="local-set-cell">
            <label htmlFor="" className="local-set-label">
              Network
            </label>
            <Select
              className="network-select"
              clearable={false}
              searchable={false}
              theme="dark"
              name="form-field-name"
              value={selected}
              onChange={this.onChange()}
              options={options}
            />
          </div>
          <div className="local-set-cell">
            <DexUpload
              label="Datadir"
              value={datadir}
              onChange={this.onDatadirChange}
              onUpload={this.onDatadirUpdate}
              directory
            />
          </div>
          <div className="local-set-cell">
            <DexDesktopInput
              label="P2P Port"
              value={p2p}
              onChange={this.onP2pChange}
            />
          </div>
          <div className="local-set-cell">
            <DexDesktopInput
              label="REST Port"
              value={rest}
              onChange={this.onRestChange}
            />
          </div>
          <div className="local-set-cell">
            <DexUpload
              label="DB"
              value={db}
              onChange={this.onDbChange}
              onUpload={this.onDbUpdate}
            />
          </div>
          <div className="local-set-cell">
            <DexDesktopInput
              label="WS Port"
              value={ws}
              onChange={this.onWsChange}
            />
          </div>
        </div>
        <div className="local-set-terminal">
          <h4 className="local-terminal-title">Terminal</h4>
          <div className="local-terminal-content" id="local-terminal-content" />
        </div>
      </div>
    );
  }
}

export default TabLocal;
