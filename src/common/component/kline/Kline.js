import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Cookies from 'js-cookie';
import echarts from '@okfe/echarts/lib/echarts';
import '@okfe/echarts/lib/chart/line';
import '@okfe/echarts/lib/component/tooltip';
import Colors from '../../utils/Colors';
import Enum from '../../utils/Enum';

export default class Kline extends React.Component {
  componentDidMount() {
    const { dataSource, theme } = this.props;
    this.echartMain = echarts.init(this.chartDom, undefined, {
      animationLoopDelta: 64,
    });
    let localeText = {
      time: '时间',
      price: '价格',
    };
    const language =
      Cookies.get('locale') ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language;
    let axisLineColor = Colors.blackRGB(0.1);
    let axisTextColor = Colors.blackRGB(0.25);
    if (theme === Enum.themes.theme2) {
      axisLineColor = Colors.whiteRGB(0.1);
      axisTextColor = Colors.whiteRGB(0.25);
    }

    switch (language) {
      case 'en_US':
        localeText = {
          time: 'time',
          price: 'price',
        };
        break;
      case 'zh_HK':
        localeText = {
          time: '時間',
          price: '價咯',
        };
        break;
      case 'ko_KR':
        localeText = {
          time: '시간',
          price: '가격',
        };
        break;
      default:
        break;
    }
    const options = {
      grid: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        backgroundColor: Colors.blueRGB(0.1),
        padding: 8,
        textStyle: {
          color: Colors.blue,
          fontSize: 12,
          lineHeight: 18,
        },
        formatter: (param) => {
          const item = param[0];
          return (
            `${localeText.time} : ${item.name}` +
            `<br/> ${localeText.price} : ${item.data}`
          );
        },
      },
      axisPointer: {
        lineStyle: {
          color: axisLineColor,
        },
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: axisTextColor,
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: true,
          axisPointer: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: axisTextColor,
            },
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitNumber: 3,
          scale: true,
        },
      ],
      series: [
        {
          name: 'price',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: {
            color: Colors.blue,
            borderWidth: 2,
            borderColor: '#fff',
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowBlur: 9,
            shadowOffsetY: 2,
          },
          lineStyle: {
            color: '#5795F1',
            width: 1,
          },
        },
      ],
    };
    this.echartMain.setOption(options);
    this.renderChart(dataSource);
  }

  componentWillReceiveProps(nextProps) {
    this.renderChart(nextProps.dataSource, nextProps.theme);
  }

  renderChart = (dataSource, theme) => {
    if (this.echartMain) {
      let axisLineColor = Colors.blackRGB(0.1);
      let axisTextColor = Colors.blackRGB(0.25);
      if (theme === Enum.themes.theme2) {
        axisLineColor = Colors.whiteRGB(0.1);
        axisTextColor = Colors.whiteRGB(0.25);
      }
      const chartData = {
        time: [],
        price: [],
      };
      let min = 0;
      let max = 0;
      dataSource.forEach((obj, i) => {
        const currClose = obj.close;
        if (i == 0) {
          min = Number(currClose);
          max = Number(currClose);
        }
        if (Number(currClose) > max) {
          max = Number(currClose);
        }
        if (Number(currClose) < min) {
          min = Number(currClose);
        }
        chartData.time.push(moment(obj.createdDate).format('HH:mm'));
        chartData.price.push(currClose);
      });
      this.echartMain.setOption({
        xAxis: [
          {
            data: chartData.time,
            axisLabel: {
              interval: (index, value) => {
                return /(.*)(:30|:00)+(.*)/.test(value);
              },
              textStyle: {
                color: axisTextColor,
              },
            },
            axisLine: {
              lineStyle: {
                color: axisLineColor,
              },
            },
          },
        ],
        axisPointer: {
          lineStyle: {
            color: axisLineColor,
          },
        },
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                color: axisTextColor,
              },
            },
          },
        ],
        series: [
          {
            data: chartData.price,
          },
        ],
      });
    }
  };

  render() {
    const { style } = this.props;
    return (
      <div
        style={{ ...style, height: '220px' }}
        ref={(chartDom) => {
          this.chartDom = chartDom;
        }}
      />
    );
  }
}
Kline.defaultProps = {
  style: {},
  dataSource: [],
};
Kline.propTypes = {
  style: PropTypes.object,
  dataSource: PropTypes.array,
};
