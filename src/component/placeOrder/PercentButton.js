/**
 * 用于挂单的百分比按钮
 * Created by wanghongguang on 2018-06-08
 */
import React from 'react';
import PropTypes from 'prop-types';

const PercentButton = (props) => {
  const { percentValue, chosen, onClick } = props;
  const activeCls = chosen ? ' active' : '';
  return (
    <div className={`input-container mar-left5 percent-btn ${activeCls}`} onClick={onClick}>
      { percentValue }%
    </div>
  );
};
PercentButton.propTypes = {
  percentValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  chosen: PropTypes.bool,
  onClick: PropTypes.func
};
PercentButton.defaultProps = {
  chosen: false,
  onClick: null
};

export default PercentButton;
