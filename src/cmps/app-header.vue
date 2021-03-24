<template>
  <div class="header full main-layout" :class="isDark">
    <div class="header-container flex align-center justify-between">
      <router-link to="/" class="logo">Cars<span>&</span>Bids</router-link>

      <div
        v-if="openCollapsingBtns"
        class="screen"
        @click="openCollapsingBtns = false"
      ></div>
      <div class="btn-container flex align-center">
        <div
          v-if="openCollapsingBtns || !hamburgerOpen"
          class="collapsing-btn-container"
          :class="collapsing"
        >
          <el-input
            v-if="!isDark"
            @focus="setFilterFocus"
            @input="setFilterName"
            placeholder="Search for car"
            v-model="filterName"
            clearable
          >
          </el-input>
          <router-link to="/car" class="btn">Explore</router-link>
          <router-link to="/car/edit" class="btn">Sell your Car</router-link>
        </div>
        <button
          @click="
            openNotifications = !openNotifications;
            openOptions = false;
          "
          class="clean-btn msgs-open-btn"
        >
          <el-badge :value="0" class="item">
            <font-awesome-icon icon="bell" class="main-info-icon" />
          </el-badge>
        </button>
        <ul v-if="openNotifications" class="user-msg-container">
          <div v-if="userMsgs.length" class="">
            <li v-for="(msg, idx) in userMsgs" :key="idx">
              <p></p>
            </li>
          </div>
          <h3>No new messeges</h3>
        </ul>

        <div
          class="account-options-btn flex justify-between align-center pointer"
          @click="
            openOptions = !openOptions;
            openNotifications = false;
          "
        >
          <font-awesome-icon
            v-if="!openOptions"
            icon="caret-down"
            class="main-info-icon"
          />
          <font-awesome-icon v-else icon="caret-up" class="main-info-icon" />
          <font-awesome-icon
            v-if="!loggedInUser"
            icon="user-circle"
            class="main-info-icon user-img"
          />
          <avatar v-else :size="30" :username="loggedInUser.fullname"></avatar>
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
        <button
          v-if="hamburgerOpen"
          class="clean-btn open-collapsing-btn"
          @click="openCollapsingBtns = !openCollapsingBtns"
        >
          <font-awesome-icon icon="bars" class="main-info-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>


import avatar from 'vue-avatar'
import { showMsg } from '../services/eventBus.service.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faUserCircle, faBell, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faUserCircle, faBell, faCaretDown, faCaretUp)

export default {
  name: "app-header",
  data() {
    return {
      filterName: '',
      windowTop: true,
      isHomeRout: false,
      openOptions: false,
      openNotifications: false,
      userMsgs: [],
      openCollapsingBtns: false
    }
  },
  computed: {
    isDark() {
      return this.windowTop && this.isHomeRout ? 'dark' : ''
    },
    loggedInUser() {
      // return this.$store.getters.loggedinUser ? true : false
      return this.$store.getters.loggedinUser ? this.$store.getters.loggedinUser : false
    },
    collapsing() {
      return this.$store.getters.windowWidth >= 810 ? '' : 'collapsing';
    },
    hamburgerOpen() {
      return this.$store.getters.windowWidth >= 810 ? false : true
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

    async newMsg(msg) {
      await this.$store.dispatch({ type: 'addUserMsg', msg })
      console.log('USER NEW MSGS:', this.$store.getters.userMsgs)
    }
  },
  watch: {
    $route(route) {
      console.log('route:', route)
      this.isHomeRout = (route.path === '/') ? true : false
      this.filterName = this.$store.getters.filterBy.name
      //this.filterBy = this.$store.getters.filterBy;
    },
    // windowWidth() {
    //   if (windowWidth >= 810) {
    //     console.log('The window width is 768px');
    //   }
    // }
  },
  created() {
    this.isHomeRout = (this.$route.path === '/') ? true : false
    window.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.openOptions = false
        this.openNotifications = false
      }
    })
    socketService.on('cars newMsg', this.newMsg)
    console.log('USER MSGS CREATED:', this.$store.getters.userMsgs)
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

};
</script>
