<template>
  <div class="home-page-container main-layout full">
    <div class="main-hero full">
      <img src="../assets/images/hero.png" alt="" />
      <home-nav></home-nav>
    </div>
    <div class="home-list-container">
      <car-row :cars="carsToShow"></car-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/cmps/HelloWorld.vue'
import homeNav from '../cmps/home-nav'
import carRow from '../cmps/car-row'

export default {
  name: 'Home',
  components: {
    homeNav,
    carRow
  },
  data() {
    return {

    }
  },
  computed: {
    carsToShow() {
      return this.$store.getters.carsToShowHome;
    }
  }
}
</script>
