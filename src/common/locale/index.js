import ZhCN from './zh';
import EnUS from './en';
import ZhHK from './hk';
import KoKR from './ko';

export default (language) => {
  let messages = null;
  if (language === 'zh_CN') {
    messages = ZhCN;
  } else if (language === 'en_US') {
    messages = EnUS;
  } else if (language === 'zh_HK') {
    messages = ZhHK;
  } else if (language === 'ko_KR') {
    messages = KoKR;
  }
  return messages;
};
