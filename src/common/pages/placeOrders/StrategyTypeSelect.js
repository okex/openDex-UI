import React from 'react';
import Cookies from 'js-cookie';
import { toLocale } from '_src/locale/react-locale';
import Select from '_component/ReactSelect';
import StrategyTypeWrapper from '../../wrapper/StrategyTypeWrapper';
import Enum from '../../utils/Enum';

const {
  limit,
  market,
  plan,
  track,
  iceberg,
  timeWeight,
  advancedLimit,
} = Enum.placeOrder.strategyType;

const supportMap = {
  [plan]: 360027766731,
  [track]: 360027486192,
  [iceberg]: 360027486292,
  [timeWeight]: 360027486392,
  [advancedLimit]: 360027767671,
};

class StrategyTypeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMouseEnterTypeDesc: false,
      isShowTypeDesc: false,
      typeDesc: props.strategyType,
    };
  }

  getTypeDescDom = (strategyType) => {
    const tips = {
      [limit]: <div>{toLocale('spot.orders.triggerPopLimitOrder')}</div>,
      [market]: <div>{toLocale('spot.orders.triggerPopMarketOrder')}</div>,
      [plan]: (
        <div>
          {toLocale('spot.orders.triggerPopPlanOrder')}
          {this.strategyDetailLink(strategyType)}
        </div>
      ),
      [track]: (
        <div>
          {toLocale('spot.orders.triggerPopTrackOrder')}
          {this.strategyDetailLink(strategyType)}
        </div>
      ),
      [iceberg]: (
        <div>
          {toLocale('spot.orders.triggerPopIcebergOrder')}
          {this.strategyDetailLink(strategyType)}
        </div>
      ),
      [timeWeight]: (
        <div>
          {toLocale('spot.orders.triggerPopTimeWeightOrder')}
          {this.strategyDetailLink(strategyType)}
        </div>
      ),
      [advancedLimit]: (
        <div>
          {toLocale('spot.orders.triggerPopAdvancedLimitOrder')}
          {this.strategyDetailLink(strategyType)}
        </div>
      ),
    };
    return tips[strategyType] || null;
  };

  strategyDetailLink = (type) => {
    const linkLanguage = Cookies.get('locale') === 'zh_CN' ? 'zh-cn' : 'en-us';
    let tipsLink = `https://okexsupport.zendesk.com/hc/${linkLanguage}/articles/${supportMap[type]}`;
    return (
      <a
        className="strategy-type-more"
        href={tipsLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {toLocale('spot.orders.triggerPopDetail')}
      </a>
    );
  };

  handleOnOpen = () => {
    this.setState({ isShowTypeDesc: true, isMouseEnterTypeDesc: false });
  };

  handleOnClose = () => {
    const { isMouseEnterTypeDesc } = this.state;
    if (isMouseEnterTypeDesc) {
      setTimeout(() => {
        this.setState({
          isShowTypeDesc: false,
          typeDesc: this.props.strategyType,
        });
      }, 300);
    } else {
      this.setState({
        isShowTypeDesc: false,
        typeDesc: this.props.strategyType,
      });
    }
  };

  handleOnMouseEnter = (typeDesc) => () => {
    this.setState({ typeDesc });
  };

  handleTypeDescOnMouseEnter = () => {
    this.setState({ isMouseEnterTypeDesc: true });
  };

  handleTypeDescOnMouseLeave = () => {
    this.setState({ isMouseEnterTypeDesc: false });
  };

  renderOption = (options) => (
    <div
      style={{
        width: '100%',
        padding: '0 10px',
      }}
      value={options.value}
      onMouseEnter={this.handleOnMouseEnter(options.value)}
    >
      {options.label}
    </div>
  );

  render() {
    const { strategyType, onChangeStrategyType, options, theme } = this.props;
    const { isShowTypeDesc, typeDesc } = this.state;
    const entrustType = 'spot.orderType';
    const selectTitle = (
      <div className="selectTitle">{toLocale(entrustType)}</div>
    );
    const tips = this.getTypeDescDom(typeDesc);
    return (
      <div className="selectWrap">
        {selectTitle}
        <Select
          clearable={false}
          value={strategyType}
          searchable={false}
          onOpen={this.handleOnOpen}
          onClose={this.handleOnClose}
          onChange={onChangeStrategyType}
          options={options}
          optionRenderer={this.renderOption}
          theme={theme}
          className="select-theme-controls strategy-select"
          optionClassName="select-option"
        />
        {isShowTypeDesc ? (
          <div
            className="type-desc"
            onMouseLeave={this.handleTypeDescOnMouseLeave}
            onMouseEnter={this.handleTypeDescOnMouseEnter}
          >
            {tips}
          </div>
        ) : null}
      </div>
    );
  }
}

export default StrategyTypeWrapper(StrategyTypeSelect);
