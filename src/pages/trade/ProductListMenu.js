import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import LeftMenu from '../../component/leftMenu';
import ProductListWrapper from '../../wrapper/ProductListWrapper';

const ProductListMenu = (props) => {
  const {
    dataSource, activeId, searchText, onSearch, onSelect, onClickStar
  } = props;
  const listEmpty = toLocale('spot.noData');
  return (
    <LeftMenu
      searchBar
      searchPlaceholder={toLocale('search')}
      searchText={searchText}
      subTitle={[toLocale('pair'), toLocale('change')]}
      menuList={dataSource}
      listHeight={324}
      listEmpty={listEmpty}
      activeId={activeId}
      canStar
      onSearch={onSearch}
      onSelect={onSelect}
      onClickStar={onClickStar}
    />
  );
};
export default ProductListWrapper(ProductListMenu);
