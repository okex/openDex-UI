import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

const WalletLeft = (props) => {
  const { stepNo, stepName, imgUrl } = props;
  return (
    <div className="wallet-left">
      <div className="title">
        <div className="step-no">
          <span className="current">
            {stepNo}
          </span>
          <span className="total">
            /3
          </span>
        </div>
        <div className="step-name">
          {stepName}
        </div>
      </div>

      <div className="img">
        <img src={imgUrl} />
      </div>
    </div>
  );
};
WalletLeft.propTypes = {
  stepNo: PropTypes.number,
  stepName: PropTypes.string,
  imgUrl: PropTypes.string
};
WalletLeft.defaultProps = {
  stepNo: 1,
  stepName: '',
  imgUrl: ''
};
export default WalletLeft;
