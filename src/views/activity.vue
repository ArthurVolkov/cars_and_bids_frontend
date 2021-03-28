<template>
  <section v-if="userCars && user" class="activity-container flex flex-col">
    <div class="user-info-container flex justify-between">
      <div class="user-avatar-container">
        <img v-if="user.imgUrl" :src="user.imgUrl" alt="" />
        <img v-else src="../assets/images/no-image-available.jpg" alt="" />
      </div>
      <div class="user-info flex justify-around">
        <div class="flex flex-col justify-between">
          <h2>{{ user.fullname }}</h2>
          <h4>Joined at <span class="created-at">{{ user.createdAt | moment("MMMM Do, HH:mm") }}</span></h4>
        </div>
        <div class="flex flex-col justify-between">
          <h3>
            Cars in auction: <span>{{ carsOwnerToShow.length }}</span>
          </h3>

          <!-- <h4>2</h4> -->
          <h3>
            Likes: <span>{{ carsLikedToShow.length }}</span>
          </h3>

          <h3>
            Comments: <span>{{ carsCommentedToShow.length }}</span>
          </h3>
        </div>
      </div>
    </div>

    <div class="flex flex-col own-car-container">
      <h2>Active auctions</h2>
      <ul class="clean-list flex justify-between minilist-container">
        <li
          v-for="car in carsOwnerToShow"
          :key="car._id"
          class="liked-car-mini flex"
        >
          <div class="img-container">
            <img
              :src="getImgUrl(car.imgUrls[0])"
              alt=""
              class="pointer"
              @click="openDetails(car._id)"
            />
          </div>
          <div class="w-full flex flex-col justify-between">
            <div class="flex justify-between align-center w-full">
              <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
              <div>
                <font-awesome-icon icon="heart" class="main-info-icon heart" />
                <span>({{ car.likes.length }})</span>
              </div>
            </div>
            <div>
              <p class="address">{{ car.location.address }}</p>
            </div>
            <div class="flex justify-between align-center w-full">
              <h3>{{ lastBid(car) }} #Bids ({{ car.auction.bids.length }})</h3>
              <p>
                <font-awesome-icon icon="clock" class="main-info-icon clock" />
                <span>{{ timeLeft(car) }}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="flex flex-col own-car-container">
      <h2>My bids</h2>
      <ul class="clean-list flex justify-between minilist-container">
        <li
          v-for="car in carsBidedToShow"
          :key="car._id"
          class="liked-car-mini flex"
        >
          <div class="img-container">
            <img
              :src="getImgUrl(car.imgUrls[0])"
              alt=""
              class="pointer"
              @click="openDetails(car._id)"
            />
          </div>
          <div class="w-full flex flex-col justify-between">
            <div class="flex justify-between align-center w-full">
              <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>

              <p>
                <font-awesome-icon icon="clock" class="main-info-icon clock" />
                <span>{{ timeLeft(car) }}</span>
              </p>
            </div>
            <div>
              <p class="address">{{ car.location.address }}</p>
            </div>
            <div class="flex justify-between align-center w-full">
              <p>
                My bid <span :class="isLastBid(car)">{{ myBid(car) }}</span>
              </p>
              <p>
                Last bid <span>{{ lastBid(car) }}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="flex flex-col liked-car-container">
      <h2>Subscribed cars</h2>
      <ul class="clean-list flex justify-between minilist-container">
        <li
          v-for="car in carsLikedToShow"
          :key="car._id"
          class="liked-car-mini flex"
        >
          <div class="img-container">
            <img
              :src="getImgUrl(car.imgUrls[0])"
              alt=""
              class="pointer"
              @click="openDetails(car._id)"
            />
          </div>
          <div class="w-full flex flex-col justify-between">
            <div class="flex justify-between align-center w-full">
              <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
              <div>
                <font-awesome-icon icon="heart" class="main-info-icon heart" />
                <span>({{ car.likes.length }})</span>
              </div>
            </div>
            <div>
              <p class="address">{{ car.location.address }}</p>
            </div>
            <div class="flex justify-between align-center w-full">
              <h3>{{ lastBid(car) }} #Bids ({{ car.auction.bids.length }})</h3>
              <p>
                <font-awesome-icon icon="clock" class="main-info-icon clock" />
                <span>{{ timeLeft(car) }}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
  <!-- <div v-else class="activity-container">
    <h1>No such page...</h1>
  </div> -->
  <div
    v-else
    v-loading.fullscreen.lock="isLoading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  ></div>
</template>

<script>
// import carList from "@/cmps/car-list.vue";

import { showMsg } from '../services/eventBus.service.js'
import { carService } from '../services/car.service.js'
import { userService } from '../services/user.service.js'
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

export default {
  name: "activity",
  data() {
    return {
      userCars: null,
      user: null,
      now: Date.now(),
      isLoading: false
    }
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
    carsOwnerToShow() {
      console.log('this.userCars:', this.userCars)
      var carsOwner = this.userCars.filter(car => {
        return car.owner._id === this.userId
      })
      var sortCars = JSON.parse(JSON.stringify(carsOwner)) || null
      sortCars?.sort((car1, car2) => { return car1.auction.createdAt - car2.auction.createdAt })
      return sortCars;
    },
    carsLikedToShow() {
      var carsLiked = this.userCars.filter(car => {
        var likes = car.likes.filter(like => {
          return like.by._id === this.userId
        })
        car.myLikes = likes
        return likes.length
      })
      var sortCars = JSON.parse(JSON.stringify(carsLiked)) || null
      sortCars?.sort((car1, car2) => { return car1.auction.createdAt - car2.auction.createdAt })
      return sortCars;
    },
    carsCommentedToShow() {
      var carsCommented = this.userCars.filter(car => {
        var comments = car.comments.filter(comment => {
          return comment.by._id === this.userId
        })
        car.myComments = comments
        return comments.length
      })
      return carsCommented;
    },
    carsBidedToShow() {
      var carsBided = this.userCars.filter(car => {
        var bids = car.auction.bids.filter((bid, idx) => {
          if (idx === 0) {
            if (bid.by._id === this.userId) {
              bid.lastBid = { price: bid.price, isMine: true }
              bid.idx = idx
            }
          }
          return bid.by._id === this.userId
        })
        var sortBids = JSON.parse(JSON.stringify(bids)) || null
        sortBids?.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
        car.auction.myBids = sortBids
        return sortBids.length
      })

      var sortCars = JSON.parse(JSON.stringify(carsBided)) || null
      sortCars?.sort((car1, car2) => { return car1.auction.createdAt - car2.auction.createdAt })
      return sortCars;
    },
  },
  methods: {
    async loadUserCars() {
      try {
        const userId = this.$route.params.userId
        this.isLoading = true
        this.userCars = await carService.queryUserCars(userId);
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'Can not load cars',
          type: 'danger'
        });
      } finally {
        this.isLoading = false
      }
      // console.log('userCars:', this.userCars)
    },
    getImgUrl(pic) {
      if (!pic.includes('images')) {
        return pic
      }
      return require('../assets/' + pic)
    },
    lastBid(car) {
      return carService.getLastBid(car).toLocaleString('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 0
      })
    },
    timeLeft(car) {
      // const diff = this.now - this.car.auction.createdAt + this.car.auction.duration
      const diff = car.auction.createdAt + car.auction.duration - this.now
      if (diff <= 0) return 'Finished'
      return moment.duration(diff).format()
    },
    myBid(car) {
      return car.auction.myBids[0].price.toLocaleString('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 0
      })
    },
    isLastBid(car) {
      return car.auction.myBids[0] >= car.auction.bids[0] ? '' : 'danger'
    },
    openDetails(carId) {
      this.$router.push(`/car/details/${carId}`)
    },
    someOneAddBid(bid) {
      this.userCars.forEach(car => {
        if (car._id === bid.carId) car.auction.bids.unshift(bid)
      })
    },
    someOneAddComment(comment) {
      this.userCars.forEach(car => {
        if (car._id === comment.carId) car.comments.unshift(bid)
      })
    },
    someOneChangeLike(like) {
      this.userCars.forEach(car => {
        if (car._id === like.carId) {
          if (like.isAdd) car.likes.unshift(like)
          else {
            var idx = car.likes.findIndex(currLike => {
              return like.userId === currLike.by._id
            })
            car.likes.splice(idx, 1)
          }
        }
      })
    },
  },
  components: {
    // carList,
  },
  async created() {
    try {
      socketService.on('details addBid', this.someOneAddBid)
      socketService.on('details addComment', this.someOneAddComment)
      socketService.on('details changeLike', this.someOneChangeLike)
      const userId = this.$route.params.userId
      this.user = await userService.getById(userId)
      console.log('this.user:', this.user)
      await this.loadUserCars()
    } catch (err) {
      console.log('can`t load user cars', err);
    }
    this.timeLeftInterval = setInterval(() => {
      this.now = Date.now()
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timeLeftInterval);
    socketService.off('details addBid', this.someOneAddBid)
    socketService.off('details addComment', this.someOneAddComment)
    socketService.off('details changeLike', this.someOneChangeLike)
  }
};
</script>