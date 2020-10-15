import React from 'react';
import LiquidityInfo from './LiquidityInfo';

export default class PoolPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      currentComponent: null,
      currentRoute: null,
      router: [],
    };
  }

  push = (route) => {
    const { router } = this.state;
    if (!route.component) route.component = null;
    if (!route.props) route.props = {};
    if (!route.props.back) {
      route.props.back = this.back;
    }
    if (!route.props.push) {
      route.props.push = this.push;
    }
    route = { ...route };
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
    this.push({
      component: LiquidityInfo,
    });
  }

  render() {
    return this.state.currentComponent;
  }
}
