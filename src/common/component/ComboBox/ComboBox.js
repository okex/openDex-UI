import React from 'react';
import PropTypes from 'prop-types';
import './ComboBox.less';

export default class ComboBox extends React.Component {
  render() {
    return (
      <div className="ok-combo-box">
        <ul>
          {this.props.comboBoxDataSource.map((item, index) => {
            return (
              <li
                key={index}
                className={this.props.current === item.type ? 'active' : ''}
              >
                <a href={item.url}>{item.label}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

ComboBox.defaultProps = {
  comboBoxDataSource: [],
};
ComboBox.propTypes = {
  comboBoxDataSource: PropTypes.array,
};
