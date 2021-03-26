<template>
  <section class="login-container">
    <el-card>
      <el-form class="login-form" ref="form" @submit.native.prevent="send">
        <h2>{{ title }}</h2>
        <el-form-item v-if="isRegistration" prop="fullname">
          <el-input v-model="user.fullname" placeholder="Full name"></el-input>
        </el-form-item>

        <el-form-item prop="username">
          <el-input v-model="user.username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="user.password"
            placeholder="Password"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <div class="flex justify-between">
          <el-form-item>
            <el-button
              @click.prevent.stop="toggleRegistration"
              class="login-button"
              type="primary"
              block
              >{{ regBtn }}</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-button"
              type="primary"
              native-type="submit"
              block
              >Submit</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <button class="clean-btn close-btn" @click="closeLogin">x</button>
    <!-- <facebook-login class="button"
      appId="1015104252644196"
      @login="onLogin"
      @logout="onLogout"
      @get-initial-status="getUserData"
      @sdk-loaded="sdkLoaded">
    </facebook-login> -->
    <!-- <div v-if="isConnected" class="information">  
      <p>{{name}} | {{email}} | {{personalID}}</p> 
      <img :src="picture">
    </div> -->
  </section>
</template>

<script>

import { showMsg } from '../services/eventBus.service.js'
import { userService } from '../services/user.service.js'
// import VFacebookLogin from 'vue-facebook-login-component'
// import facebookLogin from 'facebook-login-vuejs'

export default {
  name: 'login',
  data() {
    return {
      user: {
        fullname: '',
        username: '',
        password: ''
      },
      users: [],
      isRegistration: false,
      img: '',
      fbName: '',
      // isConnected: false,
      // name: '',
      // email: '',
      // personalID: '',
      // picture: '',
      // FB: undefined
    }
  },
  computed: {
    userId() {
      return this.$route.params.userId
    },
    title() {
      return this.isRegistration ? 'Sign up' : 'Login'
    },
    regBtn() {
      return this.isRegistration ? 'Login' : 'Registration'
    },
    loggedinUser() {
      //console.log('this.$store.getters.loggedinUser:', this.$store.getters.loggedinUser)
      return this.$store.getters.loggedinUser
    },
    isAdmin() {
      return this.$store.getters.isAdmin
    }
  },
  methods: {
    send() {
      if (this.isRegistration) this.signUp()
      else this.login()
    },
    async signUp() {
      if (!this.user.username || !this.user.password || !this.user.fullname) {
        showMsg('Enter full name, username and password!');
        return
      }
      try {
        await this.$store.dispatch({ type: 'signUp', user: this.user })
        showMsg('signupp success')
      } catch (err) {
        showMsg('Cannot signupp', 'danger')
      } finally {
        this.closeLogin()
      }
    },
    async login() {
      if (!this.user.username || !this.user.password) {
        showMsg('Enter username and password!')
        return
      }
      try {

        await this.$store.dispatch({ type: 'login', user: this.user })
        await this.$store.dispatch({ type: 'getUserMsgs'});
        console.log('USER MSGS:',this.$store.getters.userMsgs)
        showMsg('signupp success')
      } catch (err) {
        showMsg('Cannot signupp', 'danger')
      } finally {
        this.closeLogin()
      }
    },
    toggleRegistration() {
      this.isRegistration = !this.isRegistration
    },
    closeLogin() {
      this.$store.commit('toggleLogin', { isShown: false })
    },
    getUserData() {
      this.FB.api('/me', 'GET', { fields: 'id,name,email,picture' },
        user => {
          this.personalID = user.id;
          this.email = user.email;
          this.name = user.name;
          this.picture = user.picture.data.url;
          console.log(this.personalID)
          console.log(this.email)
          console.log(this.name)
          console.log(this.picture)
        }
      )
    },
    sdkLoaded(payload) {
      this.isConnected = payload.isConnected
      this.FB = payload.FB
      if (this.isConnected) this.getUserData()
    },
    onLogin() {
      this.isConnected = true
      this.getUserData()
    },
    onLogout() {
      this.isConnected = false;
    }
  },
  async created() {
    this.users = await userService.getUsers();
  },
  destroyed() {
    this.closeLogin()
  },
  components: {
    // VFacebookLogin,
    // facebookLogin
  },
}
</script>