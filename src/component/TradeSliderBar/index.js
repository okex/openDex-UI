import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import './TradeSliderBar.less';

export default class TradeSliderBar extends React.Component {
  static propTypes = {
    color: PropTypes.oneOf(['green', 'red']),
    value: PropTypes.number,
    onChange: PropTypes.func,
    theme: PropTypes.oneOf(['light', 'dark']),
  };

  static defaultProps = {
    color: 'green',
    value: 0,
    onChange: () => {},
    theme: 'light',
  };
  constructor(props) {
    super(props);
    const { value } = this.props;
    let currValue = 0;
    if (value > 0) {
      currValue = value > 100 ? 100 : value;
    }
    this.viewData = {
      startX: -1,
      endX: -1,
      dragging: false,
      dragStopping: false,
      currValue,
    };

    this.addEvents();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  onSliderBarMouseDown = (e) => {
    this.viewData.dragging = true;
    this.viewData.startX = e.pageX;
    this.viewData.currValue = this.props.value;
  };
  onDotClick = (num) => {
    return () => {
      this.changePercent(num);
    };
  };
  getLegalPercentValue = (newValue) => {
    let result = newValue;
    if (newValue < 0) {
      result = 0;
    } else if (newValue > 100) {
      result = 100;
    }
    return result;
  };
  removeEvents = () => {
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMouve);
  };
  addEvents = () => {
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMouve);
  };
  handleMouseMouve = (e) => {
    if (!this.viewData.dragging) {
      return;
    }
    this.viewData.endX = e.pageX;
    const sliderBarWidth = this.sliderBarDom.clientWidth;
    const movePercent =
      ((this.viewData.endX - this.viewData.startX) / sliderBarWidth) * 100;
    let newValue = Number((this.viewData.currValue + movePercent).toFixed(2));
    newValue = this.getLegalPercentValue(newValue);
    this.changePercent(newValue);
  };
  handleMouseUp = () => {
    if (this.viewData.dragging) {
      this.viewData.dragging = false;
    }
  };

  changePercent = (value) => {
    const { onChange } = this.props;
    if (typeof onChange !== 'undefined') {
      onChange(value);
    }
  };

  render() {
    const { color, style, theme, value } = this.props;
    const overlayDom = <div>{`${value}%`}</div>;
    const containerClass =
      theme === 'dark' ? 'trade-slider-bar-comp-dark' : 'trade-slider-bar-comp';
    return (
      <div className={containerClass} style={style}>
        <div
          className={`trade-slider-bar ${color}`}
          ref={(dom) => {
            this.sliderBarDom = dom;
          }}
        >
          <div className="slider-bar-bgline" />
          {[0, 25, 50, 75, 100].map((item) => {
            const isChecked = Number(value) >= item ? 'checked' : '';
            return (
              <a
                className={`${isChecked} slider-bar-quarter`}
                style={{ left: `${item}%` }}
                key={`trade-slider-${item}`}
                onClick={this.onDotClick(item)}
              />
            );
          })}
          <div className="slider-bar-chk-line" style={{ width: `${value}%` }} />
          <Tooltip
            overlayClassName={`trade-order-slider ${color}`}
            placement="bottom"
            overlay={overlayDom}
          >
            <div
              className="slider-bar-drag-bar"
              style={{ left: `${value}%` }}
              onMouseDown={this.onSliderBarMouseDown}
            />
          </Tooltip>
        </div>
        <div className="bars-container">
          <span className="trade-slider-bar0">0</span>
          <span className="trade-slider-bar100">100%</span>
        </div>
      </div>
    );
  }
}
