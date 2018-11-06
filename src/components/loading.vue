<template>
  <div class="loading">
    <transition name="fade" mode="out-in">
      <div class="loading-bg" v-if="isVisible">
        <mu-circular-progress :size="50" />
        <!-- <div class="text">100%</div> -->
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
      isVisible: true
    }
  },
  computed: {
    // text () {
    //   return this.$store.state.loading.text
    // }
    // isVisible: {
    //   get () {
    //     return this.$store.state.loading.visible
    //   },
    //   set (value) {
    //     !value && this.$store.dispatch('loadingVisible', { visible: value })
    //   }
    // }
  },
  methods: {
  },
  created () {

  },
  mounted () {

  },
  components: {
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/variable.less";
@import "../assets/less/function_px.less";
.loading {
  .loading-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: rgba(255,255,255,0.3);
    .mu-circular-progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      margin-top: 40px;
    }
  }
}
</style>
