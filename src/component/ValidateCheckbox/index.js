import React from 'react';
import Icon from '_src/component/IconLite';
import PropTypes from 'prop-types';
import './index.less';

const typeEnum = {
  none: 'icon-icon_circlex',
  warning: 'icon-icon_warningx',
  wrong: 'icon-icon_wrongx',
  right: 'icon-icon_success'
};

const ValidateCheckbox = (props) => {
  const {
    type, children, className, style
  } = props;
  const clsName = typeEnum[type] || 'icon-icon_circle';
  return (
    <div className={`${className} validate-checkbox ${type}`} style={style}>
      <Icon
        className={clsName}
        style={{ fontSize: '14px', marginRight: '5px' }}
      />
      <span>{children}</span>
    </div>
  );
};
ValidateCheckbox.propTypes = {
  type: PropTypes.oneOf(['none', 'warning', 'wrong', 'right'])
};
ValidateCheckbox.defaultProps = {
  type: 'none'
};
export default ValidateCheckbox;
