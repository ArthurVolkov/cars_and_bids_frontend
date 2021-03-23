<template>
  <div id="app" class="main-layout" :class="isLoginShown" >
    <user-msg />
    <div v-if="loginShown" class="screen" @click="closeLogin"></div>
    <app-header />
    <login v-if="loginShown"></login>
    <!-- <div v-if="loginShown" class="screen" @click="closeLogin"></div>
    <app-header @openLogin="openLogin" />
    <login v-if="loginShown" @closeLogin="closeLogin"></login> -->
    <router-view />
  </div>
</template>

 

<script>
import appHeader from './cmps/app-header'
import userMsg from './cmps/user-msg'
import login from './cmps/login'

import { userService } from './services/user.service.js'

export default {
  name: "app-vue",
  data() {
    return {
      // loginShown: false,
    }
  },
  created() {
    this.$store.dispatch({ type: "loadCars" });
    this.$store.dispatch({ type: "getLoggedinUser" });
//    socketService.setup();
  },
  computed: {
    isLoginShown() {
      return this.loginShown ? 'login-shown' : ''
    },
    loginShown() {
      return this.$store.getters.loginShown
    }
  },
  methods: {
    // openLogin() {
    //   this.loginShown = true
    // },
    closeLogin() {
      this.$store.commit('toggleLogin', {isShown: false})
    },
    // closeLogin() {
    //   this.loginShown = false
    // }
  },
  destroyed() {
    userService.logout();
  },
  components: {
    appHeader,
    userMsg,
    login
  }
};
</script>
