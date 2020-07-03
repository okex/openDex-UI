import React, { Component } from 'react';
import DexSwitch from '_component/DexSwitch';
import Select from '_component/ReactSelect';
import DexDesktopInput from '_component/DexDesktopInput';
import './TabLocal.less';

const defaultOptions = [
  { value: 0, label: '币币' },
  { value: 1, label: '杠杆' },
  { value: 2, label: '其他' },
];

class TabLocal extends Component {
  constructor() {
    super();
    this.state = {
      options: defaultOptions,
      selected: defaultOptions[0],
      p2p: '',
      rpc: '',
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

  render() {
    const {
      options, selected, p2p, rpc
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
