import PageURL from '_constants/PageURL';
import commonRoutes from '_src/container/routerConfig';
import NodeSetting from '../pages/nodeSetting';

commonRoutes.config.unshift({
  path: PageURL.nodeSettingPage,
  component: NodeSetting,
});

export default commonRoutes;
