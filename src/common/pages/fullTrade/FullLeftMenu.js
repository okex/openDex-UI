import React from 'react';
import PropTypes from 'prop-types';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import './FullLeftMenu.less';
import ProductListWrapper from '../../wrapper/ProductListWrapper';

const SortTypes = {
  noSort: 'noSort',
  asc: 'asc',
  des: 'des',
};
const FullLeftMenu = class LeftMenu extends React.Component {
  static propTypes = {
    searchBar: PropTypes.bool,
    theme: PropTypes.string,
    canStar: PropTypes.bool,
  };

  static defaultProps = {
    searchBar: true,
    theme: '',
    canStar: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      menuList: props.dataSource,
      sortType: SortTypes.noSort,
      activeId: props.activeId,
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentWillReceiveProps(nextProps) {
    const { sortType } = this.state;
    const { dataSource, activeId } = nextProps;
    const newList = [...dataSource];
    if (sortType === SortTypes.noSort) {
      newList.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortType === SortTypes.asc) {
      newList.sort((a, b) => parseFloat(a.change) - parseFloat(b.change));
    } else if (sortType === SortTypes.des) {
      newList.sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
    }
    this.setState({
      menuList: newList,
      activeId,
    });
  }

  handleSearchChange = (e) => {
    const args = e.target.value;
    if (this.props.onSearch) {
      this.props.onSearch(args);
      return false;
    }
    const allList = this.props.dataSource;
    const filterList = allList.filter((item) =>
      [args.toLowerCase(), args.toUpperCase()].includes(item.text)
    );
    this.setState({
      menuList: filterList,
    });
    return false;
  };

  handleSort = () => {
    const { sortType, menuList } = this.state;
    const newList = [...menuList];
    let newSortType = SortTypes.noSort;
    if (sortType === SortTypes.asc) {
      newList.sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
      newSortType = SortTypes.des;
    } else if (sortType === SortTypes.des) {
      newList.sort((a, b) => a.text.localeCompare(b.text));
      newSortType = SortTypes.noSort;
    } else {
      newList.sort((a, b) => parseFloat(a.change) - parseFloat(b.change));
      newSortType = SortTypes.asc;
    }
    this.setState({
      sortType: newSortType,
      menuList: newList,
    });
  };

  handleStar = (item) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { onClickStar } = this.props;
    if (onClickStar) {
      onClickStar(!item.stared, item);
    }
  };

  handleSelect = (item) => () => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(item);
    }
  };

  renderList = (menuList) => {
    const { canStar } = this.props;
    const { activeId } = this.state;
    return (
      <div>
        {menuList.map((item, index) => {
          const { id, text, change, changePercentage, price } = item;
          let { stared, lever } = item;
          lever = null;
          stared = false;

          const color = change.toString().indexOf('-') > -1 ? 'red' : 'green';
          return (
            <li
              key={index}
              className={id === activeId ? 'active' : ''}
              onClick={this.handleSelect(item)}
            >
              <span className="pair" title={text}>
                {util.getShortName(text)}
              </span>
              {lever ? (
                <span className="lever">
                  <span>{lever}X</span>
                </span>
              ) : null}
              <span className="pair">{price}</span>
              <span className={`change change-${color}`}>
                {changePercentage}
              </span>
            </li>
          );
        })}
      </div>
    );
  };

  renderEmpty = () => {
    const listEmpty = toLocale('spot.noData');
    return <div className="empty-container">{listEmpty}</div>;
  };

  render() {
    const { searchBar, style, searchText, theme } = this.props;
    const { menuList, sortType } = this.state;
    const ascSort = sortType === SortTypes.asc;
    const desSort = sortType === SortTypes.des;
    const haveData = menuList && menuList.length > 0;
    const themeClass = theme || '';
    return (
      <div className={`ok-left-menu ${themeClass}`} style={style}>
        {searchBar ? (
          <div className="list-search">
            <div className="search-wrap">
              <input type="text" style={{ display: 'none' }} />
              <input
                type="text"
                autoComplete="off"
                value={searchText}
                placeholder={toLocale('search')}
                onChange={this.handleSearchChange}
                className="input-theme-controls input-query-product"
              />
              <Icon className="icon-search" />
            </div>
          </div>
        ) : null}
        <div className="list-head">
          <div>{toLocale('pair')}</div>
          <div>{toLocale('price')}</div>
          <div className="head-percentage">
            <div className="head-right" onClick={this.handleSort}>
              <span>{toLocale('change')}</span>
              <span className="change-icons">
                <Icon className={`${ascSort ? 'active' : ''} icon-retract`} />
                <Icon className={`${desSort ? 'active' : ''} icon-spread`} />
              </span>
            </div>
          </div>
        </div>
        <ul className="list-main">
          {haveData ? this.renderList(menuList) : this.renderEmpty()}
        </ul>
      </div>
    );
  }
};
export default ProductListWrapper(FullLeftMenu);
