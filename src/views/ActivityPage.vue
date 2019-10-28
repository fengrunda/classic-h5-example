<template>
  <div class="home">
    <div class="logo"></div>
    <slide-frame />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SlideFrame from '../components/SlideFrame'
export default {
  name: 'home',
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {},
  components: {
    SlideFrame
  }
}
</script>

<style  scoped>
  .logo {
    background: url("../assets/images/logo.png");
  }
</style>
