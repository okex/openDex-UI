## 开发环境

### 发布方式说明

原因：因dex项目特殊，使用前端发布系统构建存在一些问题，所以采用本地构建的方式。发布采用前端发布系统。

前提：每次版本迭代基于master分支拉取最新的开发分支，即`daily/x.y.z`（举例 `daily/0.1.0`），在本地构建后将构建结果提交到gitlab 。

构建 & 发布：

1. 日常

在daily分支，构建并提交代码

```
$ npm run daily
```

2. 预发

在prepub分支，构建并提交代码

```
$ npm run prepub
```

3. 线上

待完善

```
$ npm run publish
```

### 第一步：配置WebStorm

设置React语法环境

Preferences > Languages & Frameworks > JavaScript > [选择 React JSX]

配置eslint规则及插件

链接：http://gitlab.okcoin-inc.com/okfe/eslint


### 第二步：运行应用

切换npm仓库地址至公司私有仓库（建议使用nrm工具）
```shell
sudo npm i nrm -g
nrm add okex http://192.168.80.41:4873
nrm use okex
```

安装依赖库：

```shell
npm install
```

然后运行本应用：

```shell
npm run okex
```

根据webpack/dev.common.js中配置的代理路径获取token，确保请求能正确获取数据
以线上数据（const mockUrl = 'https://okexcomweb.bafang.com'）为例：

1、访问https://okexcomweb.bafang.com/index，登录（注册）

2、从Local Storage中拷贝token至本地Local Storage中

3、访问http://localhost:3000/spot/trade

### npm script命令说明

1、mock--本地启动mock数据服务（目前不确保mock数据100%正确，大部分情况是请求转发至开发/测试环境）

2、dev-okex,dev-okcoin,dev-okkr分别用于三个不同站点开发人员启动本地服务

3、build和testbuild相关命令用于上线构建和测试环境构建


### 文件命名

新建JS和样式文件时必须使用驼峰式风格命名：

```
home
    Home.js
    Home.scss
    HomeConversion.js
    HomeConversion.scss
```

新建国际化文本属性时，`key`统一使用.连接：

```js
const messages = {
    'spot.asset.freeze': '冻结',
    'spot.asset.risk': '风险率',
    'spot.asset.forceClose': '爆仓价',
    'spot.asset.interest': '利息',
};
```

CSS类名必须使用连字符风格命名


测试
  私钥：972d5e3fbe52266e27391b7f165951830d6656461c123d2d76387e6e56a1197e
  密码：zZ12345678
