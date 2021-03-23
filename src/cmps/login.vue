<template>
  <section class="login-container">
    <el-card>
      <!-- <section v-if="loggedinUser" class="flex justify-between align-center">
        Hello, {{ loggedinUser.fullname }}
        <el-button class="login-button" type="primary" @click="logout"
          >Logout</el-button
        >
        <button @click="logout">Logout</button>
      </section> -->
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
    <!-- <pre> {{ users }} </pre> -->
    <!-- <v-facebook-login @login="login" app-id="1015104252644196"></v-facebook-login>
    <img :src="img" width="50" height="50">
    {{fbName}}
    <pre> {{ users }} </pre> -->
  </section>
</template>

<script>

import { showMsg } from '../services/eventBus.service.js'
import { userService } from '../services/user.service.js'
import VFacebookLogin from 'vue-facebook-login-component'

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
      fbName: ''
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
    // login(response) {
    //   console.log('AAAAAAAAAAAA', response.authResponse)
    //   this.img = 'http://graph.facebook.com/' + response.authResponse.userID + '/picture?type=large&access_token=' + response.authResponse.accessToken
    //   FB.api('/me', (res) => {
    //     this.fbName = res.name
    //   })
    // },
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
    // async logout() {
    //   console.log('Logout!');
    //   try {
    //     await this.$store.dispatch({ type: 'logout' })
    //     showMsg('logged out success')

    //   } catch (err) {
    //     showMsg('Cannot logout', 'danger')
    //   }
    // },
    toggleRegistration() {
      this.isRegistration = !this.isRegistration
    },
    closeLogin() {
      this.$store.commit('toggleLogin', { isShown: false })
    }
  },
  async created() {
    this.users = await userService.getUsers();
  },
  destroyed() {
    this.closeLogin()
  },
  components: {
    VFacebookLogin,
  },
}
</script>