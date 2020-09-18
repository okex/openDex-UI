import React from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import util from '../../utils/util';

const AssetSpot = (props) => {
  const { dataSource, onTransfer } = props;
  return (
    <div>
      <div className="ok-asset spot">
        <div className="default-fz c-disabled">{toLocale('spot.asset')}</div>
        {dataSource.map((item) => {
          const { currencyName, available, locked } = item;
          return (
            <div className="asset-unit" key={currencyName}>
              <label>{util.getSymbolShortName(currencyName)}</label>
              <label>{toLocale('spot.asset.ava')}</label>
              <label className="weight">{available}</label>
              <label>/</label>
              <label>{toLocale('spot.asset.freeze')}</label>
              <label className="weight">{locked}</label>
            </div>
          );
        })}
        <div className="asset-right" />
      </div>
    </div>
  );
};

AssetSpot.propTypes = {
  dataSource: PropTypes.array,
};
AssetSpot.defaultProps = {
  dataSource: [
    {
      currencyName: ' --',
      available: 0,
      locked: 0,
    },
    {
      currencyName: '-- ',
      available: 0,
      locked: 0,
    },
  ],
};

export default AssetSpot;
