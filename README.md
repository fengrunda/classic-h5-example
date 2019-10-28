# classic-h5-demo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Compiles and minifies for production (测试环境)
```
yarn run build-test
```

### 使用browser-sync运行构建后的代码
```
yarn run prod
```
### 使用webpack打包骨架屏
```
yarn run build-skeleton
```
### 将骨架屏插入到html模板中
```
yarn run skeleton
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

## 目录结构
```
| - dist
| - public
| - node_modules
| - skeleton // 骨架屏文件夹
    | - dist
        - skeleton.json // webpack打包后的json
    - entry.js // webpack入口文件
    - index.js // 生成骨架屏入口文件
    - template.html // html模板
    - webpack.skeleton.conf.js // 骨架屏webpack配置文件
| - src
    | - assets
        | - images
        | - less
            lib-base.less // less变量
            lib-func.less // 直接return的less方法，基于less-plugin-functions
            lib-mixins.less // 注入使用的less方法
            lib-reset.less // 初始化reset
            lib-ui.less // 常用的样式，命名方式参照emmet
            style.less // 公共样式
    | - components
          - Loading.vue // 骨架屏用的loading组件
    | - config
        - api.js // 接口配置
        - network.js // 网络请求服务
        - Toggle.js // 接口状态类
        - utils.js // 基础方法
    | - store
        index.js
        moduleApi.js // 接口模块
        moduleSdk.js // app JsBridge模块
    | - views
      - App.vue
      - main.js
      - route.js
| - 各种配置文件