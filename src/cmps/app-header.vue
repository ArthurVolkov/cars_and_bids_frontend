<template>
  <div class="header full main-layout" :class="isDark">
    <div class="header-container flex align-center justify-between">
      <router-link to="/" class="logo">Cars<span>&</span>Bids</router-link>

      <el-input
        v-if="!isDark"
        @focus="setFilterFocus"
        @input="setFilterName"
        placeholder="Search for car"
        v-model="filterName"
        clearable
      >
      </el-input>
      <div>
        <!-- <button to="/car" @click="loadCars" class="btn">Explore</button> -->
        <router-link to="/car" @click="loadCars" class="btn">Explore</router-link>
        <router-link to="/car/edit" class="btn">Sell your Car</router-link>
        <!-- <router-link to="/about">About</router-link> -->
        <el-button @click="openLogin" type="info" round>Sign Up</el-button>
      </div>
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
    isDark() {
      return this.windowTop && this.isHomeRout ? 'dark' : ''
    }
  },
  methods: {
    setFilterName() {
      this.$store.commit({ type: 'setFilterName', name: this.filterName })
      this.$store.dispatch({ type: 'loadCars' })
    },
    setFilterFocus() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onScroll() {
      //      console.log('window.top.scrollY:', window.top.scrollY)
      this.windowTop = window.top.scrollY < 10 ? true : false
      //      console.log('this.windowTop:', this.windowTop)
    },
    openLogin() {
      // this.$router.push('/login')
      console.log('openLogin:')
      this.$emit('openLogin')
    },
    loadCars() {
      // console.log('loadCars:')
      // this.$store.commit({ type: 'setFilter', filterBy: carService.getEmptyFilter() })
      // this.$store.dispatch({ type: "loadCars" });
      // if (this.$route.path === '/car') this.$router.go(this.$router.currentRoute)
      // else this.$router.push('/car')
    }
  },
  watch: {
    $route(route) {
      console.log('route:', route)
      this.isHomeRout = (route.path === '/') ? true : false
      this.filterName = this.$store.getters.filterBy.name
      //this.filterBy = this.$store.getters.filterBy;
    }
  },
  created() {
    // this.$route.path
    this.isHomeRout = (this.$route.path === '/') ? true : false
    //console.log('this.$route.path:', this.$route.path)
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
  destroyed() {
    this.$store.commit({ type: 'setFilterName', name: '' })
  },
  components: {
  }
};
</script>
