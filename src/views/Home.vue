<template>
  <div class="main-wrapper home">
    <div class="logo"></div>
    <div class="logo2"></div>
    <div class="logo3"></div>
    <div class="logo4"></div>
    <button @click="handleStart">startBgm</button>
    <button @click="handleSendPostMessage">handleSendPostMessage</button>
    <iframe frameborder="0" id="iframe1" src="http://127.0.0.1:3000/zizai_app_user_privacy_policy.html"></iframe>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import apiActions from '@/config/api.js'
import initPage from '@/mixins/initPage.js'
import { setWxShare, shareAppPage } from '@/config/sdk.js'
export default {
  name: 'home',
  mixins: [initPage],
  data () {
    return {
      shareInfo: {
        icon: location.origin + '/' + require('@/assets/images/icon_share.jpg'),
        link: location.origin + location.pathname + '#/',
        title: '来啦！点击查收你的2019自在生活日志！',
        desc: '生活点滴，自在相伴',
        descTimeline: '生活点滴，自在相伴'
      }
    }
  },
  computed: {
    isApp () {
      return this.$store.state.sdk.isApp
    },
    // vuex辅助函数
    ...mapState({
      // isApp: state => state.sdk.isApp // 与上面等价
      bgm: state => state.bgm
    })
  },
  methods: {
    // vuex辅助函数
    ...mapActions({
      // getUserInfo: 'api/user/getUserInfo',
      // getWeChatInfo: 'api/base/getWeChatInfo'
    }),
    // vuex辅助函数
    ...mapMutations({
      updateIsPause: 'UPDATE_BGM_IS_PAUSE'
    }),
    // app 和普通H5 手动播放bgm
    handleStart (e) {
      if (this.bgm.autoPlay) {
        if (this.bgm.el.paused) {
          try {
            this.bgm.el.play()
            this.updateIsPause(this.bgm.el.paused)
          } catch (error) {
            console.log('bgm play', error)
          }
        }
      }
    },
    async handleShare (e) {
      if (this.platform === 'APP') {
        try {
          await shareAppPage(this.shareInfo)
        } catch (error) {
          this.$toast(this.$errorFormatter(error, 'shareAppPage'))
        }
      } else if (this.platform === 'WX') {
        this.$toast('请点击右上角进行分享')
      } else if (this.platform === 'MINIPROGRAM') {
        window.miniProgram.navigateTo({ url: `/pages/sharePage?shareContent=${this.shareInfo.desc}&shareUrl=${encodeURIComponent(this.shareInfo.link)}&shareImg=${encodeURIComponent(this.shareInfo.icon)}&goodName=${this.shareInfo.title}&type=A&webViewRedirectUrl=${encodeURIComponent(window.location.href)}&webviewLogin=1` })
      } else {
        this.$toast('请使用浏览器的分享功能')
      }
    },
    handleSendPostMessage (e) {
      const domain1Iframe = document.getElementById('iframe1')
      domain1Iframe.contentWindow.postMessage({ key: 'item1' }, 'http://127.0.0.1:3000/zizai_app_user_privacy_policy.html')
    }
  },
  async created () {
    // 登录前置
    if (!this.accessToken) {
      await this.login()
    }
    this.$loading.open()
    try {
      // TODO 业务接口
      this.$loading.close()
    } catch (error) {
      this.$loading.close()
      await this.checkErrorLogin(error)
      this.$toast(this.$errorFormatter(error, 'home created'))
    }
    // 微信分享
    if (this.isWeixin) {
      setWxShare(this.shareInfo)
    }
  },
  mounted () {
    window.addEventListener('message', function (event) {
      console.log('home', event)
      if (event.origin === 'http://127.0.0.1:3000/zizai_app_user_privacy_policy.html') {
        console.log(event.data)
      }
    }, false)
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.logo {
  .bgImg('../assets/images/logo.png', 0.5);
}
.logo2 {
  .imgSize('../assets/images/logo.png', 0.5);
  width: @imgW;
  height: @imgW;
  border: 1px solid #3453ae;
  border-radius: 50%;
}
.logo3 {
  .logo2;
  .scale-1px(50%, 50%, 50%, 50%);
}
.logo4 {
  border: 1px solid #3453ae;
  width: get-img-width('../assets/images/logo.png', 0.5);
  height: get-img-height('../assets/images/logo.png', 0.5);
}
</style>
