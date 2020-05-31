<template>
  <div>
    <h1>page2</h1>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
// import apiActions from '@/config/api.js'
export default {
  name: 'home',
  data () {
    return {
    }
  },
  computed: {
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
    this.$route.meta.aaa = 1
    console.log()
  },
  mounted () {
  },
  components: {
  }
}
</script>
