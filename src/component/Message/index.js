import Message from './Message';

function createFunction(type) {
  return (props) => {
    const config = {
      type: Message.TYPE[type],
      ...props,
    };
    return Message.create(config);
  };
}

// 完全一个数组遍历来写，只不过用的时候就没有提示了
Message.success = createFunction(Message.TYPE.success);
Message.info = createFunction(Message.TYPE.info);
Message.warn = createFunction(Message.TYPE.warn);
Message.error = createFunction(Message.TYPE.error);
Message.loading = createFunction(Message.TYPE.loading);

export default Message;
