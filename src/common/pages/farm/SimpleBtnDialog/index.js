import React from 'react';
import { Dialog } from '../../../component/Dialog';

export default class SimpleBtnDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      component: null,
    };
  }

  onClose = () => {
    this.setState({ show: false });
  };

  createBtn() {
    const { children, disabled } = this.props;
    const child = React.Children.only(children);
    const { onClick } = child.props;
    return React.cloneElement(child, {
      onClick: async () => {
        if (disabled || (onClick && (await onClick()) === false)) return;
        this.onClick();
      },
    });
  }

  onClick = async () => {
    let component = this.props.component;
    if (typeof component === 'function') component = await component();
    component = React.cloneElement(component, { onClose: this.onClose });
    this.setState({ show: true, component });
  };

  render() {
    const { show, component } = this.state;
    return (
      <>
        {show && (
          <Dialog visible hideCloseBtn>
            {component}
          </Dialog>
        )}
        {this.createBtn()}
      </>
    );
  }
}
