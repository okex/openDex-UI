import zhCN from '../locale/zh';
import enUS from '../locale/en';

export default (language) => {
  let messages = null;
  if (language === 'zh_CN') {
    messages = zhCN;
  } else if (language === 'en_US') {
    messages = enUS;
  }
  return messages;
};
