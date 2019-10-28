const path = require('path')
// const webpack = require('webpack')
const LessPluginFunctions = require('less-plugin-functions')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  lintOnSave: false,
  publicPath: './',
  // 根据不同环境配置不同的baseUrl
  // baseUrl: process.env.VUE_APP_BUILD_TYPE === 'development' ? '/' : (process.env.VUE_APP_BUILD_TYPE === 'test' ? '/zizai/universal-login/' : '/universal-login/'),
  productionSourceMap: process.env.VUE_APP_BUILD_TYPE !== 'production', // 生产环境关闭productionSourceMap
  devServer: {
    disableHostCheck: true, // 开了才能用改host方式访问
    proxy: {
      '/api': {
        target: 'http://t.api.zizai.rfmember.net/',
        // ws: true,
        changeOrigin: true
      }
      // '/store/api': {
      //   target: 'http://t.api.zizai.rfmember.net/api',
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/store/api': '/api'
      //   }
      // }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // console.log(config.plugins)
      // 生产环境启用Gzip
      const productionGzipExtensions = ['js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
      // momentjs 删除多余的本地化文件
      // config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/))
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      less: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        plugins: [
          new LessPluginFunctions()
        ]
      }
    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件，按需开启
    config.plugins.delete('prefetch')
    // 自动化导入全局less方法和变量
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  }
}
function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/less/lib-base.less'),
        path.resolve(__dirname, 'src/assets/less/lib-mixins.less'),
        path.resolve(__dirname, 'src/assets/less/lib-func.less')
      ]
    })
}
