import React from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';

import Fee from './Fee';
import Enum from '../../utils/Enum';
import util from '../../utils/util';

const SubmitButton = (props) => {
  const { webType, webTypes, tradeType } = window.OK_GLOBAL;
  const {
    type,
    isLoading,
    canSubmit,
    warning,
    unit,
    onClick,
    isMargin,
  } = props;
  const extra = isMargin ? 'Margin' : '';
  let intlId = `spot.orders.actionBuy${extra}`;
  let classFix = 'buy';
  if (type === Enum.placeOrder.type.sell) {
    intlId = `spot.orders.actionSell${extra}`;
    classFix = 'sell';
  }
  let btnContent = `${toLocale(intlId)} ${unit}`;
  if (webType === webTypes.OKKr) {
    btnContent = unit + toLocale(intlId);
  }
  if (!util.isLogined()) {
    btnContent = `${toLocale('header_menu_create_wallet')} / ${toLocale(
      'header_menu_import_wallet'
    )}`;
  }
  const isFullTrade = tradeType === Enum.tradeType.fullTrade;
  const hasWarn = warning.trim() !== '';
  const isDisabled = isLoading || !canSubmit;
  return (
    <div className="spot-submit">
      <button
        className={isDisabled ? 'spot-disabled-btn' : `spot-submit-${classFix}`}
        onClick={util.debounce(onClick, 100)}
      >
        {isLoading ? toLocale('spot.submit.loading') : btnContent}
      </button>
      <div
        className="mar-top5 fz12"
        style={{ display: hasWarn ? 'block' : 'none', height: '13px' }}
      >
        {window.isBroker && !isFullTrade && !hasWarn ? <Fee /> : null}
        {hasWarn ? <div className="spot-err-tips">{warning}</div> : null}
      </div>
    </div>
  );
};

SubmitButton.propTypes = {
  type: PropTypes.number,
  unit: PropTypes.string,
  canSubmit: PropTypes.bool,
  isLoading: PropTypes.bool,
  warning: PropTypes.string,
  onClick: PropTypes.func,
  isMargin: PropTypes.bool,
};
SubmitButton.defaultProps = {
  type: 1,
  unit: '',
  canSubmit: true,
  isLoading: false,
  warning: '',
  isMargin: false,
  onClick: () => {},
};
export default SubmitButton;
