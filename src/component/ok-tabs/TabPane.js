import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.less';

export default class TabPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="ok-Tabpane" style={{ display: this.props.display, ...this.props.style }}>
        {this.props.children}
      </div>
    );
  }
}

TabPane.propTypes = {
  // label: PropTypes.oneOfType([
  //   PropTypes.object,
  //   PropTypes.string
  // ]),
  display: PropTypes.string,
  // tabBarExtraContent: PropTypes.oneOfType([
  //   PropTypes.object,
  //   PropTypes.string
  // ])
};
TabPane.defaultProps = {
  // label: '- -',
  display: 'block',
  // tabBarExtraContent: null
};
