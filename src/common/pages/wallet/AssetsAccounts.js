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
import AddAssetsDialog from './AddAssetsDialog';
import TransferDialog from './TransferDialog';
import assetsUtil from './assetsUtil';
import './Assets.less';
import * as CommonAction from '../../redux/actions/CommonAction';
import { getLpTokenStr } from '../../utils/lpTokenUtil';
import util from '../../utils/util';
import vector from '_src/assets/images/vector.svg'
import operationContract from './operationContract'
import web3Util from '_src/utils/web3Util'
import env from '_src/constants/env';

function mapStateToProps(state) {
  const { legalId, legalObj, legalList, privateKey } = state.Common;
  return {
    legalId,
    legalObj,
    legalList,
    privateKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class AssetsAccounts extends Component {
  constructor(props) {
    super(props);
    this.allCurrencies = [];
    this.state = {
      currencies: [],
      tokenList: [],
      tokenMap: {},
      showTransfer: false,
      showAddAssets: false,
      transferSymbol: '',
      loading: false,
      okbTotalValuation: '--',
      legalTotalValuation: '--',
      hideZero: true,
      valuationUnit: '--',
    };
    this.contractList = []
    this.symbolSearch = '';
    this.addr = window.OK_GLOBAL.senderAddr;
    this.generalAddr = window.OK_GLOBAL.generalAddr;
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
    const fetchContract = () => new Promise(resolve => {
      console.log('fetchContract')
      let contractPromiseList = operationContract.get().map(async it => {
        const available = await web3Util.getBalance(it.address, this.generalAddr)
        return Promise.resolve({
          original_symbol: it.shortName,
          originalAndWhole: '',
          symbol: it.address,
          precision: it.precision,
          locked: '0',
          available,
          assetsType: 'OIP 20'
        })
      })
      Promise.allSettled(contractPromiseList).then(res => {
        let response = []
        res.forEach(item => (item.status === 'fulfilled') && response.push(item.value))
        resolve(response)
      }).catch(() => resolve([]))
    })
    /* 
      currencies.unshift(...response)
      this.contractList = response
      let oktIndex = currencies.findIndex(it => it.symbol === env.envConfig.token.base)
      let oktItem = currencies.slice(oktIndex, oktIndex + 1)
      if (oktIndex > -1) {
        currencies.splice(oktIndex, 1)
        currencies.unshift(...oktItem)
      }
    */
    const fetchAccounts = () => new Promise((resolve) => {
      console.log('fetchAccounts')
      ont
        .get(`${URL.GET_ACCOUNTS}/${this.addr}`, {
          params: { show: this.state.hideZero ? undefined : 'all' },
        })
        .then(({ data }) => {
          let { currencies=[] } = data;
          resolve(currencies.filter(d => {
            if(!this.state.hideZero) return true;
            return !!Number(util.precisionInput(d.available,8,false));
          }))
        })
        .catch(() => {
          resolve([]);
        });
    });
    const fetchTokens = () => new Promise((resolve) => {
      console.log('fetchTokens')
      ont
        .get(URL.GET_TOKENS)
        .then(({ data }) => {
          const tokenMap = {};
          /* 
            description: "ammswap_btck-ba9_ethk-c63"
            mintable: true
            original_symbol: "ammswap_btck-ba9_ethk-c63"
            original_total_supply: "0.000000000000000000"
            owner: "okexchain1p6mshmwh5kz0g62pe6hghrjc696cyp7l0nf0st"
            symbol: "ammswap_btck-ba9_ethk-c63"
            total_supply: "0.000000000000000000"
            type: "2"
            whole_name: "ammswap_btck-ba9_ethk-c63"
          
          */
          // debugger
          data.push(...this.contractList)
          const tokenList = data.map((token) => {
            const { symbol, original_symbol, whole_name } = token;
            const originalAndWhole = `${original_symbol.toUpperCase()}___${whole_name}`;
            tokenMap[symbol] = { ...token, originalAndWhole };
            return {
              value: symbol,
              label: (
                <span>
                  <span className="symbol-left">
                    {getLpTokenStr(original_symbol)}
                  </span>
                </span>
              ),
              aa: getLpTokenStr(original_symbol)
            };
          });
          console.log(tokenList, 'tokenList---')
          this.setState({ tokenList, tokenMap });
          resolve(tokenMap);
        })
        .catch((e) => {
          console.log(e)
          resolve({});
        });
    });
    fetchContract().then(response => {
      this.contractList = response
      return Promise.all([fetchAccounts(), fetchTokens()])
    }).then(([currencies, tokenMap]) => {
        const originalAndWholeCounts = {};
        currencies.unshift(...this.contractList)
        let oktIndex = currencies.findIndex(it => it.symbol === env.envConfig.token.base)
        let oktItem = currencies.slice(oktIndex, oktIndex + 1)
        if (oktIndex > -1) {
          currencies.splice(oktIndex, 1)
          currencies.unshift(...oktItem)
        }
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
          const { symbol, available, freeze, locked, assetsType } = curr;
          
          const tokenObj = tokenMap[symbol] || (curr.original_symbol ? curr : {
            original_symbol: '',
          }) ;
          const { original_symbol, originalAndWhole } = tokenObj;
          const symbolUp = symbol.toUpperCase();
          const assetToken = (original_symbol || '').toUpperCase() || symbolUp;
          const sumOKB = calc.add(
            calc.add(available || 0, freeze || 0, false),
            locked || 0,
            false
          );
          if (!assetsType) {
            curr.assetsType = 'OIP 10'
          }
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
  openAddAssets = () => {
    this.setState({
      showAddAssets: true,
    });
  };
  closeAddAssets = () => {
    this.setState({
      showAddAssets: false,
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
  addAssetsSuccess = () => {
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
  addAssets = () => {
    this.openAddAssets()
  }
  render() {
    const {
      currencies,
      showTransfer,
      showAddAssets,
      transferSymbol,
      loading,
      tokenList,
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
            <div className="add-assets cursor-pointer" onClick={this.addAssets}>
              <img src={vector} alt=""/>{toLocale('add_assets')}
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
          style={{ clear: 'both', zIndex: 0 }}
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
        <AddAssetsDialog
          show={showAddAssets}
          // symbol={transferSymbol}
          tokenList={tokenList}
          tokenMap={tokenMap}
          onClose={this.closeAddAssets}
          onSuccess={this.addAssetsSuccess}
        />
      </div>
    );
  }
}

export default AssetsAccounts;
