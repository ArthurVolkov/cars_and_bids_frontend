<template>
  <div v-if="car" class="car-details flex flex-col justify-center align-center">
    <div class="short-info align-self-start">
      <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
      <h3>
        ~ {{ mileage }} Miles, {{ car.engine }} Engine,
        {{ car.transmission }} Gear
      </h3>
    </div>

    <div class="details-img-container details-img-grid">
      <!-- <img :src="getImgUrl(car.imgUrls[0])" alt="" /> -->
      <img
        v-for="(img, idx) in car.imgUrls"
        :key="idx"
        :src="getImgUrl(img)"
        alt=""
      />
    </div>

    <div class="details-bid-info flex align-center justify-between">
      <div class="flex align-center">
        <font-awesome-icon icon="clock" class="main-info-icon" />
        <div class="flex flex-col align-center">
          <h3>Time Left</h3>
          <h3>{{ timeLeft }}</h3>
        </div>
      </div>

      <div class="flex flex-col align-center">
        <h3>Current Bid</h3>
        <h3>{{ lastBid }}</h3>
      </div>

      <div class="flex flex-col align-center">
        <h3># Bids</h3>
        <h3>{{ car.auction.bids.length }}</h3>
      </div>

      <div class="flex flex-col align-center">
        <h3>Comments</h3>
        <h3>{{ car.comments.length }}</h3>
      </div>

      <div class="flex flex-col align-center">
        <h3>Likes</h3>
        <h3>{{ car.likes.length }}</h3>
      </div>

      <div class="bid-info-btn-container flex align-center">
        <button
          @click.stop="toggleLike"
          :class="isActive"
          class="round-main watch"
        >
          <font-awesome-icon icon="heart" class="main-info-icon" />
        </button>
        <button class="round-main bid" @click="modalOpen = true">
          Place Bid
        </button>
      </div>
    </div>

    <div class="flex justify-between">
      <main-info :car="car"></main-info>
      <bid-list :bids="bidsToShow.slice(0, 4)"></bid-list>
    </div>

    <div class="flex flex-col comments-container">
      <h2>Comments</h2>

      <form @submit.prevent="addComment" class="add-comment flex">
        <textarea
          v-model="comment.txt"
          rows="3"
          placeholder="Add a Comment..."
        ></textarea>
        <button>Send</button>
      </form>

      <h3>Comments:</h3>
      <ul class="comments-list clean-list">
        <li v-for="comment in commentsToShow" :key="comment._id">
          <div class="flex align-center bid-by">
            <avatar :size="30" :username="comment.by.fullname"> </avatar>
            <p>{{ comment.by.fullname }}</p>
            <span>{{ comment.createdAt | moment("calendar") }}</span>
          </div>
          <div class="comment-txt flex align-center">
            {{ comment.txt }}
          </div>
        </li>
      </ul>
    </div>
    <div v-if="modalOpen" class="screen" @click="modalOpen = false"></div>
    <div v-if="modalOpen" class="place-bid-modal flex flex-col align-center">
      <h2 class="modal-title">
        {{ car.year }} {{ car.vendor }} {{ car.model }}
      </h2>
      <form @submit="addBid" class="flex add-bid-container">
        <el-input-number
          v-model.number="bid.price"
          :min="lastBidNum + 100"
          :controls="false"
        ></el-input-number>
        <button class="clean-btn">Place bid</button>
      </form>

      <bid-list :bids="bidsToShow"></bid-list>
      <button class="clean-btn close-btn" @click="modalOpen = false">x</button>
    </div>
  </div>

  <div
    v-else
    v-loading.fullscreen.lock="isLoading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>



<script>
import { carService } from "@/services/car.service.js";
import { socketService } from "@/services/socket.service.js";
import { showMsg } from '../services/eventBus.service.js'
import mainInfo from '../cmps/main-info'
import bidList from '../cmps/bid-list'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart, faClock)
var moment = require("moment");

import { userService } from '../services/user.service.js';
import avatar from 'vue-avatar'

export default {
  name: "car-details",
  data() {
    return {
      car: null,
      comment: {
        txt: '',
      },
      bid: {
        price: 0,
      },
      like: {},
      isLoading: false,
      now: Date.now(),
      timeLeftInterval: null,
      modalOpen: false,
      topic: this.$route.params.carId,
      isLiked: false
    };
  },
  computed: {
    lastBid() {
      var bid = 0
      if (this.car.auction.bids.length) {
        bid = this.car.auction.bids[0].price
      } else {
        bid = this.car.auction.startPrice
      }
      // return bid
      return bid.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    lastBidNum() {
      var bid = 0
      if (this.car.auction.bids.length) {
        bid = this.car.auction.bids[0].price
      } else {
        bid = this.car.auction.startPrice
      }
      return bid
    },
    currentPrice() {
      var bid = 0
      if (this.car.auction.bids.length) {
        bid = this.car.auction.bids[0].price
      } else {
        bid = this.car.auction.startPrice
      }
      return bid
    },
    timeLeft() {
      const diff = this.car.auction.createdAt + this.car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return moment.duration(diff).format()
    },
    commentsToShow() {
      return this.car.comments
    },
    bidsToShow() {
      return this.car.auction.bids
    },
    isActive() {
      return this.isLiked ? 'active' : ''
    },
    likesCount() {
      return this.car.likes.length
    },
    mileage() {
      return this.car.mileage.toLocaleString('en-US')
    }
  },

  methods: {
    async loadCar() {
      const carId = this.$route.params.carId;
      this.isLoading = true
      try {
        this.car = await carService.getById(carId)
        this.car.comments.sort((comm1, comm2) => { return comm2.createdAt - comm1.createdAt })
        this.car.auction.bids.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
      } catch (err) {
        console.log(err)
        showMsg('Cannot load car', 'danger')
      } finally {
        this.isLoading = false
      }
    },
    async placeBid() {
      this.$store.dispatch({ type: "getLoggedinUser" });
      if (!this.$store.getters.loggedinUser) {
        this.$store.commit('toggleLogin', { isShown: true })
      }
    },
    getImgUrl(pic) {
      if (!pic.includes('images')) {
        return pic
      }
      return require('../assets/' + pic)
    },
    async addComment() {
      try {
        this.$store.dispatch({ type: "getLoggedinUser" });
        if (!this.$store.getters.loggedinUser) {
          this.$store.commit('toggleLogin', { isShown: true })
        }
        else {
          this.comment.carId = this.car._id;
          const commentToAdd = await this.$store.dispatch({ type: 'addComment', comment: this.comment })
          socketService.emit('details newComment', commentToAdd)
          this.car.comments.unshift(commentToAdd)
          this.comment.txt = ''
          showMsg('Comment saved successfuly')
        }
      } catch (err) {
        showMsg('Cannot save comment', 'danger')
      }
    },
    async addBid() {
      try {
        this.$store.dispatch({ type: "getLoggedinUser" });
        if (!this.$store.getters.loggedinUser) {
          this.$store.commit('toggleLogin', { isShown: true })
        }
        else {
          if (this.bid.price > this.currentPrice) {
            this.bid.carId = this.car._id;
            const bidToAdd = await this.$store.dispatch({ type: 'addBid', bid: this.bid })
            socketService.emit('details newBid', bidToAdd)
            this.car.auction.bids.unshift(bidToAdd)
            this.bid.price = 0
            showMsg('Bid placed successfuly')
          } else {
            showMsg('Bid price must be over ' + this.currentPrice, 'danger')
          }
        }
      } catch (err) {
        showMsg('Cannot place bid', 'danger')
      } finally {
        this.modalOpen = false
      }
    },
    async toggleLike() {
      this.$store.dispatch({ type: "getLoggedinUser" });
      if (!this.$store.getters.loggedinUser) {
        this.$store.commit('toggleLogin', { isShown: true })
      }
      else {
        this.isLiked = !this.isLiked
        if (this.isLiked) {
          this.like.carId = this.car._id;
          var likeToAdd = await this.$store.dispatch({ type: 'addLike', like: this.like })
          this.car.likes.push(likeToAdd)
          likeToAdd.carId = this.car._id
          likeToAdd.isAdd = true
          socketService.emit('details newLike', likeToAdd)
        } else {
          var idx = this.car.likes.findIndex(like => {
            return like.by._id === this.$store.getters.loggedinUser._id
          })
          this.like.carId = this.car._id;
          likeToAdd = await this.$store.dispatch({ type: 'removeLike', like: this.like })
          likeToAdd.carId = this.car._id
          likeToAdd.isAdd = false
          socketService.emit('details newLike', likeToAdd)
          this.car.likes.splice(idx, 1)
        }
      }
    },
    findLike() {
      this.$store.dispatch({ type: "getLoggedinUser" });
      if (this.$store.getters.loggedinUser && this.car.likes.length) {
        const idx = this.car.likes.findIndex(like=> {
          return like.by._id === this.$store.getters.loggedinUser._id
        })        
        if (idx >= 0) this.isLiked = true
      }
    },
    someOneAddBid(bid) {
      this.car.auction.bids.unshift(bid)
    },
    someOneAddComment(comment) {
      this.car.comments.unshift(comment)
    },
    someOneChangeLike(like) {
      if (like.isAdd) this.car.likes.unshift(like)
      else {
          var idx = this.car.likes.findIndex(currLike => {
            return like.id === currLike.id
          })
          this.car.likes.splice(idx, 1)                  
      }
    },
  },
  async created() {
    socketService.emit('details topic', this.topic)
    socketService.on('details addBid', this.someOneAddBid)
    socketService.on('details addComment', this.someOneAddComment)
    socketService.on('details changeLike', this.someOneChangeLike)
    await this.loadCar()
    this.findLike()
    this.timeLeftInterval = setInterval(() => {
      this.now = Date.now()
    }, 1000);

  },
  watch: {
    "$route.params.carId"(id) {
      console.log("Changed to", id);
      this.loadCar();
    },
  },
  destroyed() {
    clearInterval(this.timeLeftInterval);
    socketService.off('details addBid', this.someOneAddBid)
    socketService.off('details addComment', this.someOneAddComment)
    socketService.off('details changeLike', this.someOneChangeLike)
  },
  components: {
    avatar,
    mainInfo,
    bidList
  }
}
</script>