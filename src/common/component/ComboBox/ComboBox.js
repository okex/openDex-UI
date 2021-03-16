import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ComboBox.less';

export default class ComboBox extends React.Component {
  change(item) {
    const { onChange, data } = this.props;
    if (typeof onChange === 'function') onChange(item, data);
  }

  render() {
    const current = this.props.current.url || this.props.current;
    return (
      <div className="ok-combo-box">
        <ul>
          {this.props.comboBoxDataSource.map((item, index) => {
            return (
              <li key={index} className={current === item.type ? 'active' : ''}>
                {item.noLink ? <span onClick={() => this.change(item)}>{item.label}</span> :
                !item.isRoute ? (
                  <a href={item.url}>{item.label}</a>
                ) : (
                  <Link
                    to={item.url}
                    onClick={() => {
                      this.change(item);
                    }}
                  >
                    {item.label}
                  </Link>
                )}
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
