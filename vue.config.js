const path = require('path')
// const webpack = require('webpack')
const LessPluginFunctions = require('less-plugin-functions')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { BundleStatsWebpackPlugin } = require('bundle-stats')
module.exports = {
  lintOnSave: false,
  publicPath: './',
  // publicPath: process.env.VUE_APP_BUILD_TYPE === 'production' ? './' : '/zizai/multiple-h5/',
  productionSourceMap: process.env.VUE_APP_BUILD_TYPE !== 'production', // 生产环境关闭productionSourceMap
  devServer: {
    disableHostCheck: true, // 开了才能用改host方式访问
    proxy: {
      '/api': {
        target: 'https://weixin.test.rfmember.net',
        changeOrigin: true
      }
      // '/store/api': {
      //   target: 'https://weixin.test.rfmember.net',
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
    config.plugins.push(
      new BundleStatsWebpackPlugin({
        // html: false,
        json: true
      })
    )
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      less: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        plugins: [
          new LessPluginFunctions()
        ],
        modifyVars: {
          // 直接覆盖变量
          // 'text-color': 'red',
          // 'loading-spinner-size': '60px',
          // 'loading-spinner-color': 'red',
          // 'border-color': '#eee'
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          // hack: `true; @import "${path.resolve(__dirname, 'src/assets/less/vant-var.less')}"`
          hack: `true; @import "~@/assets/less/vant-var.less"`
        }
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
