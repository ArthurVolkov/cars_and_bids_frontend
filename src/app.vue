<template>
  <div id="app" class="main-layout" :class="isLoginShown" >
    <user-msg />
    <div v-if="loginShown" class="screen"></div>
    <app-header @openLogin="openLogin" />
    <login v-if="loginShown" @closeLogin="closeLogin"></login>
    <router-view />
  </div>
</template>

 

<script>
import appHeader from './cmps/app-header'
import userMsg from './cmps/user-msg'
<<<<<<< HEAD
import login from './cmps/login'

=======
import { userService } from './services/user.service.js'
>>>>>>> 1eb2d3f6dfd9fae5a82442e7aa11af66bf2b6e49

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
<<<<<<< HEAD
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
=======
  destroyed() {
    userService.logout();
>>>>>>> 1eb2d3f6dfd9fae5a82442e7aa11af66bf2b6e49
  },
  components: {
    appHeader,
    userMsg,
    login
  }
};
</script>
