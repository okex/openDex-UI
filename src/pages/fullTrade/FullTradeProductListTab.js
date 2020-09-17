import React, { Component, Fragment } from 'react';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import { calc } from '_component/okit';
import util from '_src/utils/util';
import noFavorites from '_src/assets/images/no_favorites@2x.png';
import noSearch from '_src/assets/images/no_search@2x.png';
import './FullTradeProductListTab.less';

const TYPE = {
  FAVORITE: 1,
  NORMAL: 2,
};

const SEARCH_TYPE = {
  TOKEN: 1,
  OWNER: 2,
};

class FullTradeProductListTab extends Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
    };
  }

  handleSelect = (item) => {
    return () => {
      const { onSelect } = this.props;
      if (onSelect) {
        onSelect(item);
      }
    };
  };

  handleFavorite = (item) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { onFavorite } = this.props;
      if (onFavorite) {
        onFavorite(item);
      }
    };
  };

  handleSearch = (e) => {
    this.setState({ searchText: e.target.value });
  };

  render() {
    const { tabList, type, activeId, searchType } = this.props;
    const { searchText } = this.state;
    const isFavoriteType = type === TYPE.FAVORITE;
    const listTitleCls = `product-list-title product-list-${
      isFavoriteType ? 'favorite' : 'normal'
    }`;
    const listItemCls = `product-list-item-new product-list-item-${
      isFavoriteType ? 'favorite' : 'normal'
    }`;
    const noneText = isFavoriteType
      ? toLocale('productList.noFavorite')
      : toLocale('productList.noResult');
    const showList = tabList.filter((item) => {
      let filterTag = true;
      if (searchText.trim() !== '') {
        const se =
          searchType === SEARCH_TYPE.TOKEN ? item.shortToken : item.owner;
        filterTag = se.indexOf(searchText.trim().toLowerCase().toString()) > -1;
      }
      return filterTag;
    });
    return (
      <div className="product-list-tab">
        <div className="search-bar">
          <input
            placeholder={toLocale('search')}
            onChange={this.handleSearch}
            value={searchText}
          />
          <Icon className="icon-search" />
        </div>
        <div className={listTitleCls}>
          <div className="product-item-pair">
            {toLocale('productList.item.pair')}
          </div>
          {isFavoriteType ? (
            <Fragment>
              <div className="product-item-change">
                {toLocale('productList.item.change')}
              </div>
              <div className="product-item-owner">
                {toLocale('productList.item.owner')}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="product-item-owner">
                {toLocale('productList.item.owner')}
              </div>
              <div className="product-item-deposit">
                {toLocale('productList.item.deposit')}
              </div>
            </Fragment>
          )}
        </div>
        {showList.length ? (
          <ul className="product-list-new">
            {showList.map((item, index) => {
              const {
                text,
                change,
                changePercentage,
                owner,
                id,
                deposits,
                isFavorite,
              } = item;
              const { denom, amount } = deposits;
              const color =
                change.toString().indexOf('-') > -1 ? 'red' : 'green';
              const starCls = isFavorite ? 'icon-Star favorite' : 'icon-Star';
              return (
                <li
                  className={
                    id === activeId ? `${listItemCls} active` : listItemCls
                  }
                  key={index}
                  onClick={this.handleSelect(item)}
                >
                  <div className="product-item-pair">
                    <span onClick={this.handleFavorite(item)}>
                      <Icon className={starCls} />
                    </span>
                    {util.getShortName(text)}
                  </div>
                  {isFavoriteType ? (
                    <Fragment>
                      <div
                        className={`product-item-change product-item-change-${color}`}
                      >
                        {changePercentage}
                      </div>
                      <div className="product-item-owner one-line">
                        {owner || '--'}
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="product-item-owner one-line">
                        {owner || '--'}
                      </div>
                      <div className="product-item-deposit">{`${calc.ceilTruncate(
                        amount,
                        0,
                        false
                      )} ${denom}`}</div>
                    </Fragment>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="product-list-none">
            <img src={isFavoriteType ? noFavorites : noSearch} />
            <div>{noneText}</div>
          </div>
        )}
      </div>
    );
  }
}

FullTradeProductListTab.TYPE = TYPE;
FullTradeProductListTab.SEARCH_TYPE = SEARCH_TYPE;

export default FullTradeProductListTab;
