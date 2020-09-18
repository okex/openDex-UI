import React from 'react';
import { Button } from '../Button';
import './Dialog.less';

export default class ActionButton extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  onClick = () => {
    const { onClick, closeDialog } = this.props;
    if (onClick) {
      const ret = onClick();
      if (ret && ret.then) {
        this.setState({ loading: true });
        ret.then(
          () => {
            closeDialog && closeDialog();
          },
          () => {
            this.setState({ loading: false });
          }
        );
      }
    } else {
      closeDialog && closeDialog();
    }
  };

  render() {
    const { children, type, disabled, loading, theme } = this.props;
    const isLoading = this.state.loading || loading;
    return (
      <Button
        className="dialog-btn"
        type={type}
        size={Button.size.default}
        disabled={disabled}
        loading={isLoading}
        theme={theme}
        onClick={this.onClick}
      >
        {children}
      </Button>
    );
  }
}
ActionButton.size = Button.size;
ActionButton.btnType = Button.btnType;
