<template>
  <div id="app">
    <div id="nav">
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/three">Three</router-link> |
      <router-link to="/loading">Loading</router-link>
    </div>
    <transition name="fade" mode="out-in" appear>
      <router-view/>
    </transition>
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
// 第三方库样式在此引用，以防构建后样式的覆盖顺序错乱
@import '~muse-ui-loading/dist/muse-ui-loading.css';

@import "./assets/less/lib-reset.less";
@import "./assets/less/lib-ui.less";
@import "./assets/less/style.less";

</style>
