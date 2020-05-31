<template>
  <div>
    <div>container</div>
    <transition appear mode="out-in" name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'container',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
