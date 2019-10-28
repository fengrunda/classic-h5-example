const fs = require('fs')
const { resolve } = require('path')
// 第 1 步：获取一个 Vue 实例 和 页面模板
// const app = require(resolve(__dirname, './dist/skeleton.js'))['default']
const template = fs.readFileSync(resolve(__dirname, './template.html'), 'utf-8')
// 第 2 步：创建一个 renderer
// 不能用createRenderer，不然第三方插件的样式会不见
// const createRenderer = require('vue-server-renderer').createRenderer
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
const renderer = createBundleRenderer(resolve(__dirname, './dist/skeleton.json'), {
  template
})
// 第 3 步：将 Vue 实例渲染为 HTML
// 不能用promise，不然样式会不见
// renderer.renderToString(app).then(html => {
//   fs.writeFileSync(resolve(__dirname, '../public/index.html'), html, 'utf-8')
//   console.info('success')
// }).catch(err => {
//   console.error(err)
// })
renderer.renderToString({}, (err, html) => {
  if (err) throw err
  fs.writeFileSync(resolve(__dirname, '../public/index.html'), html, 'utf-8')
})
