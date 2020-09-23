const prefix = 'ok_';
const DEFAULT = 'default';
const GLOBAL = 'global';

let storageProjectKey = prefix + DEFAULT;
const storageGlobalKey = prefix + GLOBAL;

const localStorageKey = 'localStorage';
const sessionStorageKey = 'sessionStorage';

const expireKey = '_expire';

function isCorrectExpire(expire) {
  return (
    Number.isInteger(Number(expire)) &&
    Number.isSafeInteger(expire) &&
    expire > new Date().getTime()
  );
}

function isCorrectExpireSeconds(expireSeconds) {
  return (
    Number.isInteger(expireSeconds) &&
    Number.isSafeInteger(expireSeconds) &&
    expireSeconds > 0
  );
}

function getExpire(expireSeconds) {
  return new Date().getTime() + expireSeconds * 1000;
}

function getProjectData(storageKey, projectKey, notContainExpire) {
  const dataStr = window[storageKey].getItem(projectKey);
  let data = {};
  try {
    data = JSON.parse(dataStr || {});
  } catch (e) {
    data = {};
  }
  const newData = { [expireKey]: {} };
  const expireMap = data[expireKey] || {};
  Object.keys(data).forEach((key) => {
    if (key === expireKey) {
      return;
    }
    if (expireMap[key] === undefined || isCorrectExpire(expireMap[key])) {
      newData[key] = data[key];
      newData[expireKey][key] = expireMap[key];
    }
  });

  if (notContainExpire) {
    delete newData[expireKey];
  }
  return newData;
}

function cleanInvalidData(storageKey, projectKey) {
  window[storageKey].setItem(
    projectKey,
    JSON.stringify(getProjectData(storageKey, projectKey))
  );
}

const api = {
  get(storageKey, projectKey, key) {
    if (
      key === null ||
      key === undefined ||
      key instanceof Function ||
      key instanceof Array ||
      key instanceof Object
    ) {
      return undefined;
    }
    const projectStorage = getProjectData(storageKey, projectKey);
    return projectStorage[key];
  },

  set(storageKey, projectKey, key, value, expireSeconds) {
    if (
      key === null ||
      key === undefined ||
      key instanceof Function ||
      key instanceof Array
    ) {
      return false;
    }
    if (key === expireKey) {
      return false;
    }
    const projectStorage = getProjectData(storageKey, projectKey);
    if (!(key instanceof Object)) {
      projectStorage[key] = value;
      if (isCorrectExpireSeconds(expireSeconds)) {
        projectStorage[expireKey][key] = getExpire(expireSeconds);
      } else {
        delete projectStorage[expireKey][key];
      }
      window[storageKey].setItem(projectKey, JSON.stringify(projectStorage));
      return true;
    }
    return api.setAll(storageKey, projectKey, key, value);
  },

  setAll(storageKey, projectKey, paramsMap = {}, expireMap = {}) {
    const projectStorage = getProjectData(storageKey, projectKey);
    Object.entries(paramsMap).forEach((item) => {
      const key = item[0];

      if (key === expireKey) {
        return;
      }

      const expireSeconds = expireMap[key];
      projectStorage[key] = item[1];
      if (isCorrectExpireSeconds(expireSeconds)) {
        projectStorage[expireKey][key] = getExpire(expireSeconds);
      } else {
        delete projectStorage[expireKey][key];
      }
    });
    window[storageKey].setItem(projectKey, JSON.stringify(projectStorage));
    return true;
  },

  remove(storageKey, projectKey, key) {
    if (key === null || key === undefined || key instanceof Function) {
      return false;
    }
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

  getAll(storageKey, projectKey) {
    return getProjectData(storageKey, projectKey, true);
  },
  cleanAll(storageKey, projectKey) {
    window[storageKey].setItem(projectKey, JSON.stringify({}));
  },
};

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
    },
  };
}

function init({ project }) {
  const key = project === GLOBAL ? DEFAULT : project;
  storageProjectKey = prefix + key;

  cleanInvalidData(localStorageKey, storageProjectKey);
  cleanInvalidData(localStorageKey, storageGlobalKey);
  key !== DEFAULT && cleanInvalidData(localStorageKey, prefix + DEFAULT);
}

const local = {
  ...apiFactory({
    isLocal: true,
    isGlobal: false,
  }),
  getProjectStorage(name) {
    return getProjectData(localStorageKey, prefix + name, true);
  },
  g: {
    ...apiFactory({
      isLocal: true,
      isGlobal: true,
    }),
  },
};

local.global = local.g;

const session = {
  ...apiFactory({
    isLocal: false,
    isGlobal: false,
  }),
  getProjectStorage(name) {
    return getProjectData(sessionStorageKey, prefix + name, true);
  },
  g: {
    ...apiFactory({
      isLocal: false,
      isGlobal: true,
    }),
  },
};

session.global = session.g;

const storage = {
  init,
  ...local,
  local,
  session,
};
export default storage;
