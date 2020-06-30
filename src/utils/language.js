import zhCN from '../locale/zh';
import enUS from '../locale/en';
import zhHK from '../locale/hk';
import koKR from '../locale/ko';

export default (language) => {
  let messages = null;
  if (language === 'zh_CN') { // 简体中文
    messages = zhCN;
  } else if (language === 'en_US') { // 英文
    messages = enUS;
  } else if (language === 'zh_HK') { // 繁体中文
    messages = zhHK;
  } else if (language === 'ko_KR') { // 韩文
    messages = koKR;
  }
  return messages;
};
