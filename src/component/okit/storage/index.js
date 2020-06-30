const prefix = 'ok_';
const DEFAULT = 'default';
const GLOBAL = 'global';

let storageProjectKey = prefix + DEFAULT;
const storageGlobalKey = prefix + GLOBAL;

const localStorageKey = 'localStorage';
const sessionStorageKey = 'sessionStorage';

const expireKey = '_expire';

/**
 * 是正确的有效期时间戳
 * @param expire
 * @returns {boolean}
 */
function isCorrectExpire(expire) {
  return (Number.isInteger(Number(expire)) && Number.isSafeInteger(expire) && expire > new Date().getTime());
}

/**
 * 是正确的有效期秒数
 * @param expireSeconds
 * @returns {boolean}
 */
function isCorrectExpireSeconds(expireSeconds) {
  return (Number.isInteger(expireSeconds) && Number.isSafeInteger(expireSeconds) && expireSeconds > 0);
}


/**
 * 获取有效期时间戳
 * @param expireSeconds
 * @returns {boolean}
 */
function getExpire(expireSeconds) {
  return new Date().getTime() + (expireSeconds * 1000);
}

/**
 * 获取对应storage下、对应模块的数据对象 只返回有效的
 * @param storageKey
 * @param projectKey
 * @param notContainExpire 返回的参数不包含有效期
 */
function getProjectData(storageKey, projectKey, notContainExpire) {
  // 获取存储的所有的值
  const dataStr = window[storageKey].getItem(projectKey);
  let data = {};
  try {
    data = JSON.parse(dataStr || {});
  } catch (e) {
    data = {};
  }
  // 过滤出有效的返回
  const newData = { [expireKey]: {} };
  const expireMap = data[expireKey] || {};
  Object.keys(data).forEach((key) => {
    // _expire 作为保留字段 不处理
    if (key === expireKey) {
      return;
    }
    // 如果不处理上边这步，走到_expire字段，会把里边的原始值全部覆盖到newData上，newData的_expire会出现个_expire
    if (expireMap[key] === undefined || isCorrectExpire(expireMap[key])) {
      newData[key] = data[key];
      newData[expireKey][key] = expireMap[key];
    }
  });

  // 不返回时效对象
  if (notContainExpire) {
    delete newData[expireKey];
  }
  return newData;
}

// 清除无效的数据 init 的时候触发
function cleanInvalidData(storageKey, projectKey) {
  window[storageKey].setItem(projectKey, JSON.stringify(getProjectData(storageKey, projectKey)));
}

// 公用方法
const api = {
  /**
   * 获取对应模块下的参数
   */
  get(storageKey, projectKey, key) {
    if (key === null || key === undefined || key instanceof Function
      || key instanceof Array || key instanceof Object) {
      return undefined;
    }
    const projectStorage = getProjectData(storageKey, projectKey);
    return projectStorage[key];
  },

  /**
   * 设置对应模块下的参数
   * @param storageKey
   * @param projectKey
   * @param key 键
   * @param value 值
   * @param expireSeconds 有效期 秒数
   */
  set(storageKey, projectKey, key, value, expireSeconds) {
    if (key === null || key === undefined || key instanceof Function || key instanceof Array) {
      return false;
    }
    // key 不允许等于 _expire  该字段留作有效期使用
    if (key === expireKey) {
      return false;
    }
    const projectStorage = getProjectData(storageKey, projectKey);
    // 单独的一个key
    if (!(key instanceof Object)) {
      projectStorage[key] = value;
      // 是正常的数值且大于当前时间,则存一个有效期时间
      // 否则删除有效期，一直有效
      if (isCorrectExpireSeconds(expireSeconds)) {
        projectStorage[expireKey][key] = getExpire(expireSeconds);
      } else {
        delete projectStorage[expireKey][key];
      }
      window[storageKey].setItem(projectKey, JSON.stringify(projectStorage));
      return true;
    }
    // 对象
    return api.setAll(storageKey, projectKey, key, value);
  },

  /**
   * 设置对应模块下的参数
   * @param storageKey
   * @param projectKey
   * @param paramsMap 参数对象
   * @param expireMap 有效期对象
   */
  setAll(storageKey, projectKey, paramsMap = {}, expireMap = {}) {
    const projectStorage = getProjectData(storageKey, projectKey);
    Object.entries(paramsMap).forEach((item) => {
      const key = item[0];

      // key 不允许等于 _expire  该字段留作有效期使用
      if (key === expireKey) {
        return;
      }

      const expireSeconds = expireMap[key];
      projectStorage[key] = item[1];
      // 有效期秒数正确 则存入有效期，否则永久存储
      if (isCorrectExpireSeconds(expireSeconds)) {
        projectStorage[expireKey][key] = getExpire(expireSeconds);
      } else {
        delete projectStorage[expireKey][key];
      }
    });
    window[storageKey].setItem(projectKey, JSON.stringify(projectStorage));
    return true;
  },

  /**
   * 移除对应模块下的参数
   */
  remove(storageKey, projectKey, key) {
    if (key === null || key === undefined || key instanceof Function) {
      return false;
    }
    // 判断是对象
    if (key.constructor && key.constructor === Object) {
      return false;
    }

    let keyArray = [];
    if (!(key instanceof Array)) {
      keyArray.push(key);
    } else {
      keyArray = key;
    }
    const projectStorage = getProjectData(storageKey, projectKey);
    keyArray.forEach((k) => {
      delete projectStorage[k];
      delete projectStorage[expireKey][k];
    });
    window[storageKey].setItem(projectKey, JSON.stringify(projectStorage));
    return true;
  },

  /**
   * 获取对应模块下所有参数
   */
  getAll(storageKey, projectKey) {
    return getProjectData(storageKey, projectKey, true);
  },
  /**
   * 清空
   */
  cleanAll(storageKey, projectKey) {
    window[storageKey].setItem(projectKey, JSON.stringify({}));
  }
};

/**
 * 生成api
 * @param isLocal 是否localStorage
 * @param isGlobal 是否是获取全局命名空间
 */
function apiFactory({ isLocal, isGlobal }) {
  function getStorageKey() {
    return isLocal ? localStorageKey : sessionStorageKey;
  }

  function getProjectKey() {
    return isGlobal ? storageGlobalKey : storageProjectKey;
  }

  return {
    set(key, value, expire) {
      return api.set(getStorageKey(), getProjectKey(), key, value, expire);
    },
    get(key) {
      return api.get(getStorageKey(), getProjectKey(), key);
    },
    remove(key) {
      return api.remove(getStorageKey(), getProjectKey(), key);
    },
    getAll() {
      return api.getAll(getStorageKey(), getProjectKey());
    },
    cleanAll() {
      return api.cleanAll(getStorageKey(), getProjectKey());
    }
  };
}


/**
 * 初始化方法，全局设置模块
 */
function init({ project }) {
  // 不允许用'global'作为模块名
  const key = project === GLOBAL ? DEFAULT : project;
  storageProjectKey = prefix + key;

  // 清除无效数据，节省空间
  cleanInvalidData(localStorageKey, storageProjectKey);
  cleanInvalidData(localStorageKey, storageGlobalKey);
  // 如果设置了命名空间，那就再单独清个key
  key !== DEFAULT && cleanInvalidData(localStorageKey, prefix + DEFAULT);
}

// localStorage 操作对象
const local = {
  ...apiFactory({
    isLocal: true,
    isGlobal: false
  }),
  getProjectStorage(name) {
    return getProjectData(localStorageKey, prefix + name, true);
  },
  g: {
    ...apiFactory({
      isLocal: true,
      isGlobal: true
    }),
  }
};

local.global = local.g;


// sessionStorage 操作对象
const session = {
  ...apiFactory({
    isLocal: false,
    isGlobal: false
  }),
  getProjectStorage(name) {
    return getProjectData(sessionStorageKey, prefix + name, true);
  },
  g: {
    ...apiFactory({
      isLocal: false,
      isGlobal: true
    }),
  }

};

session.global = session.g;

const storage = {
  init,
  ...local,
  local,
  session
};
export default storage;

