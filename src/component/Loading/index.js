/**
 * 加载状态
 * Created by yuxin.zhang on 2018/1/1.
 *
 * 充满父级 自动居中 父级需要定位
 */

import React from 'react';
import './Loading.less'

export default class Loading extends React.Component {
    render() {

        const {when, small, isOKEX, theme} = this.props;

        const isOKEXSite = isOKEX ? isOKEX : location.host.toLowerCase().indexOf('okex') !== -1;

        const loadingClass = isOKEXSite ? (small ? 'okex-loading-box-small' : 'okex-loading-box') : 'okcoin-loading-box';

        return (
            <div className={`${loadingClass} ${theme} ${when ? '' : 'hide'}`}>
                <div>
                    <div className="c1"></div>
                    <div className="c2"></div>
                    <div className="c3"></div>
                    <div className="c4"></div>
                </div>
            </div>
        );
    }
}

Loading.defaultProps = {
    when: false,
    isOKEX: null,
    small: false,
    theme: ''
};