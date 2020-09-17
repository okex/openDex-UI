import React from 'react';
import Tooltip from 'rc-tooltip';
import './index.less';

const index = ({
  isHTML = false,
  overlay = '',
  maxWidth,
  children,
  noUnderline,
  style = {},
  className = '',
  hasArrow = false,
  noWrapper = false,
  hasShadow = false,
  ...props
}) => {
  let overlayDiv = null;
  const overlayProps = {
    className: 'ok-tooltip-inner',
    style: { maxWidth },
  };
  if (isHTML && typeof overlay === 'string') {
    overlayDiv = (
      <div {...overlayProps} dangerouslySetInnerHTML={{ __html: overlay }} />
    );
  } else {
    overlayDiv = <div {...overlayProps}>{overlay}</div>;
  }
  let inner = null;
  if (noWrapper) {
    inner = children;
  } else {
    inner = (
      <span
        className={`${className} ${noUnderline ? '' : 'has-tooltip'}`}
        style={style}
      >
        {children}
      </span>
    );
  }
  return (
    <Tooltip
      {...props}
      overlay={overlayDiv}
      overlayClassName={`ok-tooltip ${maxWidth ? 'no-default-max' : ''} ${
        hasArrow ? 'has-arrow' : ''
      } ${hasShadow ? 'has-shadow' : ''}`}
    >
      {inner}
    </Tooltip>
  );
};

export default index;
