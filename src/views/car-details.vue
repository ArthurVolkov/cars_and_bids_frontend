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
        &#128172; Comments <span>{{ car.auction.bids.length }}</span>
      </h3>
      <button class="round-main bid">Place Bid</button>
      <button class="round-main watch">💛 Watch</button>
    </div>

    <div class="main-info details-icon-grid">
      <pre
        class="flex align-center"
      ><font-awesome-icon icon="trademark" class="main-info-icon" />  Make:</pre>
      <span>{{ car.vendor }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="list-ul" class="main-info-icon" />  Model:</pre>
      <span>{{ car.model }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="calendar-alt" class="main-info-icon" />  Year:</pre>
      <span>{{ car.year }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="car-side" class="main-info-icon" />  Body Style:</pre>
      <span>{{ car.bodyStyle }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="calendar-alt" class="main-info-icon" />  Mileage:</pre>
      <span>{{ car.mileage }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="truck-monster" class="main-info-icon" />  Drivetrain:</pre>
      <span>{{ car.drivetrain }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="microchip" class="main-info-icon" />  Engine:</pre>
      <span>{{ car.engine }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="cogs" class="main-info-icon" />  Transmission:</pre>
      <span>{{ car.transmission }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="palette" class="main-info-icon" />  Exterior Color:</pre>
      <span>{{ car.exteriorColor }}</span>

      <pre
        class="flex align-center"
      ><font-awesome-icon icon="palette" class="main-info-icon" />  Interior Color:</pre>
      <span>{{ car.interiorColor }}</span>
    </div>

    <!-- <form @submit.prevent="addBid" class="review-form flex flex-col">
      <el-input type="number" placeholder="Place bid..." v-model="bid.price">
      </el-input>
      <button>Send</button>
    </form> -->

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
      <input type="number" v-model.number="bid.price" />
      <button @click="addBid">place bid</button>
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
      <h3>Bids:</h3>
      <ul class="clean-list comments-list">
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
import { showMsg } from '../services/eventBus.service.js'
var moment = require("moment");
//import { reviewService } from "../services/review.service.js";
//import chatRoom from '../cmps/chat-room'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faCarSide } from '@fortawesome/free-solid-svg-icons'
import { faTrademark } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { faMicrochip } from '@fortawesome/free-solid-svg-icons'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { faTruckMonster } from '@fortawesome/free-solid-svg-icons'
import { faPalette } from '@fortawesome/free-solid-svg-icons'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { userService } from '../services/user.service.js';
import avatar from 'vue-avatar'


library.add(faCarSide)
library.add(faTrademark)
library.add(faCalendarAlt)
library.add(faMicrochip)
library.add(faCogs)
library.add(faTruckMonster)
library.add(faPalette)
library.add(faListUl)


export default {
  name: "car-details",
  data() {
    return {
      car: null,
      comment: {
        txt: '',
      },
      comments: [],
      bid: {
        price: 0,
      },
      bids: [],
      like: {},
      likes: [],
      isLoading: false,
      now: Date.now(),
      timeLeftInterval: null
    };
  },
  computed: {
    spesifications() {
      const {
        bodyStyle, drivetrain, engine, transmission, exteriorColor, interiorColor, mileage, vendor, model, year
      } = this.car
      return [
        // { icon: '<font-awesome-icon icon="user-secret" />', val: bodyStyle },
        // drivetrain,
        // engine,
        // transmission,
        // exteriorColor,
        // interiorColor,
        // mileage,
        // vendor,
        // model,
        // year
      ]
    },
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
        this.comments = this.car.comments.sort((comm1, comm2) => { return comm2.createdAt - comm1.createdAt })
        this.bids = this.car.auction.bids.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
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
            this.$store.commit('toggleLogin', {isShown: true})
        }
    },
    getImgUrl(pic) {
      return require('../assets/' + pic)
    },
    async addComment() {
      try {
        this.$store.dispatch({ type: "getLoggedinUser" });
        if (!this.$store.getters.loggedinUser) {        
            this.$store.commit('toggleLogin', {isShown: true})
        }
        else {
          this.comment.carId = this.car._id;
          await this.$store.dispatch({ type: 'addComment', comment: this.comment })
          await this.loadCar()
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
            this.$store.commit('toggleLogin', {isShown: true})
        }
        else {
          console.log(this.bid.price)
          console.log(this.currentPrice)
          if (this.bid.price > this.currentPrice) {
            this.bid.carId = this.car._id;
            await this.$store.dispatch({ type: 'addBid', bid: this.bid })
            this.bid.price = 0
            this.loadCar()
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
  },
  created() {
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
  },
  components: {
    avatar
  }
}
</script>