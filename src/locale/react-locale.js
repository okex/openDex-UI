import React from 'react';
import Cookies from 'js-cookie';

// match {count} or {count -> message | messages}
const RE = /\{\s*(\w+)\s*(?:->)?\s*(\w+)?\s*\|?\s*(\w+)?\s*}/g;

// url prefix for fetch
const PRE_URL = '';

// all need parts for a project
const projectNeedParts = [];

// store the locale resources
const localeStore = {
  main: {},
};

const baseInitState = {
  fetchDone: false,
  didMount: false,
  didMountFn: () => '',
  errorTimes: 0,
};

// to preserve fetch states and didMount callback functions
const localeState = {
  main: Object.assign({}, baseInitState),
  fetchModules: ['main'],
  fetchConfigs: [],
  urlTestLocale: '',
};

window.location.search.substring(1).split('&').forEach((pair) => {
  const parts = pair.split('=');
  if (parts[0] === 'test_locale') {
    localeState.urlTestLocale = parts[1];
  }
});

// get the right module name in localeStore and localeState
function getModuleName(project) {
  const isPart = projectNeedParts.includes(project);
  return isPart ? project : 'main';
}

// fetch from remote, technically load a script
function fetchLocale(config) {
  const { site, project, locale, version } = config;
  const siteLower = site.toLowerCase();
  const projectLower = project.toLowerCase();
  const localeLower = locale.toLowerCase();
  const fetchUrl = `${PRE_URL}/${siteLower}/${projectLower}/${localeLower}/${siteLower}_${projectLower}_${localeLower}.js${version ? ('?v=' + version) : ''}`;

  const onError = () => {
    const moduleName = getModuleName(config.project);
    const moduleState = localeState[moduleName];

    moduleState.errorTimes += 1;

    const { errorTimes } = moduleState;

    // radically failed (twice specified locale, and twice en_US maybe)
    if (errorTimes >= 4) {
      return;
    }

    // re-fetch after error occurred if not the time of locale alteration
    if (errorTimes !== 2) {
      fetchLocale(Object.assign({}, config));
      return;
    }

    const enUS = 'en_US';

    // if failed twice, set cookie to en_US if currently not, and re-fetch all
    if (errorTimes === 2 && (Cookies.get('locale') !== enUS || localeState.urlTestLocale)) {
      Cookies.set('locale', enUS);

      // alter locale to en_US
      localeState.fetchConfigs.forEach((configItem) => {
        configItem.locale = enUS;
      });

      fetchAllLocales();
    }
  };

  // load script
  const script = document.createElement('script');
  script.setAttribute('src', fetchUrl);
  script.onerror = onError;
  document.body.appendChild(script);
}

// reset states and fetch all locales by individual configs
function fetchAllLocales() {
  localeState.fetchModules.forEach((module) => {
    localeState[module].fetchDone = false;
  });

  localeState.fetchConfigs.forEach((config) => {
    fetchLocale(config);
  });
}

// define the hook for the specified project
window.onLocaleDataReady = (data, project) => {
  const moduleName = getModuleName(project);
  const useLocaleData = localeStore[moduleName] && Object.keys(localeStore[moduleName]).length > 0;

  if (!useLocaleData) {
    localeStore[moduleName] = data;
  }
  localeState[moduleName].fetchDone = true;

  // define a new namespace pointing to the same reference for this case: Locale.spot.some_key
  if (moduleName === 'main') {
    localeStore[project] = data;
  }

  const allFetchDone = localeState.fetchModules.every(item => localeState[item].fetchDone);

  // if all done and main provider mounted already, call to update
  if (allFetchDone && localeState.main.didMount) {
    localeState.main.didMountFn();
  }
};

// interpret to locale
function toLocale(key, values, extra) {
  const moduleName = getModuleName(extra);
  const content = localeStore[moduleName][key];

  if (!content) {
    return '';
  }

  // no placeholder params specified
  if (!values) {
    return content;
  }

  return content.replace(RE, (match, holder, one, other) => {
    const value = values[holder];

    // detect null or undefined
    if (value == undefined) {
      return match;
    }

    const isPureReplace = !one && !other;

    // pure replace
    if (isPureReplace) {
      return value;
    }

    // singular
    if (value === 1) {
      return one;
    }

    // plural
    return other;
  });
}

const ComponentWrapper = ({ component }) => {
  return React.Children.only(component);
};

/**
 * As a top-level container, LocaleProvider is responsible for the following missions:
 *
 * 1. if localeData prop is given, preserve it into localeStore, done.
 * 2. if fetchConfig prop is given, then load the scripts and update views
 *    as fast as possible following this policy below:
 * 2.1 when scripts loading is completed, update views if main provider has been mounted.
 * 2.2 when main provider is mounted, update views if scripts loading has done.
 */
class LocaleProvider extends React.Component {
  constructor(props) {
    super(props);

    const { part, localeData, fetchConfig } = this.props;

    const moduleName = part || 'main';

    if (localeData) {
      localeStore[moduleName] = localeData;
    }

    if (fetchConfig) {
      const { needParts } = fetchConfig;
      const { urlTestLocale } = localeState;

      // url test_locale has the priority
      if (urlTestLocale) {
        fetchConfig.locale = urlTestLocale;
      }

      if (needParts) {
        // generate data and method for individual parts
        needParts.forEach((part) => {
          localeStore[part] = {};
          localeState[part] = Object.assign({}, baseInitState);

          // lodge methods on `toLocale`: toLocale.transfer
          toLocale[part] = (key, values) => toLocale(key, values, part);
        });

        projectNeedParts.push(...needParts);

        localeState.fetchModules.push(...needParts);
      }

      // preserve main config
      localeState.fetchConfigs.push(fetchConfig);

      // preserve part configs
      needParts && needParts.forEach((partItem) => {
        localeState.fetchConfigs.push(Object.assign({}, fetchConfig, { project: partItem }));
      });

      fetchAllLocales();
    }
  }

  componentDidMount() {
    const { part } = this.props;

    const updateView = () => {
      this.forceUpdate();
    };

    const moduleName = part || 'main';
    const moduleState = localeState[moduleName];

    moduleState.didMount = true;
    moduleState.didMountFn = updateView;

    const allFetchDone = localeState.fetchModules.every(item => localeState[item].fetchDone);

    // if all fetch done first, update immediately
    if (allFetchDone) {
      updateView();
    }
  }

  render() {
    const { fetchConfig } = this.props;
    const allFetchDone = localeState.fetchModules.every(item => localeState[item].fetchDone);

    if (fetchConfig && !allFetchDone) {
      return null;
    }

    // will be replaced with React.Fragment after an entire upgrade to 16.*
    return <ComponentWrapper component={this.props.children} />;
  }
}

export {
  toLocale,
  LocaleProvider,
  localeStore as Locale,
};
