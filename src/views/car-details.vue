<template>
  <div v-if="car" class="car-details flex flex-col justify-center align-center">
    <div class="short-info align-self-start">
      <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
      <h3>
        ~ {{ car.mileage }} Miles, {{ car.engine }} Engine,
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
      <h3>
        ⏱ Time Left <span>{{ timeLeft }}</span>
      </h3>
      <h3>
        Current Bid <span>{{ lastBid }}</span>
      </h3>
      <h3>
        # Bids <span>{{ car.auction.bids.length }}</span>
      </h3>
      <h3>
        &#128172; Comments <span>{{ car.comments.length }}</span>
      </h3>
      <button class="round-main bid" @click="modalOpen=false" >Place Bid</button>
      <button class="round-main watch">Follow</button>
    </div>

    <div class="flex justify-between">
      <main-info :car="car"></main-info>
      <div class="bids-container">
        <h2>Bids:</h2>
        <ul class="clean-list">
          <li v-for="bid in bidsToShow" :key="bid.id">
            <div class="flex align-center bid-by">
              <avatar :size="30" :username="bid.by.fullname"> </avatar>
              <p>{{ bid.by.fullname }}</p>
              <span>{{ bid.createdAt | moment("calendar") }}</span>
            </div>
            <div class="bid-price flex justify-center align-center">
              {{ bid.price }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col comments-container">
      <h2>Comments & Bids</h2>

      <form @submit.prevent="addComment" class="add-comment flex">
        <textarea
          v-model="comment.txt"
          rows="3"
          placeholder="Add a Comment..."
        ></textarea>
        <button>Send</button>
      </form>

      <div v-if="modalOpen" class="screen" @click="modalOpen=false"></div>
      <div class="place-bid-modal">
        <input type="number" v-model.number="bid.price" />
        <button @click="addBid">place bid</button>
      </div>

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
    <!-- 
    <ul class="review-container clean-list">
      <li v-for="bid in bidsToShow" :key="bid.id">
        <span
          >bid from: {{ bid.by.fullname }} ➡ {{ bid.bidPrice }} |
          {{ bid.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span
        >
      </li>
    </ul> -->

    <!-- <div class="details-btn-container">
      <router-link to="/car" class="back-btn">Back</router-link>
    </div> -->

    <!-- <chat-room :carId="car._id"></chat-room> -->
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
      topic : this.$route.params.carId,
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
        showMsg('Cannot place vid', 'danger')
      }
    },
    async addLike() {
      try {
        this.like.carId = this.car._id;
        await this.$store.dispatch({ type: 'addLike', like: this.like })
        await this.loadCar()
        //        this..txt = ''
        //showMsg('Comment saved successfuly')
      } catch (err) {
        //showMsg('Cannot save comment', 'danger')
      }
    },
    async removeLike() {
      try {
        this.like.carId = this.car._id;
        await this.$store.dispatch({ type: 'removeLike', like: this.like })
        await this.loadCar()
        //        this..txt = ''
        //showMsg('Comment saved successfuly')
      } catch (err) {
        //showMsg('Cannot save comment', 'danger')
      }
    },
    someOneAddBid(bid){
      this.car.auction.bids.unshift(bid)
    },
    someOneAddComment(comment){
      this.car.comments.unshift(comment)
    },
    someOneChangeLike() {

    },
  },
  created() {
    socketService.emit('details topic', this.topic)
    socketService.on('details addBid', this.someOneAddBid)
    socketService.on('details addComment', this.someOneAddComment)
    socketService.on('details changeLike', this.someOneChangeLike)
    this.loadCar()
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
    mainInfo
  }
}
</script>