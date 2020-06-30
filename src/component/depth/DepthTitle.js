import React from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import './Depth.less';

export default class DepthTitle extends React.Component {
  // 生成深度按钮风格
  renderMergeButton = () => {
    const { onDepthPosition, theme } = this.props;
    const btnStyle = { width: '18px', height: '18px' };
    const isDark = theme === 'dark';
    return (
      <div className="spot-depth-button">
        <div onClick={() => {
          onDepthPosition('center');
        }}
        >
          <Icon className={isDark ? 'icon-center' : 'icon-Buyandsell-L'} style={btnStyle} isColor />
        </div>
        <div onClick={() => {
          onDepthPosition('bottom');
        }}
        >
          <Icon className={isDark ? 'icon-sell' : 'icon-sell-L'} style={btnStyle} isColor />
        </div>
        <div onClick={() => {
          onDepthPosition('top');
        }}
        >
          <Icon className={isDark ? 'icon-buy' : 'icon-buy-L'} style={btnStyle} isColor />
        </div>
      </div>
    );
  };

  render() {
    const { needHeadBtn } = this.props;
    return (
      <div className="spot-depth-title">
        {
          needHeadBtn ?
            this.renderMergeButton()
            :
            toLocale('spot.group')
        }
      </div>
    );
  }
}

DepthTitle.propTypes = {
  needHeadBtn: PropTypes.bool,
  onDepthPosition: PropTypes.func
};
DepthTitle.defaultProps = {
  needHeadBtn: false,
  onDepthPosition: null
};
