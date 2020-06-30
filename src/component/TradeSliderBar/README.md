# TradeSliderBar组件

### 用法

```sh
    import TradeSliderBar from '../../components/tradeSliderBar/TradeSliderBar';

    <TradeSliderBar
              value={10.12}
              color={'green'}
              theme={'dark'}
              onChange={foo}
            />
```

### Notice

  Prop|Explain|默认值
  -|-|-
  value     | 当前值                                         | 0
  color     | 颜色（大部分情况用于区分买/卖） 'green' or 'red'   | green
  theme     | 主题 'light' or 'dark'                        | light
  onChange  | 回调参数为百分值,不含'%', 即0~100         | 无
