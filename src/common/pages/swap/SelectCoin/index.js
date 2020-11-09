import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../util/coinIcon';

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
    const list = data.filter((d) => d.symbol.match(new RegExp(search,'gi')));
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
                    {d.symbol.toUpperCase()}
                  </div>
                  <div className="value">{d.available}</div>
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
