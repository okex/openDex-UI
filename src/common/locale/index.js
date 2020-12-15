import ZhCN from './zh';
import EnUS from './en';
import RuRU from './ru';

export default (language) => {
  let messages = EnUS;
  if (language === 'zh_CN') {
    messages = ZhCN;
  } else if (language === 'en_US') {
    messages = EnUS;
  } else if (language === 'ru_RU') {
    messages = RuRU;
  }
  return messages;
};
