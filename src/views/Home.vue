<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="logo"></div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div class="aaa"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
    this.$store.dispatch('getUserInfo').then(data => {
      console.log(data)
    }).catch(error => {
      // let msg = error.message || error
      console.log(error)
    })
  },
  components: {
    HelloWorld
  }
}
</script>
<style lang="less" scoped>
.logo {
  .bgImg('../assets/logo.png',0.5);
}
</style>
