import React from 'react';
import PropTypes from 'prop-types';
import util from '../../utils/util';
import './ComboBox.less';


export default class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* slateY: -43 */
    };
  }

  // 特效事件 鼠标移入li标签事件
  // onliMousemove = (e) =>{
  //     const slateY = e.target.getBoundingClientRect().top;
  //     this.setState({
  //         slateY: slateY - 50
  //     })
  //
  // };
  render() {
    return (
      <div className="ok-combo-box">
        <ul>
          {
            // onMouseOver={this.onliMousemove} 特效事件
            this.props.comboBoxDataSource.map((item, index) => {
              return (
                <li key={index} className={this.props.current === item.type ? 'active' : ''}>
                  <a href={item.url}>{item.label}</a>
                </li>
              );
            })
          }
        </ul>
        {/* <div className='moveBgColor' style={{'top':this.state.slateY.toString()+'px'}}></div> */}
      </div>
    );
  }
}

ComboBox.defaultProps = {
  comboBoxDataSource: []
};
ComboBox.propTypes = {
  comboBoxDataSource: PropTypes.array
};
