import React from 'react';

export default class Router extends React.Component {
  constructor() {
    super();
    this.state = {
      currentComponent: null,
      currentRoute: null,
      router: [],
    };
  }

  _processRoute(route) {
    if (!route.component) route.component = null;
    if (!route.props) route.props = {};
    if (!route.props.back) {
      route.props.back = this.back;
    }
    if (!route.props.push) {
      route.props.push = this.push;
    }
  }

  push = (route, clear = false) => {
    const { router } = this.state;
    this._processRoute(route);
    route = { ...route };
    if (clear) router.splice(1);
    router.push(route);
    this.renderRoute(route);
  };

  back = () => {
    const { router } = this.state;
    if (router.length <= 1) return;
    router.pop();
    const route = router[router.length - 1];
    this.renderRoute(route);
  };

  renderRoute(route) {
    this.setState({
      currentRoute: route,
      currentComponent: this.createComponentInstance(route),
    });
    if (this.props.onChange) this.props.onChange(route);
  }

  createComponentInstance(route) {
    if (!route.component) return null;
    if (!route._instance) {
      const Component = route.component;
      route._instance = <Component {...route.props} />;
    }
    return route._instance;
  }

  componentDidMount() {
    const { route } = this.props;
    if (route) this.push(route);
  }

  render() {
    return this.state.currentComponent;
  }
}
