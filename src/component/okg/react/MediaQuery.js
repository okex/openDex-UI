import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getMedia, WatchMedia } from '../index';

class MediaQuery extends PureComponent {
  constructor(props) {
    super(props);
    const media = getMedia().media;
    this.state = {
      media,
    };
    this.watchMedia = new WatchMedia();
    this.watchMedia.watch(
      (mediaConfig) => {
        this.setState({
          media: mediaConfig.media,
        });
      },
      { runNow: false }
    );
  }
  componentWillUnmount() {
    this.watchMedia.destroy();
  }
  getCurrentComponent = () => {
    const { sm, md, lg, xl } = this.props;
    this.components = {
      sm,
      md,
      lg,
      xl,
    };
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
  };
  render() {
    const CurrentComponent = this.getCurrentComponent();
    return CurrentComponent;
  }
}

MediaQuery.propTypes = {
  sm: PropTypes.element.isRequired,
  md: PropTypes.element,
  lg: PropTypes.element,
  xl: PropTypes.element,
};
MediaQuery.defaultProps = {
  md: null,
  lg: null,
  xl: null,
};

export default MediaQuery;
