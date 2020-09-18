import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import PageURL from '_src/constants/PageURL';
import IconLite from '_src/component/IconLite';
import Config from '_src/constants/Config';
import { getLangURL } from '_src/utils/navigation';
import Image from '../image';
import './index.less';
import './index-md.less';
import './index-lg.less';
import './index-xl.less';

const StepItem = (props) => {
  const {
    imgNum,
    index,
    icon,
    title,
    content,
    buttonTxt,
    buttonUrl,
    isLink,
  } = props.data;
  return (
    <section className="step-item">
      <div className={imgNum !== index ? 'top' : 'top top-select'}>
        <IconLite className={`step-icon ${icon}`} />
        <h3 className="step-title">{toLocale(title)}</h3>
      </div>
      <div className="bottom">
        <p className="step-content">{toLocale(content)}</p>
        {isLink ? (
          <Link
            className="step-button"
            to={getLangURL(buttonUrl)}
            rel="noopener noreferrer"
            title={toLocale(buttonTxt)}
          />
        ) : (
          <a
            className="step-button"
            href={getLangURL(buttonUrl)}
            rel="noopener noreferrer"
            title={toLocale(buttonTxt)}
          >
            {toLocale(buttonTxt)}
            <IconLite className="icon-go" />
          </a>
        )}
      </div>
    </section>
  );
};

const getIcon = (imgNum, index, circleTime) => {
  const iconSelect = {
    4000: 'icon-icon_one_',
    3000: 'icon-icon_two_',
    2000: 'icon-icon_three_',
    1000: 'icon-icon_four_',
  };
  if (imgNum === index) {
    return iconSelect[circleTime];
  }
  return 'icon-icon_four';
};

const stepsImgList = [
  'home_steps_item0_img',
  'home_steps_item1_img',
  'home_steps_item2_img',
  'home_steps_item3_img',
];

const StepList = (props) => {
  const { imgNum, circleTime } = props.data;
  const list = [
    {
      imgNum,
      index: 0,
      icon: getIcon(imgNum, 0, circleTime),
      title: 'home_steps_item0_title',
      content: 'home_steps_item0_content',
      buttonTxt: 'home_steps_item0_button',
      buttonUrl: PageURL.walletCreate,
      isLink: true,
    },
    {
      imgNum,
      index: 1,
      icon: getIcon(imgNum, 1, circleTime),
      title: 'home_steps_item1_title',
      content: 'home_steps_item1_content',
      buttonTxt: 'home_steps_item1_button',
      buttonUrl: Config.okexchain.receiveCoinUrl,
      isLink: false,
    },
    {
      imgNum,
      index: 2,
      icon: getIcon(imgNum, 2, circleTime),
      title: 'home_steps_item2_title',
      content: 'home_steps_item2_content',
      buttonTxt: 'home_steps_item2_button',
      buttonUrl: PageURL.spotFullPage,
      isLink: true,
    },
    {
      imgNum,
      index: 3,
      icon: getIcon(imgNum, 3, circleTime),
      title: 'home_steps_item3_title',
      content: 'home_steps_item3_content',
      buttonTxt: 'home_steps_item3_button',
      buttonUrl: Config.okexchain.browserUrl,
      isLink: false,
    },
  ];
  return (
    <div className="step-list-container">
      {list.map((item, index) => {
        return <StepItem key={index} data={item} />;
      })}
    </div>
  );
};

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgNum: 0,
      circleTime: 4000,
    };
  }
  componentDidMount() {
    this.countDown();
  }
  countDown() {
    setInterval(() => {
      const { circleTime, imgNum } = this.state;
      if (circleTime > 1000) {
        const newTime = circleTime - 1000;
        this.setState({
          circleTime: newTime,
        });
      } else {
        const newImgNum = imgNum < 3 ? imgNum + 1 : 0;
        this.setState({
          imgNum: newImgNum,
          circleTime: 4000,
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.countDown);
  }
  render() {
    const { imgNum, circleTime } = this.state;
    return (
      <article className="steps-grid">
        <h2 className="steps-title">{toLocale('home_steps_title')}</h2>
        <div className="steps-content">
          {stepsImgList.map((img, index) => {
            return (
              <img
                key={index}
                className={index === imgNum ? `step-img${imgNum}` : 'non-dis'}
                src={toLocale(img) || Image[`step${imgNum}`]}
                alt={toLocale('home_steps_title')}
              />
            );
          })}
          <StepList data={{ imgNum, circleTime }} />
        </div>
      </article>
    );
  }
}

export default Steps;
