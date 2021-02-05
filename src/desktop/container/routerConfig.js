import PageURL from '_constants/PageURL';
import NodeSetting from '../pages/nodeSetting';
import commonRoutes from '_src/container/routerConfig';

commonRoutes.config.unshift({
  path: PageURL.nodeSettingPage,
  component: NodeSetting,
});

export default commonRoutes;
