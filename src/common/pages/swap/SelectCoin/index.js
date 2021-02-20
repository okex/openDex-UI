import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon, getDisplaySymbol } from '../../../utils/coinIcon';
import util from '_src/utils/util';

export default class SelectCoin extends React.Component {
  constructor() {
    super();
    this.state = {
      search: '',
      data: [],
    };
    this.init = false;
  }

  search = (e) => {
    const search = e.target.value;
    this.setState({ search });
  };

  select(coin) {
    const { onSelect } = this.props;
    if (onSelect) onSelect(coin);
  }

  async componentDidMount() {
    this.init = true;
    const { loadCoinList } = this.props;
    if (loadCoinList) {
      const data = await loadCoinList();
      this.setState({ data });
    }
  }

  render() {
    const { data, search } = this.state;
    let list;
    try {
      list = data.filter((d) => d.symbol.match(new RegExp(search, 'gi')));
    } catch(e) {
      console.log(e);
      list = [];
    }
    return this.init ? (
      <div className="panel-coin-search">
        <div className="search-wrap iconfont">
          <input
            placeholder={toLocale('Search name')}
            defaultValue={search}
            onInput={this.search}
          />
        </div>
        <div className="search-content-wrap">
          <div className="search-content-items">
            {list.length ? (
              list.map((d, index) => (
                <div
                  className="search-content-item"
                  key={index}
                  onClick={() => this.select(d)}
                >
                  <div className="name">
                    <img src={getCoinIcon(d.symbol)} />
                    {getDisplaySymbol(d.symbol)}
                  </div>
                  <div className="value">
                    {util.precisionInput(d.available, 8)}
                  </div>
                </div>
              ))
            ) : (
              <div className="nodata">{toLocale('No Records')}</div>
            )}
          </div>
        </div>
      </div>
    ) : null;
  }
}
