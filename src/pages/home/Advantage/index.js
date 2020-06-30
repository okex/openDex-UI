import React, { Fragment } from 'react';
import { toLocale } from '_src/locale/react-locale';
import Image from '../image';
import './index.less';
import './index-md.less';
import './index-lg.less';
import './index-xl.less';

const AdvantageItem = (props) => {
  const { img, title, content } = props.data;
  return (
    <div className="item-container">
      <img
        className="item-img"
        src={img}
        alt={toLocale(title)}
      />
      <h3 className="item-title">{toLocale(title)}</h3>
      <p className="item-content">{toLocale(content)}</p>
    </div>
  );
};

const itemList = [
  {
    img: Image.adv_item0,
    title: 'home_adv_item0_title',
    content: 'home_adv_item0_content'
  },
  {
    img: Image.adv_item1,
    title: 'home_adv_item1_title',
    content: 'home_adv_item1_content'
  },
  {
    img: Image.adv_item2,
    title: 'home_adv_item2_title',
    content: 'home_adv_item2_content'
  }
];

const Advantage = () => {
  return (
    <article className="advantage-container">
      <div className="advantage-grid">
        <h2 className="advantage-title">{toLocale('home_adv_title')}</h2>
        <div className="advantage-list">
          {
            itemList.map((item) => {
              return <AdvantageItem data={item} key={item.title} />;
            })
          }
        </div>
      </div>
    </article>
  );
};

export default Advantage;
