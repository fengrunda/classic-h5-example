<template>
  <div>
    <h1>page3</h1>
    <router-link :to="{name:$route.matched[1].name,params:$route.params}">page2</router-link>
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
    console.log(this.$route)
  },
  mounted () {
  },
  components: {
  }
}
</script>
