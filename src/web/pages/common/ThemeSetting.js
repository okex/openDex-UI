import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from '_src/component/IconLite';
import * as SpotActions from '../../redux/actions/SpotAction';
import theme from '../../utils/TriggerTheme';
import Enum from '../../utils/Enum';

function mapStateToProps(state) {
  return {
    theme: state.Spot.theme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ThemeSetting extends React.Component {
  triggerTheme = () => {
    theme.triggerTheme();
    this.props.spotActions.updateTheme(localStorage.getItem('theme'));
  };

  render() {
    const light2Dark =
      this.props.theme === Enum.themes.theme2 ? 'icon-daytime' : 'icon-night';

    return (
      <div className="trigger-theme" onClick={this.triggerTheme}>
        <Icon
          className={`primary-blue ${light2Dark}`}
          style={{ fontSize: '18px', cursor: 'pointer' }}
        />
      </div>
    );
  }
}
