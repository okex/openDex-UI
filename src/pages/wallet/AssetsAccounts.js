import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { debounce } from 'throttle-debounce';
import URL from '_src/constants/URL';
import { calc } from '_component/okit';
import Checkbox from 'rc-checkbox';
import Icon from '_src/component/IconLite';
import DexTable from '_component/DexTable';
import ont from '../../utils/dataProxy';
import TransferDialog from './TransferDialog';
import assetsUtil from './assetsUtil';
import './Assets.less';
import * as CommonAction from '../../redux/actions/CommonAction';

function mapStateToProps(state) {
  const { legalId, legalObj, legalList } = state.Common;
  return {
    legalId,
    legalObj,
    legalList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class AssetsAccounts extends Component {
  /* eslint-disable react/sort-comp, camelcase */
  constructor(props) {
    super(props);
    this.allCurrencies = [];
    this.state = {
      currencies: [],
      tokenList: [],
      tokenMap: {},
      showTransfer: false,
      transferSymbol: '',
      loading: false,
      okbTotalValuation: '--',
      legalTotalValuation: '--',
      hideZero: true,
      valuationUnit: '--',
    };
    this.symbolSearch = '';
    this.addr = window.OK_GLOBAL.senderAddr;
  }
  componentDidMount() {
    this.props.commonAction.initOKExChainClient();
    document.title =
      toLocale('assets_tab_accounts') + toLocale('spot.page.title');
    if (this.addr) {
      this.fetchAccounts();
      document
        .querySelector('.search-symbol')
        .addEventListener('keyup', debounce(250, false, this.filterList));
    }
  }

  fetchAccounts = () => {
    this.setState({ loading: true });
    const fetchAccounts = new Promise((resolve) => {
      ont
        .get(`${URL.GET_ACCOUNTS}/${this.addr}`, {
          params: { show: this.state.hideZero ? undefined : 'all' },
        })
        .then(({ data }) => {
          const { currencies } = data;
          resolve(currencies || []);
        })
        .catch(() => {
          resolve([]);
        });
    });
    const fetchTokens = new Promise((resolve) => {
      ont
        .get(URL.GET_TOKENS)
        .then(({ data }) => {
          const tokenMap = {};
          const tokenList = data.map((token) => {
            const { symbol, original_symbol, whole_name } = token;
            const originalAndWhole = `${original_symbol.toUpperCase()}___${whole_name}`;
            tokenMap[symbol] = { ...token, originalAndWhole };
            return {
              value: symbol,
              label: (
                <span>
                  <span className="symbol-left">
                    {original_symbol.toUpperCase()}
                  </span>
                  {whole_name}
                </span>
              ),
            };
          });
          this.setState({ tokenList, tokenMap });
          resolve(tokenMap);
        })
        .catch(() => {
          resolve({});
        });
    });
    Promise.all([fetchAccounts, fetchTokens])
      .then(([currencies, tokenMap]) => {
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
        this.allCurrencies = currencies.map((curr) => {
          const { symbol, available, freeze, locked } = curr;
          const tokenObj = tokenMap[symbol] || {
            original_symbol: '',
          };
          const { original_symbol, originalAndWhole } = tokenObj;
          const symbolUp = symbol.toUpperCase();
          const assetToken = (original_symbol || '').toUpperCase() || symbolUp;
          const sumOKB = calc.add(
            calc.add(available || 0, freeze || 0),
            locked || 0
          );
          return {
            ...curr,
            ...tokenObj,
            assetToken,
            symbolId:
              originalAndWholeCounts[originalAndWhole] <= 1 ? '' : symbolUp,
            total: calc.showFloorTruncation(sumOKB, 8, false),
          };
        });
        this.setState({
          currencies: this.allCurrencies,
        });
      })
      .catch(() => {})
      .then(() => {
        this.setState({ loading: false });
      });
  };
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
    this.fetchAccounts();
  };
  filterList = (e) => {
    const symbol = e.target.value.trim().toLowerCase();
    this.symbolSearch = symbol;
    const { legalObj } = this.props;
    this.setFilteredList(legalObj);
  };
  toggleHideZero = (e) => {
    this.setState({ hideZero: e.target.checked }, this.fetchAccounts);
  };
  setFilteredList = (legalObj = {}) => {
    let filterList = this.allCurrencies;
    const symbol = this.symbolSearch;
    if (symbol) {
      filterList = this.allCurrencies.filter((c) => {
        return (
          (c.assetToken && c.assetToken.toLowerCase().includes(symbol)) ||
          (c.whole_name && c.whole_name.toLowerCase().includes(symbol))
        );
      });
    }
    this.setState({
      currencies: filterList,
    });
  };
  render() {
    const {
      currencies,
      showTransfer,
      transferSymbol,
      loading,
      tokenList,
      okbTotalValuation,
      legalTotalValuation,
      tokenMap,
      hideZero,
      valuationUnit,
    } = this.state;
    return (
      <div>
        <div className="query-container">
          <div>
            <Icon className="icon-enlarge search-symbol-icon" />
            <input
              className="search-symbol"
              placeholder={toLocale('assets_product_search')}
            />
            <label className="cursor-pointer hide-zero-checkbox">
              <Checkbox
                onChange={this.toggleHideZero}
                className="content-box"
                checked={hideZero}
              />
              {toLocale('assets_hide_zero')}
            </label>
          </div>
        </div>
        <DexTable
          isLoading={loading}
          columns={assetsUtil.accountsCols(
            { transfer: this.openTransfer },
            { valuationUnit }
          )}
          dataSource={currencies}
          rowKey="symbol"
          hidePage
          empty={<p>{toLocale('assets_empty')}</p>}
        />
        <TransferDialog
          show={showTransfer}
          symbol={transferSymbol}
          tokenList={tokenList}
          tokenMap={tokenMap}
          onClose={this.closeTransfer}
          onSuccess={this.transferSuccess}
        />
      </div>
    );
  }
}

export default AssetsAccounts;
