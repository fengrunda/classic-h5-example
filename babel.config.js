module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [ // museUI 按需加载
    ['import', {
      'libraryName': 'muse-ui',
      'libraryDirectory': 'lib',
      'camel2DashComponentName': false
    }]
  ]
}
