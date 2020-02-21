<template>
  <div @click="()=>{}" @touchstart="()=>{}" id="app">
    <div id="nav">
      <router-link to="/home">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/three">Three</router-link>|
      <router-link to="/loading">Loading</router-link>
    </div>
    <transition appear mode="out-in" name="fade">
      <router-view />
    </transition>
    <div class="bgm-ctrl">
      <button @click="handlePlay" class="bgm-ctrl__btn-play" v-if="bgm.isPause"></button>
      <button @click="handlePause" class="bgm-ctrl__btn-pause animated playRotate animdur-5000 animic-i" v-else></button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      bgm: state => state.bgm
    })
    // paused () {
    //   let paused = true
    //   try {
    //     console.log('paused', this.bgm.el.paused, this.bgm.el)
    //     paused = this.bgm.el.paused
    //   } catch (error) { }
    //   return paused
    // }
  },
  methods: {
    ...mapMutations({
      updateAutoPlay: 'UPDATE_BGM_AUTO_PLAY',
      updateIsPause: 'UPDATE_BGM_IS_PAUSE'
    }),
    handlePlay (e) {
      this.bgm.el.play()
      this.updateIsPause(this.bgm.el.paused)
      // this.$toast('handlePlay:' + this.bgm.el.paused)
      this.updateAutoPlay(true)
      // this.$forceUpdate()
    },
    handlePause (e) {
      this.bgm.el.pause()
      this.updateIsPause(this.bgm.el.paused)
      // this.$toast('handlePause:' + this.bgm.el.paused)
      this.updateAutoPlay(false)
      // this.$forceUpdate()
    }
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
// @import '~animate.css/animate.css';

@import './assets/less/lib-reset.less';
@import './assets/less/lib-ui.less';
@import './assets/less/style.less';

.bgm-ctrl {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  filter: drop-shadow(0px 2px 2px rgba(26, 58, 70, 0.7));
}
.bgm-ctrl__btn-play {
  width: 55px;
  height: 55px;
  background-image: url('~@/assets/images/btn_music_ban.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  display: block;
}
.bgm-ctrl__btn-pause {
  .bgm-ctrl__btn-play;
  background-image: url('~@/assets/images/btn_music.png');
}
@keyframes playRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.playRotate {
  animation-name: playRotate;
  animation-timing-function: linear;
}
</style>
