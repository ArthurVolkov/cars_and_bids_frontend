<template>
  <li class="car-preview flex flex-col justify-start">
    <!-- <img :src="getImgUrl(car.imgUrls[0])" alt=""> -->
    <!-- <div class="block"> -->
    <el-carousel trigger="click" :autoplay="false" height="200px">
      <el-carousel-item
        v-for="(img, idx) in car.imgUrls.slice(0, 4)"
        :key="idx"
      >
        <!-- height="150px" -->
        <router-link class="img-container" :to="'/car/details/' + car._id">
          <img :src="getImgUrl(img)" alt="" />
        </router-link>
      </el-carousel-item>
    </el-carousel>
    <!-- </div> -->
    <div @click.stop="toggleLike" class="like-btn pointer" :class="isActive">
      <font-awesome-icon icon="heart" class="main-info-icon" />
    </div>
    <!-- <button class="like-btn">🤍</button> -->
    <div class="bid-info flex justify-between align-center">
      <div class="flex flex-col justify-center align-center">
        <p>
          <font-awesome-icon icon="clock" class="main-info-icon" />
          {{ timeLeft }}
        </p>
        <p class="description">Before ends</p>
      </div>
      <div class="flex flex-col justify-center align-center">
        <p>{{ lastBid }}</p>
        <p class="description">Current Bid</p>
      </div>
      <div class="flex flex-col justify-center align-center">
        <p>{{ car.auction.bids.length }}</p>
        <p class="description">Bids</p>
      </div>
    </div>

    <div class="flex justify-between align-center preview-title-conteiner">
      <h3>{{ car.year }} {{ car.vendor }} {{ car.model }}</h3>
      <p>Mileage: {{ mileage }}</p>
    </div>
    <p>{{ car.engine }} Engine</p>
    <p>{{ car.transmission }} Gear</p>
    <!-- <p>Mileage: {{ car.mileage }}</p> -->
    <div class="flex justify-between align-center">
      <p class="preview-address">{{ car.location.address }}</p>
      <p class="flex align-center">
        <!-- <font-awesome-icon icon="heart" class="main-info-icon" /><span
          >(8)</span
        > -->
        <font-awesome-icon icon="heart" class="main-info-icon" /><span
          >({{ likesCount }})</span
        >
      </p>
    </div>
  </li>
</template>

<script>
//import carPreview from "@/cmps/car-preview.vue";
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faClock)


export default {
  name: "car-preview",
  props: {
    car: {
      type: Object,
    },
  },
  data() {
    return {
      now: Date.now(),
      timeLeftInterval: null,
      isLiked: false,
      like: {}
    }
  },
  computed: {
    lastBid() {
      var bid = 0
      if (this.car.auction.bids.length) {
        bid = this.car.auction.bids[0].price
      } else {
        bid = this.car.auction.startPrice
      }
      //  return bid
      return bid.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    timeLeft() {
      // const diff = this.now - this.car.auction.createdAt + this.car.auction.duration
      const diff = this.car.auction.createdAt + this.car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return moment.duration(diff).format()
    },
    isActive() {
      return this.isLiked ? 'active' : ''
    },
    likesCount(){
      return this.car.likes.length
    },
    mileage() {
      return this.car.mileage.toLocaleString('en-US')
    }
  },
  methods: {
    removeCar(car) {
      this.$emit("remove", car);
    },
    getImgUrl(pic) {
      if (!pic.includes('images')) {
        return pic
      }      
      return require('../assets/' + pic)
    },
    async toggleLike() {
      this.$store.dispatch({ type: "getLoggedinUser" });
      if (!this.$store.getters.loggedinUser) {        
          this.$store.commit('toggleLogin', {isShown: true})
      }
      else {
        this.isLiked = !this.isLiked
        if (this.isLiked){
          this.like.carId = this.car._id;
          var like = await this.$store.dispatch({ type: 'addLike', like: this.like })
          var carToEdit = JSON.parse(JSON.stringify(this.car))
          carToEdit.likes.push(like) 
          this.$store.commit({ type: 'setCar', car: carToEdit })
        } else {
          var idx = this.car.likes.findIndex(like=> {
            console.log(this.$store.getters.loggedinUser._id)      
            return like.by._id === this.$store.getters.loggedinUser._id
          })

          this.like.carId = this.car._id;
          await this.$store.dispatch({ type: 'removeLike', like: this.like })
          carToEdit = JSON.parse(JSON.stringify(this.car))
          carToEdit.likes.splice(idx,1)        
          this.$store.commit({ type: 'setCar', car: carToEdit })
        }
        carToEdit = null;
      }
    },
    findLike() {
      this.$store.dispatch({ type: "getLoggedinUser" });
      if (this.$store.getters.loggedinUser && this.car.likes.length) {
        const idx = this.car.likes.findIndex(like=> {
          return like.by._id === this.$store.getters.loggedinUser._id
        })
        
        if (idx >= 0) {
          this.isLiked = true
        }
      }
    }
  },
  created() {
    this.findLike()
    this.timeLeftInterval = setInterval(() => {
      this.now = Date.now()
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timeLeftInterval);
  }
}
</script>