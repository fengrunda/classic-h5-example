import { mapState, mapActions } from 'vuex'
import { CROSS_URL } from '@/config/utils.js'
import { loginInApp } from '@/config/sdk.js'
import $wx from 'weixin-js-sdk'
const mixin = {
  data () {
    return {}
  },
  computed: {
    // vuex辅助函数
    ...mapState({
      accessToken: state => state.accessToken,
      platform: state => state.platform,
      connectTokenFail: state => state.connectTokenFail,
      isWeixin: state => state.isWeixin
    })
  },
  methods: {
    // vuex辅助函数
    ...mapActions({
      // getUserInfo: 'api/user/getUserInfo',
      // getWeChatInfo: 'api/base/getWeChatInfo'
    }),
    /**
     * 登录
     * @param {*} redirect
     */
    async login (redirect = window.location.href) {
      if (this.platform === 'MINIPROGRAM') {
        // $wx.miniProgram.redirectTo({ url: `/pages/login?webViewRedirectUrl=${encodeURIComponent(redirect)}&webviewLogin=1&fromH5=1` }) // 生活小程序
        $wx.miniProgram.redirectTo({ url: `/subPackages/login/login?webViewRedirectUrl=${encodeURIComponent(redirect)}&webviewLogin=1` }) // 享家小程序
      } else if (this.platform === 'APP') {
        try {
          const { accessToken = '' } = await loginInApp() || {}
          this.$store.commit('UPDATE_ACCESS_TOKEN', accessToken)
          return Promise.resolve({ accessToken })
        } catch (error) {
        }
      } else {
        window.location.href = `${CROSS_URL}?redirect_url=${encodeURIComponent(redirect)}${this.connectTokenFail ? '&type=params' : ''}`
      }
    },
    /**
     * 检查接口登录态
     * @param {*} param0
     */
    async checkErrorLogin ({ status } = {}) {
      if ([402, 403].some(code => code === status)) {
        await this.login()
      }
      return Promise.resolve()
    }
  }
}
export default mixin
