import commonZhCN from '../language/zh';
import commonEnUS from '../language/en';
import commonZhHK from '../language/hk';
import commonKoKR from '../language/ko';

import zhCN from './zh';
import enUS from './en';
import zhHK from './hk';
import koKR from './ko';

export default (language) => {
  let messages = null;
  if (language === 'zh_CN') { // 简体中文
    messages = { ...commonZhCN, ...zhCN };
  } else if (language === 'en_US') { // 英文
    messages = { ...commonEnUS, ...enUS };
  } else if (language === 'zh_HK') { // 繁体中文
    messages = { ...commonZhHK, ...zhHK };
  } else if (language === 'ko_KR') { // 韩文
    messages = { ...commonKoKR, ...koKR };
  }
  return messages;
};
