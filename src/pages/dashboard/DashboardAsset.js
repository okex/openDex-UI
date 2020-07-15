import React, { Component, Fragment } from 'react';
import { calc } from '_component/okit';
import { toLocale } from '_src/locale/react-locale';
import history from '_src/utils/history';
import PageURL from '_constants/PageURL';
import { getAccountsCols } from '_src/utils/table';
import DashboardSection from './DashboardSection';
import TransferDialog from '../wallet/TransferDialog';

class DashboardAsset extends Component {
  constructor() {
    super();
    this.state = {
      valuationUnit: '--',
      showTransfer: false,
      transferSymbol: '',
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  openTransfer = (symbol) => {
    return () => {
      this.setState({
        transferSymbol: symbol,
        showTransfer: true,
      });
    };
  };

  closeTransfer = () => {
    this.setState({
      showTransfer: false,
    });
  };

  transferSuccess = () => {
    this.props.onTransferSuccess();
  };

  toAssets = () => {
    history.push(PageURL.walletAssets);
  }

  render() {
    const {
      valuationUnit, showTransfer, transferSymbol,
    } = this.state;
    const { currencies, tokens, loading } = this.props;
    const tokenMap = {};
    const tokenList = tokens.map((token) => {
      const { symbol, original_symbol, whole_name } = token;
      const originalAndWhole = `${original_symbol.toUpperCase()}___${whole_name}`; // 用于计算数量
      tokenMap[symbol] = { ...token, originalAndWhole };
      return {
        value: symbol,
        label: <span><span className="symbol-left">{original_symbol.toUpperCase()}</span>{whole_name}</span>,
      };
    });
    const originalAndWholeCounts = {};
    currencies.forEach((curr) => {
      const { symbol } = curr;
      const tokenObj = tokenMap[symbol] || {};
      const { originalAndWhole } = tokenObj;
      if (originalAndWhole) {
        let count = originalAndWholeCounts[originalAndWhole] || 0;
        count++;
        originalAndWholeCounts[originalAndWhole] = count;
      }
    });
    const allCurrencies = currencies.map((curr) => {
      const {
        symbol, available, freeze, locked
      } = curr;
      const tokenObj = tokenMap[symbol] || {
        original_symbol: '',
      };
      const { original_symbol, originalAndWhole } = tokenObj; // 兼容旧版币种简称
      const symbolUp = symbol.toUpperCase();
      const assetToken = (original_symbol || '').toUpperCase() || symbolUp;
      const sumOKB = calc.add(calc.add(available || 0, freeze || 0), locked || 0);
      return {
        ...curr,
        ...tokenObj,
        assetToken,
        symbolId: originalAndWholeCounts[originalAndWhole] <= 1 ? '' : symbolUp,
        total: calc.showFloorTruncation(sumOKB, 8, false), // 资产返回8位，2020-01-10
      };
    });
    const fCurrencies = allCurrencies.slice(0, 3);

    return (
      <Fragment>
        <DashboardSection
          title={toLocale('dashboard_asset_title')}
          columns={getAccountsCols({ transfer: this.openTransfer }, { valuationUnit })}
          dataSource={fCurrencies}
          rowKey="symbol"
          isLoading={loading}
          empty={toLocale('assets_empty')}
          onClickMore={this.toAssets}
        />
        <TransferDialog
          show={showTransfer}
          symbol={transferSymbol}
          tokenList={tokenList}
          tokenMap={tokenMap}
          onClose={this.closeTransfer}
          onSuccess={this.transferSuccess}
        />
      </Fragment>
    );
  }
}

export default DashboardAsset;
