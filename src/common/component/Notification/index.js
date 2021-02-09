import Notification from './Notification';

function createFunction(type) {
  return (props) => {
    const config = {
      type: Notification.TYPE[type],
      ...props,
    };
    return Notification.create(config);
  };
}

Notification.success = createFunction(Notification.TYPE.success);
Notification.info = createFunction(Notification.TYPE.info);
Notification.warn = createFunction(Notification.TYPE.warn);
Notification.error = createFunction(Notification.TYPE.error);
Notification.loading = createFunction(Notification.TYPE.loading);

export default Notification;
