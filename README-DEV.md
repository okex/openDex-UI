## 开发环境

### 第一步：配置WebStorm

设置React语法环境

Preferences > Languages & Frameworks > JavaScript > [选择 React JSX]

配置eslint规则及插件

链接：http://gitlab.okcoin-inc.com/okfe/eslint


### 第二步：运行应用

切换npm仓库地址至公司私有仓库（建议使用nrm工具）
```shell
sudo npm i nrm -g
nrm add okex http://npm.okcoin-inc.com:7001
nrm use okex
```

安装依赖库：

```shell
npm install
```

然后运行本应用：

```shell
npm run dev
```

访问本应用：
http://127.0.0.1:5200/dex-test


### nginx.conf配置
涉及跨域，需要通过Nginx代理解决。
`vi /usr/local/etc/nginx/servers/okchain.conf`

```shell
upstream getsvr {
    server 192.168.13.125:20159; # backend节点IP
}

server {
    listen 7777;
    location / {
        #需要设置前端部署的地址
        add_header Access-Control-Allow-Origin '*';
        add_header Access-Control-Allow-Methods 'POST, GET, OPTIONS';
        add_header Access-Control-Allow-Headers 'X-Requested-With,Content-Type,origin, content-type, accept, authorization,Action, Module, access-control-allow-origin,app-type,timeout,devid';
        add_header Access-Control-Allow-Credentials true;
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        proxy_pass http://getsvr;
    }
}
```

### 后端数据接入说明

在src/constants/config.js中配置api地址

```shell
okchain: {
    browserUrl: `${okchainExplorerBaseUrl}/explorer/okchain`, // 浏览器地址
    searchrUrL: `${okchainExplorerBaseUrl}/explorer/okchain/search`, // 搜索地址
    clientUrl: 'http://127.0.0.1:7777', // nginx地址
  },
```
其中，
okchainExplorerBaseUrl是浏览器地址。由于该工程暂不开源，暂时无法访问区块浏览器。
clientUrl是后端接口地址
