export default {
  blue: '#3075EE',
  red: '#EE6560',
  green: '#4DB872',
  info: '#FFBF00',
  blueRGB: (alpha = 1) => {
    return `rgba(87, 149, 241, ${alpha})`;
  },
  redRGB: (alpha = 1) => {
    return `rgba(238, 101, 96, ${alpha})`;
  },
  greenRGB: (alpha = 1) => {
    return `rgba(77, 184, 114, ${alpha})`;
  },
  whiteRGB: (alpha = 1) => {
    return `rgba(255, 255, 255, ${alpha})`;
  },
  blackRGB: (alpha = 1) => {
    return `rgba(0, 0, 0, ${alpha})`;
  },
};
