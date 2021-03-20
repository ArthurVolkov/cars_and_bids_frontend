<template>
  <div class="home-page-container main-layout full">
    <div class="main-hero full">
      <img src="../assets/images/hero.png" alt="" />
      <transition name="slide-fade">
        <home-nav v-if="isShown"></home-nav>
      </transition>
    </div>

    <h2>Explore cars by body styles</h2>
    <section class="group-container flex justify-between">
      <div class="img-container">
        <img src="../assets/images/sedan.jpg" />
        <h3>Sedan</h3>
      </div>
      <div class="img-container">
        <img src="../assets/images/coupe.jpg" />
        <h3>Coupe</h3>
      </div>
      <div class="img-container">
        <img src="../assets/images/cabrio.jpg" />
        <h3>Cabriolet</h3>
      </div>
      <div class="img-container">
        <img src="../assets/images/suv.jpg" />
        <h3>SUV/Crossover</h3>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/cmps/HelloWorld.vue'
import homeNav from '../cmps/home-nav'

export default {
  name: 'Home',
  components: {
    homeNav,
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
