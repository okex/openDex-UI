/**
 * 交易相关金额、数量、价格输入框
 * Created by wenqiang.li on 2018/3/27.
 *
 * 输入后自动加千分逗号，传出时去掉逗号
 */

import React from 'react';

export default class InputNum extends React.Component {
    constructor(props) {
        super(props);
    }

    onBlur = (e) => {
        const {onBlur} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onBlur !== 'undefined') {
            onBlur(inpNumber, e);
        }
    }

    onClick = (e) => {
        const {onClick} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onClick !== 'undefined') {
            onClick(inpNumber, e);
        }
    }


    onCut = (e) => {
        const {onCut} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onCut !== 'undefined') {
            onCut(inpNumber, e);
        }
    }

    onCopy = (e) => {
        const {onCopy} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onCopy !== 'undefined') {
            onCopy(inpNumber, e);
        }
    }

    onDoubleClick = (e) => {
        const {onDoubleClick} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onDoubleClick !== 'undefined') {
            onDoubleClick(inpNumber, e);
        }
    }

    onFocus = (e) => {
        const {onFocus} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onFocus !== 'undefined') {
            onFocus(inpNumber, e);
        }
    }


    onKeyDown = (e) => {
        const {onKeyDown} = this.props;
        //清除无效字符
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onKeyDown !== 'undefined') {
            onKeyDown(inpNumber, e);
        }
    }

    onChange = (e) => {
        const {onChange} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onChange !== 'undefined') {
            onChange(inpNumber, e);
        }
    }

    onKeyUp = (e) => {
        const {onKeyUp} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onKeyUp !== 'undefined') {
            onKeyUp(inpNumber, e);
        }
    }

    onKeyPress = (e) => {
        const {onKeyPress} = this.props;
        let inpNumber = this.checkInpNumber(e.target.value);
        if (typeof onKeyPress !== 'undefined') {
            onKeyPress(inpNumber, e);
        }
    }

    checkInpNumber = (inputValue, num) => {
        let inps = inputValue.split('.');
        if (inps.length > 1) {
            if (typeof num != 'undefined' || num === -1) {
                return inps[0].replace(/\D/g, '') + '.' + inps[1].replace(/\D/g, '');
            }
            else {
                return inps[0].replace(/\D/g, '') + '.' + inps[1].replace(/\D/g, '').slice(0, num);
            }
        } else {
            return inps[0].replace(/\D/g, '');
        }
    };

    removeDot = (value) => {
        if (typeof value != 'number' && typeof value != 'string') {
            return value;
        }
        let newValue = String(value).replace(/,/g, '');
        return newValue;
    }

    addDot = (value) => {
        if (typeof value != 'number' && typeof value != 'string') {
            return value;
        }
        if (Math.abs(value) < 1000) {
            return value;
        }
        let newValue = String(value).replace(/,/g, '');
        let inpArr = newValue.split('.');

        let l = inpArr[0].split("").reverse(), t = '';
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        if (inpArr.length == 2) {
            return t.split("").reverse().join("") + "." + inpArr[1];
        }
        else {
            return t.split("").reverse().join("");
        }
        return newValue;
    }

    render() {
        const {value} = this.props;
        let newValue = this.removeDot(value);
        newValue = this.addDot(newValue);

        return <input {...this.props} type="text"
                      onCopy={this.onCopy}
                      onBlur={this.onBlur}
                      onClick={this.onClick}
                      onChange={this.onChange}
                      onCut={this.onCut}
                      onDoubleClick={this.onDoubleClick}
                      onFocus={this.onFocus}
                      onKeyUp={this.onKeyUp}
                      onKeyDown={this.onKeyDown}
                      onKeyPress={this.onKeyPress}
                      value={newValue}
        />
    }
}