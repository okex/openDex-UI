/*
 * @Descripttion: 媒体设备配置，供JS使用
 * @LastEditors: 翟懿博
 */
const mediaSet = {
  _sm: {
    media: 'sm',
    query: '(max-width: 767px)',
    gutter: 16,
    colCount: 4,
    bodyPadding: 8
  },
  _md: {
    media: 'md',
    preMedia: 'sm',
    query: '(min-width: 768px)',
    gutter: 24,
    colCount: 12,
    bodyPadding: 12
  },
  _lg: {
    media: 'lg',
    preMedia: 'md',
    query: '(min-width: 1024px)',
    gutter: 24,
    colCount: 12,
    bodyPadding: 12,
    contentWidth: 960
  },
  _xl: {
    media: 'xl',
    preMedia: 'lg',
    query: '(min-width: 1280px)',
    gutter: 24,
    colCount: 12,
    bodyPadding: 12,
    contentWidth: 1248
  }
};
export default mediaSet;

