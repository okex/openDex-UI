import mediaSet from '../mediaSet';

const getMedia = () => {
  let result = mediaSet._sm;
  const orderList = ['xl', 'lg', 'md', 'sm'];
  orderList.some((mediaType) => {
    const currentMedia = mediaSet[`_${mediaType}`];
    if (window.matchMedia(currentMedia.query).matches) {
      result = currentMedia;
      return true;
    }
    return false;
  });
  return result;
};

export default getMedia;
