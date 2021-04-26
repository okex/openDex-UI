import React from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getDisplaySymbol } from '_src/utils/coinIcon';
import Enum from '../../utils/Enum';
import DepthTitle from './DepthTitle';
import DepthList from './DepthList';

import './Depth.less';

export default class Depth extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.init = false;
    this.enum = {
      buy: Enum.placeOrder.type.buy,
      sell: Enum.placeOrder.type.sell,
    };
  }

  onChooseOneDepth = (index, type) => {
    const config = window.OK_GLOBAL.productConfig;
    const { onChooseOneDepth, listSource } = this.props;
    const sizeTruncate = 'max_size_digit' in config ? config.max_size_digit : 2;
    if (typeof onChooseOneDepth !== 'undefined') {
      let amount = 0;
      let price = 0;
      if (type === this.enum.buy) {
        price = listSource.buyList[index].price.replace(/,/g, '');
        amount = listSource.buyList[index].sum.replace(/,/g, '');
      } else {
        price = listSource.sellList[index].price.replace(/,/g, '');
        amount = listSource.sellList[index].sum.replace(/,/g, '');
      }
      amount = Number(amount).toFixed(sizeTruncate);
      onChooseOneDepth(price, amount, type);
    }
  };

  onDepthPosition = (position) => {
    this.depthList.scrollToPosition(position);
  };

  getListDataSource = () => {
    const { needSum, listSource, tickerSource, product } = this.props;
    const tradeCurr =
      product.indexOf('_') > -1 ? product.split('_')[0].toUpperCase() : '';
    const baseCurr =
      product.indexOf('_') > -1 ? product.split('_')[1].toUpperCase() : '';

    const listDataSource = {
      ...listSource,
      ticker: {
        price: tickerSource.price,
        trend:
          tickerSource.change &&
          tickerSource.change.toString().indexOf('-') > -1
            ? 'down'
            : 'up',
      },
    };
    const priceTitle = (
      <span>
        {toLocale('spot.price')}(<em>{getDisplaySymbol(baseCurr)}</em>)
      </span>
    );
    const sizeTitle = (
      <span>
        {toLocale('spot.depth.amount')}(
        <em>{util.getSymbolShortName(tradeCurr)}</em>)
      </span>
    );
    const columnTitle = [priceTitle, sizeTitle];
    if (needSum) {
      const sumTitle = (
        <span>
          {toLocale('spot.depth.sum')}(
          <em>{util.getSymbolShortName(tradeCurr)}</em>)
        </span>
      );
      columnTitle.push(sumTitle);
    }
    return {
      columnTitle,
      dataSource: listDataSource,
    };
  };

  render() {
    const listDataSource = this.getListDataSource();
    const {
      needHeadBtn,
      needBgColor,
      needSum,
      product,
      isShowMerge,
      onChooseMergeType,
      theme,
    } = this.props;
    return (
      <div className="spot-depth">
        <DepthTitle
          theme={theme}
          needHeadBtn={needHeadBtn}
          onDepthPosition={this.onDepthPosition}
        />
        <DepthList
          ref={(ref) => {
            this.depthList = ref;
          }}
          needSum={needSum}
          needBgColor={needBgColor}
          columnTitle={listDataSource.columnTitle}
          dataSource={listDataSource.dataSource}
          toCenterLabel={toLocale('spot.depth.backToCenter')}
          selectItem={this.onChooseOneDepth}
          theme={theme}
          product={product}
          isShowMerge={isShowMerge}
          onChooseMergeType={onChooseMergeType}
        />
      </div>
    );
  }
}
Depth.propTypes = {
  listSource: PropTypes.object.isRequired,
  tickerSource: PropTypes.object.isRequired,
  product: PropTypes.string.isRequired,
  needSum: PropTypes.bool,
  needHeadBtn: PropTypes.bool,
  needBgColor: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
  onChooseMergeType: PropTypes.func,
  onChooseOneDepth: PropTypes.func,
};

Depth.defaultProps = {
  needSum: false,
  needHeadBtn: false,
  needBgColor: false,
  theme: 'light',
  onChooseMergeType: null,
  onChooseOneDepth: null,
};
