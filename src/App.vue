<template>
  <div id="app" @click="$event=>{}">
    <div id="nav">
      <router-link to="/home">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/three">Three</router-link>
    </div>
    <router-view/>
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
    // this.$toast.message({ time: 0, message: JSON.stringify(window.WeixinJSBridge) })
    // this.$toast.message({ time: 0, message: '灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊灰色空间代发货是打飞机啊', position: 'top' })
    // const loading = this.$loading()
    // setTimeout(() => {
    //   loading.close()
    // }, 3000)
    // this.$confirm('Hello world ?', 'Confirm')
    // this.$store.dispatch('watchScroll')
    // document.addEventListener('WeixinJSBridgeReady', function onBridgeReady () {
    //   this.$toast.message({ time: 0, message: JSON.stringify(window.WeixinJSBridge) })
    //   window.WeixinJSBridge.call('hideToolbar')
    //   window.WeixinJSBridge.call('hideOptionMenu')
    // })
  },
  mounted () {
    try {
      var el = document.getElementById('static-loading')
      el.parentNode.removeChild(el)
    } catch (e) {
      // console.error(e);
    }
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
#app {
  // padding-bottom: 34px;
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  //   font-family: 'Avenir', Helvetica, Arial, sans-serif;
  //   -webkit-font-smoothing: antialiased;
  //   -moz-osx-font-smoothing: grayscale;
  //   text-align: center;
  //   color: #2c3e50;
  background-color: #fff;
}
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
