import ZhCN from './zh';
import EnUS from './en';

export default (language) => {
  let messages = EnUS;
  if (language === 'zh_CN') {
    messages = ZhCN;
  } else if (language === 'en_US') {
    messages = EnUS;
  }
  return messages;
};
