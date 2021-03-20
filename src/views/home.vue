<template>
  <div class="home-page-container main-layout full">
    <div class="main-hero full">
      <img src="../assets/images/hero.png" alt="" />
      <transition name="slide-fade">
        <home-nav v-if="isShown"></home-nav>
      </transition>
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
      windowTop: true,

    }
  },
  computed: {
    carsToShow() {
      return this.$store.getters.carsToShowHome;
    },
    isShown() {
      return this.windowTop ? true : false
    }
  },
  methods: {
    onScroll() {
      // console.log('window.top.scrollY:', window.top.scrollY)
      this.windowTop = window.top.scrollY < 10 ? true : false
      console.log('this.windowTop:', this.windowTop)
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
}
</script>
