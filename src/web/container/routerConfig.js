import PageURL from '_constants/PageURL';
import NodeSetting from '../pages/nodeSetting';
import commonRoutes from '_src/container/routerConfig';

const routes = [
  ...commonRoutes,
  {
    path: PageURL.nodeSettingPage,
    component: NodeSetting,
  },
];

export default routes;
