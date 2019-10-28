
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 | browser-sync start --config BS-config.js
 */
/**
 * Require Browsersync
 */
const path = require('path')
// const url = require('url')
const browserSync = require('browser-sync')
const proxy = require('http-proxy-middleware')
const config = require('./vue.config')
// var proxyOptions = {
//   target: 'http://192.168.197.205:10120', // target host
//   changeOrigin: true,               // needed for virtual hosted sites
//   ws: true,                         // proxy websockets
//   pathRewrite: {
//     '^/mch': '/mch'     // rewrite path
//     // '^/api/remove/path': '/path'           // remove base path
//   }
//   // router: {
//   //   // when request.headers.host == 'dev.localhost:3000',
//   //   // override target 'http://www.example.org' to 'http://localhost:8000'
//   //   'dev.localhost:3000': 'http://localhost:8000'
//   // }
// }

/**
 * Run Browsersync with server config
 */
const option = {
  'ui': {
    'port': 3001,
    'weinre': {
      'port': 8080
    }
  },
  'files': false,
  'watchEvents': [
    'change'
  ],
  'watchOptions': {
    'ignoreInitial': true
  },
  'server': {
    baseDir: path.resolve(__dirname, './dist/'),
    middleware: [
      function (req, res, next) {
        if (config.baseUrl !== '/') {
          req.url = req.url.replace(config.baseUrl, '/')
        }
        next()
      }
    ]
  },
  // 'proxy': {
  //   target: 'http://192.168.197.205:10120',
  //   middleware: function (req, res, next) {
  //     console.log(req.url)
  //     next()
  //   }
  // },
  'proxy': false,
  'port': 3000,
  'https': false
}
const initProxy = () => {
  let proxyArr = []
  const baseUrl = '/zizai' // 服务器上的二级目录名称
  for (let key of Object.keys(config.devServer.proxy)) {
    let proxyContext = baseUrl + key
    let proxyConfig = {
      target: config.devServer.proxy[key].target,
      changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL
      ws: true, // 是否代理websockets
      pathRewrite: {
        // `^${baseUrl}/api`: "/api"
      }
    }
    proxyConfig.pathRewrite = Object.assign(proxyConfig.pathRewrite, { [`^${baseUrl}/api`]: '/api' }) // 配置Rewrite
    proxyArr.push(proxy(proxyContext, proxyConfig))
  }
  // console.log(proxyArr)
  option.server.middleware = option.server.middleware.concat(proxyArr)
  // option.server.middleware = proxyArr
}
initProxy()
browserSync(option)
