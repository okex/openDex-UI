import React, { Component } from 'react';
import Select from '_component/ReactSelect';
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
    };
  }

  onChange = () => {
    return (option) => {
      this.setState({ selected: option });
    };
  }

  render() {
    const { options, selected } = this.state;
    return (
      <div className="node-local-container">
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
