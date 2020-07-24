import React, { Component } from 'react';
import DexSwitch from '_component/DexSwitch';
import Select from '_component/ReactSelect';
import DexDesktopInput from '_component/DexDesktopInput';
import DexUpload from '_component/DexUpload';
import './TabLocal.less';

const defaultOptions = [
  { value: 0, label: 'TestNet' },
];

class TabLocal extends Component {
  constructor() {
    super();
    this.state = {
      options: defaultOptions,
      selected: defaultOptions[0],
      p2p: '',
      rpc: '',
      datadir: '',
      db: '',
      ws: '',
    };
  }

  onChange = () => {
    return (option) => {
      this.setState({ selected: option });
    };
  }

  onP2pChange = (e) => {
    this.setState({
      p2p: e.target.value
    });
  }

  onRpcChange = (e) => {
    this.setState({
      rpc: e.target.value
    });
  }

  onDatadirChange = (e) => {
    this.setState({
      datadir: e.target.value
    });
  }

  onDatadirUpdate = (path) => {
    this.setState({
      datadir: path
    });
  }

  onDbChange = (e) => {
    this.setState({
      db: e.target.value
    });
  }

  onDbUpdate = (path) => {
    this.setState({
      db: path
    });
  }

  onWsChange = (e) => {
    this.setState({
      ws: e.target.value
    });
  }

  render() {
    const {
      options, selected, p2p, rpc, datadir, db, ws
    } = this.state;
    return (
      <div className="node-local-container">
        <div className="node-local-switch">
          <div className="local-switch-title">Locally hosted</div>
          <div className="local-switch-desc">（Estimated time 1D）</div>
          <DexSwitch
            checkedChildren="开"
            unCheckedChildren="关"
          />
        </div>
        <div className="local-set-container">
          <div className="local-set-cell">
            <label htmlFor="" className="local-set-label">Network</label>
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
              label="RPC Port"
              value={rpc}
              onChange={this.onRpcChange}
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
          <div className="local-terminal-content" />
        </div>
      </div>
    );
  }
}

export default TabLocal;
