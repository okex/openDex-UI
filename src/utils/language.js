import zhCN from '../locale/zh';
import enUS from '../locale/en';
import zhHK from '../locale/hk';
import koKR from '../locale/ko';

export default (language) => {
  let messages = null;
  if (language === 'zh_CN') {
    messages = zhCN;
  } else if (language === 'en_US') {
    messages = enUS;
  } else if (language === 'zh_HK') {
    messages = zhHK;
  } else if (language === 'ko_KR') {
    messages = koKR;
  }
  return messages;
};
