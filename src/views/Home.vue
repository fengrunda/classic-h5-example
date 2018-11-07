<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="logo" @click="getActivityInfo"></div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div class="aaa">
      <span class="time">活动时间：{{$store.state.userInfo.startTime}}-{{$store.state.userInfo.endTime}}</span>
      <div class="border-line"></div>
      <div class="border-line2"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
// import { mapState } from 'vuex'
export default {
  name: 'home',
  data () {
    return {

    }
  },
  computed: {
    // ...mapState(
    //   [
    //     // 映射 this.count 为 store.state.count
    //     'userInfo',
    //     'scroll'
    //   ]
    // )
  },
  methods: {
    async getActivityInfo () {
      const activityData = await this.$store.dispatch('getActivityInfo', { params: { activityId: this.$route.query.activityId } })
      this.$store.dispatch('setUserInfo', activityData.data)
      // this.$forceUpdate()
    }
  },
  created () {
    // console.log('created')
    // this.getAAA()
  },
  mounted () {
    // setTimeout(() => {
    //   console.log('mounted', this.$loading())
    // }, 1000)
  },
  components: {
    HelloWorld
  }
}
</script>
<style lang="less" scoped>
.home {
  background-color: darkolivegreen;
  // margin-bottom: 68px;
  // margin-bottom: constant(safe-area-inset-bottom)
  img {
    width: 100%;
  }
}
.logo {
  .bgImg("../assets/logo.png", 0.5);
}
.aaa {
  height: 1000px;
}
.border-line {
  // border: 1px solid #000;
  // border-radius: 0 5px 5px 0;
  border: 1px solid #ddd;
  width: 200px;
  height: 200px;
  margin: 20px auto;
  .scale-1px(0, 5, 5, 0);
}
.border-line2 {
  // border: 1px solid #000;
  border-radius: 0 5px 5px 0;
  border: 1px solid #ddd;
  width: 200px;
  height: 200px;
  margin: 20px auto;
  // .scale-1px(0,5,5,0);
}
</style>
