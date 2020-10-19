import React from 'react';
import util from '_src/utils/util';
import Message from '_src/component/Message';

export default class Confirm extends React.Component {

  render() {
    const {children,loadingTxt,successTxt,onClick} = this.props;
    const child = React.Children.only(children);
    return React.cloneElement(child,{
       onClick: async () => {
        if(!onClick || this.loading) return;
        let loadingToast;
        try {
          this.loading = true;
          loadingToast = loadingTxt ? Message.loading({
            content: loadingTxt,
            duration: 0,
          }) : null;
          const fn = util.debounce(onClick, 100);
          await fn();
          if(loadingToast) loadingToast.destroy();
          if(successTxt) Message.success({
            content: successTxt,
            duration: 3,
          });
          this.loading = false;
        } finally {
          if(loadingToast) loadingToast.destroy();
          this.loading = false;
        }
      }
    });
  }
}