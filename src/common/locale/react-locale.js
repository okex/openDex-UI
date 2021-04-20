import React from 'react';
import Cookies from 'js-cookie';

const RE = /\{\s*(\w+)\s*(?:->)?\s*(\w+)?\s*\|?\s*(\w+)?\s*}/g;

const PRE_URL = '';

const projectNeedParts = [];

const localeStore = {
  main: {},
};

const baseInitState = {
  fetchDone: false,
  didMount: false,
  didMountFn: () => '',
  errorTimes: 0,
};

const localeState = {
  main: { ...baseInitState },
  fetchModules: ['main'],
  fetchConfigs: [],
  urlTestLocale: '',
};

window.location.search
  .substring(1)
  .split('&')
  .forEach((pair) => {
    const parts = pair.split('=');
    if (parts[0] === 'test_locale') {
      localeState.urlTestLocale = parts[1];
    }
  });

function getModuleName(project) {
  const isPart = projectNeedParts.includes(project);
  return isPart ? project : 'main';
}

function fetchLocale(config) {
  const { site, project, locale, version } = config;
  const siteLower = site.toLowerCase();
  const projectLower = project.toLowerCase();
  const localeLower = locale.toLowerCase();
  const fetchUrl = `${PRE_URL}/${siteLower}/${projectLower}/${localeLower}/${siteLower}_${projectLower}_${localeLower}.js${
    version ? `?v=${version}` : ''
  }`;

  const onError = () => {
    const moduleName = getModuleName(config.project);
    const moduleState = localeState[moduleName];

    moduleState.errorTimes += 1;

    const { errorTimes } = moduleState;

    if (errorTimes >= 4) {
      return;
    }

    if (errorTimes !== 2) {
      fetchLocale({ ...config });
      return;
    }

    const enUS = 'en_US';

    if (
      errorTimes === 2 &&
      (Cookies.get('locale') !== enUS || localeState.urlTestLocale)
    ) {
      Cookies.set('locale', enUS);

      localeState.fetchConfigs.forEach((configItem) => {
        configItem.locale = enUS;
      });

      fetchAllLocales();
    }
  };

  const script = document.createElement('script');
  script.setAttribute('src', fetchUrl);
  script.onerror = onError;
  document.body.appendChild(script);
}

function fetchAllLocales() {
  localeState.fetchModules.forEach((module) => {
    localeState[module].fetchDone = false;
  });

  localeState.fetchConfigs.forEach((config) => {
    fetchLocale(config);
  });
}

window.onLocaleDataReady = (data, project) => {
  const moduleName = getModuleName(project);
  const useLocaleData =
    localeStore[moduleName] && Object.keys(localeStore[moduleName]).length > 0;

  if (!useLocaleData) {
    localeStore[moduleName] = data;
  }
  localeState[moduleName].fetchDone = true;

  if (moduleName === 'main') {
    localeStore[project] = data;
  }

  const allFetchDone = localeState.fetchModules.every(
    (item) => localeState[item].fetchDone
  );

  if (allFetchDone && localeState.main.didMount) {
    localeState.main.didMountFn();
  }
};

function toLocale(key, values, extra) {
  const moduleName = getModuleName(extra);
  const content = localeStore[moduleName][key];

  if (!content) {
    return '';
  }

  if (!values) {
    return content;
  }

  return content.replace(RE, (match, holder, one, other) => {
    const value = values[holder];

    if (value == undefined) {
      return match;
    }

    const isPureReplace = !one && !other;

    if (isPureReplace) {
      return value;
    }

    if (value === 1) {
      return one;
    }

    return other;
  });
}

const ComponentWrapper = ({ component }) => React.Children.only(component);

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

      if (urlTestLocale) {
        fetchConfig.locale = urlTestLocale;
      }

      if (needParts) {
        needParts.forEach((part) => {
          localeStore[part] = {};
          localeState[part] = { ...baseInitState };

          toLocale[part] = (key, values) => toLocale(key, values, part);
        });

        projectNeedParts.push(...needParts);

        localeState.fetchModules.push(...needParts);
      }

      localeState.fetchConfigs.push(fetchConfig);

      needParts &&
        needParts.forEach((partItem) => {
          localeState.fetchConfigs.push({ ...fetchConfig, project: partItem });
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

    const allFetchDone = localeState.fetchModules.every(
      (item) => localeState[item].fetchDone
    );

    if (allFetchDone) {
      updateView();
    }
  }

  render() {
    const { fetchConfig } = this.props;
    const allFetchDone = localeState.fetchModules.every(
      (item) => localeState[item].fetchDone
    );

    if (fetchConfig && !allFetchDone) {
      return null;
    }

    return <ComponentWrapper component={this.props.children} />;
  }
}

export { toLocale, LocaleProvider, localeStore as Locale };
