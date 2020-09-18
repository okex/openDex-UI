import ZhCN from './zh';
import EnUS from './en';
import ZhHK from './hk';
import KoKR from './ko';

export default (language) => {
  let messages = null;
  if (language === 'zh_CN') { // 简体中文
    messages = ZhCN;
  } else if (language === 'en_US') { // 英文
    messages = EnUS;
  } else if (language === 'zh_HK') { // 繁体中文
    messages = ZhHK;
  } else if (language === 'ko_KR') { // 韩文
    messages = KoKR;
  }
  return messages;
};
