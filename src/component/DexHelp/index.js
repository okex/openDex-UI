import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import './index.less';

const DexHelp = () => {
  return (
    <div className="dex-help-container">
      <h4 className="dex-help-title">{toLocale('dex.help.title')}</h4>
      <ul className="help-list">
        <li className="help-list-item">
          <a className="help-list-item-link" target="_blank" rel="noopener noreferrer" href="https://okexchain-docs.readthedocs.io/en/latest/dex-operators/dex-operators-overview.html">{toLocale('dex.help.item1')}</a>
        </li>
        <li className="help-list-item">
          <a className="help-list-item-link" target="_blank" rel="noopener noreferrer" href="https://okexchain-docs.readthedocs.io/en/latest/dex-operators/dex-operators-guide-cli.html">{toLocale('dex.help.item2')}</a>
        </li>
        <li className="help-list-item">
          <a className="help-list-item-link" target="_blank" rel="noopener noreferrer" href="https://okexchain-docs.readthedocs.io/en/latest/dex-operators/dex-operators-faq.html">{toLocale('dex.help.item3')}</a>
        </li>
      </ul>
    </div>
  );
};

export default DexHelp;
