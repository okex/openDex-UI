import React from 'react';
import Checkbox from 'rc-checkbox';
import './index.less';

const DexDesktopCheckbox = ({ label, checked, onChange }) => (
  <div className="dex-desktop-checkbox-container">
    <label className="desktop-checkbox-label" htmlFor="">
      {label}
    </label>
    <Checkbox checked={checked} onChange={onChange} />
  </div>
);

export default DexDesktopCheckbox;
