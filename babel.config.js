module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [ // museUI 按需加载
    // ['import', {
    //   'libraryName': 'muse-ui',
    //   'libraryDirectory': 'lib',
    //   'camel2DashComponentName': false
    // }],
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      // style: true
      // 指定样式路径
      style: name => `${name}/style/less`
    }, 'vant']
  ]
}
