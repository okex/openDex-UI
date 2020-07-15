import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import iconNodeDelete from '_src/assets/images/icon_node_delete.png';
import { NODE_TYPE, MAX_LATENCY } from '_constants/Node';
import { getDelayType, timeUnit } from '_src/utils/node';
import './NodeItem.less';

class NodeItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    ws: PropTypes.string,
    http: PropTypes.string,
    delayTime: PropTypes.number,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    isRenderDelete: PropTypes.bool,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    ws: '',
    http: '',
    delayTime: MAX_LATENCY,
    onClick: () => {},
    disabled: false,
    isRenderDelete: false,
    onDelete: () => {},
  };

  constructor() {
    super();
    this.state = {};
  }

  handleClick = () => {
    const { onClick, disabled } = this.props;
    if (!disabled) {
      onClick && onClick();
    }
  }

  render() {
    const {
      name, ws, http, delayTime, disabled,
      isRenderDelete, onDelete
    } = this.props;
    const delayType = getDelayType(delayTime);
    const delayCls = `node-delay node-delay-${delayType}`;
    const delayTypeTxt = toLocale(`node.delay.type.${delayType}`);

    return (
      <div className="node-set-item" onClick={this.handleClick} style={{ cursor: disabled ? 'normal' : 'pointer' }}>
        <div className="node-name">{name}</div>
        <div className="node-link">
          <div className="node-link-item one-line">{ws}</div>
          <div className="node-link-item one-line">{http}</div>
        </div>
        <div className={delayCls}>
          <div className="node-delay-type">{delayTypeTxt}</div>
          <div className="node-delay-time">{timeUnit(delayTime)}</div>
        </div>
        <div className="node-icon">
          <Icon className={`icon-node color-${delayType}`} />
        </div>
        {
          isRenderDelete && (
            <div className="node-delete extend-click" onClick={onDelete}>
              <img width="100%" src={iconNodeDelete} alt="delete" />
            </div>
          )
        }
      </div>
    );
  }
}

NodeItem.NODE_TYPE = NODE_TYPE;

export default NodeItem;
