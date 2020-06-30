import { PureComponent } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { getMedia, WatchMedia } from '../index';

class MediaQuery extends PureComponent {
  constructor(props) {
    super(props);
    const media = getMedia().media;
    this.state = {
      media
    };
    // 监听媒体类型
    this.watchMedia = new WatchMedia();
    this.watchMedia.watch((mediaConfig) => {
      this.setState({
        media: mediaConfig.media
      });
    }, { runNow: false });
  }
  componentWillUnmount() {
    this.watchMedia.destroy();
  }
  // 根据当前媒体获取需要选项的组件
  getCurrentComponent = () => {
    const {
      sm, md, lg, xl
    } = this.props;
    this.components = {
      sm, md, lg, xl
    };
    // 寻找最近一层，props存在的组件
    if (!md) {
      this.components.md = this.components.sm;
    }
    if (!lg) {
      this.components.lg = this.components.md;
    }
    if (!xl) {
      this.components.xl = this.components.lg;
    }
    const currentMedia = this.state.media;
    return this.components[currentMedia];
  }
  render() {
    // 业务层SM组件的props变化时，需要重新赋值this.components，所以在render时重新计算
    const CurrentComponent = this.getCurrentComponent();
    return CurrentComponent;
  }
}

MediaQuery.propTypes = {
  sm: PropTypes.element.isRequired,
  md: PropTypes.element,
  lg: PropTypes.element,
  xl: PropTypes.element
};
MediaQuery.defaultProps = {
  md: null,
  lg: null,
  xl: null
};

export default MediaQuery;
