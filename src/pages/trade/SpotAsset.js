import React from 'react';
import AssetSpot from '../../component/asset/AssetSpot';
import SpotAssetWrapper from '../../wrapper/SpotAssetWrapper';
import './SpotAsset.less';


const AssetWrapper = (Component) => {
  return (props) => {
    return (
      <div className="spot-asset">
        <Component {...props} />
      </div>
    );
  };
};
export default SpotAssetWrapper(AssetWrapper(AssetSpot));
