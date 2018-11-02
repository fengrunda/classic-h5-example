const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  lintOnSave: false,
  baseUrl: './',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          // require('postcss-px2rem')({ remUnit: 37.5 })
          require('postcss-px-to-viewport')({
            viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
            // viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            // selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1 // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            // mediaQuery: false // 允许在媒体查询中转换`px`
          })
        ]
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://t.api.zizai.rfmember.net/',
        // ws: true,
        changeOrigin: true
      }
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
    }
  },
  chainWebpack: config => {
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
        path.resolve(__dirname, 'src/assets/less/function_px.less'),
        path.resolve(__dirname, 'src/assets/less/variable.less')
      ]
    })
}
