<template>
  <div id="app" class="main-layout" :class="isLoginShown" >
    <user-msg />
    <div v-if="loginShown" class="screen" @click="closeLogin"></div>
    <app-header @openLogin="openLogin" />
    <login v-if="loginShown" @closeLogin="closeLogin"></login>
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
      loginShown: false,
    }
  },
  created() {
    //console.log("Vue App was created!!!");
    this.$store.dispatch({ type: "loadCars" });
    this.$store.dispatch({ type: "getLoggedinUser" });
  },
  computed: {
    isLoginShown() {
      return this.loginShown ? 'login-shown' : ''
    }
  },
  methods: {
    openLogin() {
      this.loginShown = true
    },
    closeLogin() {
      this.loginShown = false
    }
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
