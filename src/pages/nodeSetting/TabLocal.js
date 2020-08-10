import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LocalNodeAction from '_src/redux/actions/LocalNodeAction';
import DexSwitch from '_component/DexSwitch';
import Select from '_component/ReactSelect';
import DexDesktopInput from '_component/DexDesktopInput';
import DexUpload from '_component/DexUpload';
import { htmlLineBreak, emptyLineBreak } from '_src/utils/ramda';
import './TabLocal.less';

const electronUtils = window.require('electron').remote.require('./src/utils');

const defaultOptions = [
  { value: 0, label: 'TestNet' },
];

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    logs, isStarted,
  } = state.LocalNodeStore;
  return {
    logs,
    isStarted,
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    localNodeAction: bindActionCreators(LocalNodeAction, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class TabLocal extends Component {
  constructor() {
    super();
    this.state = {
      options: defaultOptions,
      selected: defaultOptions[0],
      p2p: '',
      rest: '',
      datadir: '',
      db: '',
      ws: '',
    };
  }

  componentDidMount() {
    this.initData();
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

  onRestChange = (e) => {
    this.setState({
      rest: e.target.value
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

  onSwitchChange = (checked) => {
    const { datadir } = this.state;
    const { localNodeAction } = this.props;
    if (checked) {
      localNodeAction.switchIsStarted(true);
      localNodeAction.initOkchaind(datadir);
    } else {
      localNodeAction.switchIsStarted(false);
      localNodeAction.stopOkchaind();
    }
  }

  initData = () => {
    const { shell } = electronUtils;
    shell.exec('cd $HOME && pwd', (code, stdout, stderr) => {
      const dir = stdout;
      const iDatadir = `${emptyLineBreak(dir)}/.okchaind`;
      const iDb = `${dir}/.okchaind/data/backend.sqlite3`;
      this.setState({
        datadir: iDatadir,
        db: iDb,
        p2p: '26656',
        rest: '26659',
        ws: '26661',
      });
    });
  }

  render() {
    const {
      options, selected, p2p, rest, datadir, db, ws,
    } = this.state;
    const { logs, isStarted } = this.props;
    const htmlLogs = htmlLineBreak(logs);

    return (
      <div className="node-local-container">
        <div className="node-local-switch">
          <div className="local-switch-title">Locally hosted</div>
          <div className="local-switch-desc">（Estimated time 1D）</div>
          <DexSwitch
            checked={isStarted}
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={this.onSwitchChange}
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
          <div className="local-terminal-content" dangerouslySetInnerHTML={{ __html: htmlLogs }} />
        </div>
      </div>
    );
  }
}

export default TabLocal;
