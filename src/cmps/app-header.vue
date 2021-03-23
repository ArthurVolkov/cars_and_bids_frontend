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
      <div class="btn-container flex align-center">
        <!-- <button to="/car" @click="loadCars" class="btn">Explore</button> -->
        <router-link to="/car" class="btn">Explore</router-link>
        <router-link to="/car/edit" class="btn">Sell your Car</router-link>
        <!-- <router-link to="/about">About</router-link> -->
        <div
          class="account-options-btn flex justify-between align-center pointer"
          @click="openOptions=!openOptions"
        >
          <!-- <div
          class="account-options-btn flex justify-between align-center pointer"
          @click="openOptions = !openOptions"
        > -->
          <font-awesome-icon icon="bars" class="main-info-icon" />
          <font-awesome-icon
            v-if="!loggedInUser"
            icon="user-circle"
            class="main-info-icon user-img"
          />
          <avatar v-else :size="30" :username="loggedInUser.fullname"></avatar>
          <!-- <font-awesome-icon
            icon="user-circle"
            class="main-info-icon user-img"
          /> -->
          <!-- <div v-if="openOptions" class="account-options flex flex-col"> -->
          <!-- <div
            v-if="openOptions"
            @click-outside="click"
            class="account-options flex flex-col"
          > -->
          
            <!-- @focusout="clickOutside"
            ref="options" -->
          <div
            v-if="openOptions"
            tabindex="0"
            class="account-options flex flex-col"
          >
            <button v-if="!loggedInUser" class="clean-btn" @click="openLogin">
              Sign in
            </button>
            <button v-else class="clean-btn" @click="logout">Sign out</button>
            <router-link to="/activity">Activites</router-link>
          </div>
        </div>
        <!-- <el-button @click="openLogin" type="info" round>Sign Up</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>


import avatar from 'vue-avatar'
import { showMsg } from '../services/eventBus.service.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faUserCircle)
import clickOutside from '../directives/click-outside.js'

export default {
  name: "app-header",
  data() {
    return {
      filterName: '',
      windowTop: true,
      isHomeRout: false,
      openOptions: false
    }
  },
  computed: {
    isDark() {
      return this.windowTop && this.isHomeRout ? 'dark' : ''
    },
    loggedInUser() {
      // return this.$store.getters.loggedinUser ? true : false
      return this.$store.getters.loggedinUser ? this.$store.getters.loggedinUser : false
    }
  },
  methods: {
    setFilterName() {
      //socketService.emit('admin change', 'Admin change toy')
      this.$store.commit({ type: 'setFilterName', name: this.filterName })
      this.$store.dispatch({ type: 'loadCars' })
    },
    setFilterFocus() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onScroll() {
      this.windowTop = window.top.scrollY < 10 ? true : false
    },
    openLogin() {
      console.log('openLogin:')
      this.$store.commit('toggleLogin', { isShown: true })
    },
    async logout() {
      console.log('Logout!');
      try {
        await this.$store.dispatch({ type: 'logout' })
        showMsg('logged out success')

      } catch (err) {
        showMsg('Cannot logout', 'danger')
      }
    },
    clickOutside() {
      this.openOptions = false
    },
    async newMsg(msg) {
      await this.$store.dispatch({ type: 'addUserMsg', msg })
      console.log('USER NEW MSGS:',this.$store.getters.userMsgs)
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
    this.isHomeRout = (this.$route.path === '/') ? true : false
    window.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.openOptions = false
      }
    })
    socketService.on('cars newMsg', this.newMsg)
    console.log('USER MSGS CREATED:',this.$store.getters.userMsgs)
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
  destroyed() {
    this.$store.commit({ type: 'setFilterName', name: '' })
    socketService.off('cars newMsg', this.newMsg)
  },
  components: {
    avatar
  },
  directives: {
    clickOutside
  }
};
</script>
