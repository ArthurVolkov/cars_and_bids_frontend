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
      <el-form
        class="login-form flex flex-col"
        ref="form"
        @submit.native.prevent="send"
      >
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

        <avatar-upload v-if="isRegistration" @saveImg="saveImg"></avatar-upload>

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
    <button class="clean-btn close-btn" @click="closeLogin">
      <font-awesome-icon icon="times" class="main-info-icon" />
    </button>
    <!-- <pre> {{ users }} </pre> -->
    <!-- <v-facebook-login @login="login" app-id="1015104252644196"></v-facebook-login>
    <img :src="img" width="50" height="50">
    {{fbName}}
    <pre> {{ users }} </pre> -->
  </section>
</template>

<script>

// import { showMsg } from '../services/eventBus.service.js'
import { userService } from '../services/user.service.js'
import VFacebookLogin from 'vue-facebook-login-component'
import avatarUpload from "../cmps/avatar-upload.vue";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
library.add(faTimes)


export default {
  name: 'login',
  data() {
    return {
      user: {
        fullname: '',
        username: '',
        password: '',
        imgUrl: ''
      },
      users: [],
      isRegistration: false,
      img: '',
      fbName: '',
      isLoading: false,
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
        // showMsg('Enter full name, username and password!');
        this.$message({
          showClose: true,
          message: 'Enter full name, username and password!',
          type: 'warning'
        });
        return
      }
      try {
        await this.$store.dispatch({ type: 'signUp', user: this.user })
        // showMsg('signupp success')
        this.$message({
          showClose: true,
          message: 'Sign up successfuly',
          type: 'success'
        });
      } catch (err) {
        // showMsg('Cannot signupp', 'danger')
        this.$message({
          showClose: true,
          message: 'Cannot sign up',
          type: 'error'
        });
      } finally {
        this.closeLogin()
      }
    },
    async login() {
      if (!this.user.username || !this.user.password) {
        // showMsg('Enter username and password!')
        this.$message({
          showClose: true,
          message: 'Enter username and password!',
          type: 'warning'
        });
        return
      }
      try {

        await this.$store.dispatch({ type: 'login', user: this.user })
        await this.$store.dispatch({ type: 'getUserMsgs' });
        // showMsg('signupp success')
        this.$message({
          showClose: true,
          message: 'Sign up successfuly',
          type: 'success'
        });
      } catch (err) {
        // showMsg('Cannot signupp', 'danger')
        this.$message({
          showClose: true,
          message: 'Cannot sign up',
          type: 'error'
        });
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
    saveImg(imgUrl) {
      this.user.imgUrl = imgUrl
      console.log('imgUrl in login:', imgUrl)
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!');
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      }
      return isJPG && isLt2M;
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
    avatarUpload
  },
}
</script>