<template>
  <div class="home">
    <div class="logo"></div>
    <div class="logo2"></div>
    <div class="logo3"></div>
    <div class="logo4"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import apiActions from '@/config/api.js'
export default {
  name: 'home',
  data () {
    return {
    }
  },
  computed: {
    isApp () {
      return this.$store.state.sdk.isApp
    },
    // vuex辅助函数
    ...mapState({
      // isApp: state => state.sdk.isApp // 与上面等价
    })
  },
  methods: {
    // vuex辅助函数
    ...mapActions({
      // getUserInfo: 'api/user/getUserInfo',
      // getWeChatInfo: 'api/base/getWeChatInfo'
    })
  },
  async created () {
    this.$loading.open('home created')
    console.log('apiActions', apiActions)
    try {
      // // 使用辅助函数
      // await this.getWeChatInfo({ params: { url: location.href } })
      // // 不使用辅助函数
      // await this.$store.dispatch('api/user/getUserInfo', { params: { access_token: 123 } })

      await apiActions.base.getWeChatInfo({ params: { url: location.href } })

      await apiActions.user.getUserInfo({ params: { access_token: 123 } })
    } catch (e) {
      console.log(e)
      this.$toast(this.$errorFormatter(e, 'home created'))
    }
    this.$loading.close()
  },
  mounted () {
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.logo {
  .bgImg("../assets/images/logo.png", 0.5);
}
.logo2 {
  .imgSize("../assets/images/logo.png", 0.5);
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
  width: get-img-width("../assets/images/logo.png", 0.5);
  height: get-img-height("../assets/images/logo.png", 0.5);
}
</style>
