<template>
  <li class="car-preview flex flex-col">
    <!-- <img :src="getImgUrl(car.imgUrls[0])" alt=""> -->
    <!-- <div class="block"> -->
    <el-carousel trigger="click" :autoplay="false" height="200px">
      <el-carousel-item v-for="(img, idx) in car.imgUrls.slice(0, 4)" :key="idx">
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
        <p>⏱ {{ timeLeft }}</p>
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

    <h3>{{ car.year }} {{ car.vendor }} {{ car.model }}</h3>
    <p>{{ car.engine }} Engine, {{ car.transmission }} Gear</p>
    <p>~ {{ car.mileage }} Miles</p>
    <p class="preview-address">{{ car.location.address }}</p>
    <!-- <p>Time Left: {{ timeLeft }}</p> -->
    <div class="preview-btn-container flex justify-between align-center">
      <!-- <router-link class="preview-btn" :to="'/car/details/' + car._id"
        >Details</router-link
      > -->
    </div>
  </li>
</template>

<script>
//import carPreview from "@/cmps/car-preview.vue";
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart)


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
      isLiked: false
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
    }
  },
  methods: {
    removeCar(car) {
      this.$emit("remove", car);
    },
    getImgUrl(pic) {
      return require('../assets/' + pic)
    },
    toggleLike() {
      this.isLiked = !this.isLiked
    }
  },
  created() {
    this.timeLeftInterval = setInterval(() => {
      this.now = Date.now()
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timeLeftInterval);
  }
};
</script>