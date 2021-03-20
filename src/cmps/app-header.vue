<template>
  <div v-if="isShown" class="header full main-layout">
    <div class="header-container flex align-center justify-between">
      <router-link to="/" class="logo">Cars<span>&</span>Bids</router-link>

      <el-input
        @input="setFilterName"
        placeholder="Search for car"
        v-model="filterName"
        clearable
      >
      </el-input>
      <router-link to="/car" class="btn">Explore</router-link>
      <router-link to="/car/edit" class="btn">Sell your Car</router-link>
      <!-- <router-link to="/about">About</router-link> -->
      <el-button @click="singUp" type="info" round>Sign Up</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-header",
  data() {
    return {
      filterName: '',
      windowTop: true,
      isHomeRout: false
    }
  },
  computed: {
    isShown() {
      return window.screenTop && this.isHomeRout ? false : true
    }
  },
  methods: {
    setFilterName() {
      this.$store.commit({ type: 'setFilterName', name: this.filterName })
      this.$store.dispatch({ type: 'loadCars' })
    },
    onScroll() {
      // console.log('window.top.scrollY:', window.top.scrollY)
      this.windowTop = window.top.scrollY < 10 ? true : false
      console.log('this.windowTop:', this.windowTop) 
    },
    singUp() {
      this.$router.push('/login')
    }
  },
  watch: {
    $route(route) {
      console.log('route:', route)
      this.isHomeRout = (route.path === '/') ? true : false
    }
  },
  created() {
    // this.$route.path
    this.isHomeRout = (this.$route.path === '/') ? true : false

    console.log('this.$route.path:', this.$route.path)
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
};
</script>
