import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import ont from '../../utils/dataProxy';
import URL from '../../constants/URL';
import './ValuationUnit.less';
import env from '../../constants/env';

class ValuationUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valuationItems: [],
      isHide: true,
      valuationUnit: env.envConfig.token.quoteName,
    };
  }

  componentDidMount() {
    !this.gotUnit && this.getValuationUnit();
  }

  onChangeValua = (e) => {
    const index = e.target.getAttribute('data-index');
    const item = this.state.valuationItems[index];
    this.selectValuation(item.label, item.value, item.symbol, item.dig);
    this.setState({
      isHide: true,
    });
  };

  onMouseOverHandler = () => {
    this.setState({ isHide: false });
  };

  onMouseOutHandler = () => {
    this.setState({ isHide: true });
  };

  getValuationUnit() {
    this.fetching = true;

    ont
      .get(URL.GET_VALUATION_LIST)
      .then((res) => {
        const valuationItems = [];
        res.data &&
          res.data.forEach((item) => {
            const params = {
              label: item.name,
              value: item.smallAmount,
              symbol: item.symbol,
              dig: item.dig,
            };
            valuationItems.push(params);
          });
        this.setState({
          valuationItems,
        });
        this.gotUnit = true;
        this.fetching = false;
      })
      .catch(() => {
        this.gotUnit = true;
        this.fetching = false;
      });
  }

  selectValuation(
    valuationUnit,
    smallAmount,
    valuationUnitSymbol,
    valuationDig
  ) {
    if (valuationUnit !== this.state.valuationUnit) {
      this.smallAmount = smallAmount;
      this.props.getValuationUnit(
        valuationUnit,
        smallAmount,
        valuationUnitSymbol,
        valuationDig
      );
      localStorage.setItem(env.envConfig.token.valuationUnitKey, valuationUnit);
      this.setState({
        valuationUnit: localStorage.getItem(
          env.envConfig.token.valuationUnitKey
        ),
      });
    }
  }

  renderValuationRows(valuationItems) {
    const { valuationUnit } = this.state;
    return valuationItems.map((item, index) => {
      return (
        <span
          className={[
            'item',
            item.label === valuationUnit ? 'active' : '',
          ].join(' ')}
          key={index}
          onClick={this.onChangeValua}
          data-index={index}
        >
          {item.label}
        </span>
      );
    });
  }

  render() {
    const { isHide, valuationItems, valuationUnit } = this.state;
    const newValuationUnit = [valuationUnit, ' ', toLocale('valuation')].join(
      ''
    );
    const listValuationItems = this.renderValuationRows(valuationItems);

    return (
      <span
        className="valuation"
        onMouseOver={this.onMouseOverHandler}
        onMouseOut={this.onMouseOutHandler}
      >
        {newValuationUnit}
        <i className="icon-transfer" />
        <div
          className={[
            'drop-down-list',
            isHide ? 'hide-drop-down-list' : '',
          ].join(' ')}
        >
          {listValuationItems}
        </div>
      </span>
    );
  }
}

export default ValuationUnit;
