<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
    this.$toast.message({ time: 0, message: '灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊' })
    // const loading = this.$loading()
    // setTimeout(() => {
    //   loading.close()
    // }, 3000)
    this.$confirm('Hello world ?', 'Confirm')
  },
  components: {
  }
}
</script>
<style lang="less">
@import "~material-design-icons/iconfont/material-icons.css";
@import "~muse-ui/lib/styles/base.less";
@import "~muse-ui/lib/styles/theme.less";
@import "~muse-ui-loading/dist/muse-ui-loading.css";
@import "~muse-ui-message/dist/muse-ui-message.css";
@import "./assets/less/base.less";
@import "./assets/less/style.less";
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
