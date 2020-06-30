import React from 'react';

export default class IconLite extends React.Component {
  render() {
    const {
      className, style, isColor, onClick
    } = this.props;
    return (() => {
      if (isColor) {
        return (
          <svg className="icon" aria-hidden="true" style={style} onClick={onClick}>
            <use xlinkHref={`#${className}`} />
          </svg>
        );
      }
      return <i className={`icon iconfont ${className}`} style={style} onClick={onClick} />;
    })();
  }
}

IconLite.defaultProps = {
  className: '',
  style: {}
};
