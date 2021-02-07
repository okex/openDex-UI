import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import Home from '../pages/home/index';
import FullTrade from '_app/pages/fullTrade/FullTrade';
import OpenOrders from '../pages/orders/OpenList';
import HistoryOrders from '../pages/orders/HistoryList';
import DealOrders from '../pages/orders/DealsList';
import CreateWallet from '../pages/wallet/CreateWallet';
import ImportWallet from '../pages/wallet/ImportWallet';
import AssetsWallet from '../pages/wallet/Assets';
import Register from '../pages/register';
import IssueToken from '../pages/issueToken';
import ListTokenpair from '../pages/listTokenpair';
import Dashboard from '../pages/dashboard';
import IssueDetail from '../pages/issueDetail';
import TokenpairDetail from '../pages/tokenpairDetail';
import Fees from '../pages/fees';
import Swap from '../pages/swap';
import SwapPanel from '../pages/swap/SwapPanel';
import PoolPanel from '../pages/swap/PoolPanel';
import AddLiquidity from '../pages/swap/AddLiquidity';
import CreatLiquidity from '../pages/swap/CreatLiquidity';
import ReduceLiquidity from '../pages/swap/ReduceLiquidity';
import WatchlistPanel from '../pages/swap/WatchlistPanel';
import Farm from '../pages/farm';
import FarmPanel from '../pages/farm/FarmPanel';
import DashboardPanel from '../pages/farm/DashboardPanel';
import env from '../constants/env';

const config = [
  ...(env.envConfig.isTest
    ? [
        {
          path: PageURL.homePage,
          component: Home,
          containHead: false
        },
      ]
    : []),
  {
    path: PageURL.spotFullPage,
    component: FullTrade,
    containHead: false,
  },
  {
    path: PageURL.spotOpenPage,
    component: OpenOrders,
  },
  {
    path: PageURL.spotHistoryPage,
    component: HistoryOrders,
  },
  {
    path: PageURL.spotDealsPage,
    component: DealOrders,
  },
  {
    path: PageURL.walletCreate,
    component: CreateWallet,
  },
  {
    path: PageURL.walletImport,
    component: ImportWallet,
  },
  {
    path: PageURL.walletAssets,
    component: AssetsWallet,
  },
  {
    path: PageURL.walletTransactions,
    component: AssetsWallet,
  },
  {
    path: PageURL.registerPage,
    component: Register,
  },
  {
    path: PageURL.issueTokenPage,
    component: IssueToken,
  },
  {
    path: PageURL.listTokenpairPage,
    component: ListTokenpair,
  },
  {
    path: PageURL.dashboardPage,
    component: Dashboard,
  },
  {
    path: PageURL.issueDetailPage,
    component: IssueDetail,
  },
  {
    path: PageURL.tokenpairDetailPage,
    component: TokenpairDetail,
  },
  {
    path: PageURL.feesPage,
    component: Fees,
  },
  {
    path: [PageURL.addLiquidityPage,PageURL.addLiquidityPage+'/:base/:target'],
    component: () => <Swap activekey="2"><AddLiquidity/></Swap>,
  },
  {
    path: PageURL.createLiquidityPage,
    component: () => <Swap activekey="2"><CreatLiquidity/></Swap>,
  },
  {
    path: PageURL.reduceLiquidityPage+'/:base/:target',
    component: () => <Swap activekey="2"><ReduceLiquidity/></Swap>,
  },
  {
    path: PageURL.liquidityPage,
    component: () => <Swap activekey="2"><PoolPanel/></Swap>,
  },
  {
    path: PageURL.watchlistPage,
    component: () => <Swap activekey="3"><WatchlistPanel/></Swap>,
  },
  {
    path: [PageURL.swapPage,PageURL.swapPage+'/:base/:target'],
    component: () => <Swap><SwapPanel/></Swap>,
  },
  {
    path: PageURL.swapPage + '/*',
    redirect: PageURL.swapPage,
  },
  {
    path: PageURL.myfarmingsPage,
    component: () => <Farm activekey="2"><DashboardPanel/></Farm>,
  },
  {
    path: PageURL.farmPage,
    component: () => <Farm><FarmPanel/></Farm>,
  },
  {
    path: PageURL.farmPage + '/*',
    redirect: PageURL.farmPage,
  },
  {
    path: '/',
    redirect: PageURL.spotFullPage,
  },
];

function getRoute({routerConfig=config,FullTradeHead}) {
  let routes = [];
  console.log(routerConfig)
  routerConfig.forEach((router,index) => {
    const { path, component: Page, containHead = true, redirect } = router;
    if(redirect) routes.push(<Redirect from={path} to={redirect} key={index}/>)
    else routes.push(
      <Route
        path={path}
        exact
        component={() => {
          return (
            <React.Fragment>
              {containHead && 
              <div className="full-head">
                <FullTradeHead />
              </div>
              }
              {Page && <Page/>}
            </React.Fragment>
          );
        }}
        key={index}
      >
      </Route>
    );
  });
  return routes.length ? routes : null;
}

export default {
  config,
  getRoute
}