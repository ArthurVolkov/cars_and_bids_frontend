<template>
  <div class="bid-info-container">
    <h2>{{ car.year }} {{ car.vendor }} {{ car.model }}</h2>
    <div class="bid-info flex flex-col justify-between">
      <div v-if="bidToShow" class="flex flex-col justify-between">
        <div @click="userProfile(bidToShow.by._id)" class="flex align-center">
          <h3>Current bid</h3>
          <avatar
            :size="18"
            :username="bidToShow.by.fullname"
            :src="bidToShow.by.imgUrl"
            class="pointer"
          >
          </avatar>
          <p>{{ bidToShow.by.fullname }}</p>
        </div>
        <h1>{{ lastBid }}</h1>
      </div>
      <div v-else class="flex flex-col">
        <h3>No bids for this car yet, start price is</h3>
        <h1>{{ startPrice }}</h1>
      </div>
      <div class="flex flex-col justify-between">
        <div @click="userProfile(car.owner._id)" class="flex align-center">
          <h4>Seller</h4>
          <avatar
            :size="18"
            :username="car.owner.fullname"
            :src="car.owner.imgUrl"
            class="pointer"
          >
          </avatar>
          <p>{{ car.owner.fullname }}</p>
        </div>
        <div class="flex align-center">
          <h4>Ending</h4>
          <p>
            {{
              (car.auction.createdAt + car.auction.duration)
                | moment("MMMM Do, HH:mm")
            }}
          </p>
        </div>
        <div class="flex align-center">
          <h4>Bids</h4>
          <p># {{ car.auction.bids.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
// import { carService } from "@/services/car.service.js";
import avatar from 'vue-avatar'
var moment = require("moment");




export default {
  name: "bid-info",
  props: {
    car: {
      type: Object,
      bidToShow: null
    },
  },
  computed: {
    lastBid() {
      return this.bidToShow?.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    },
    startPrice() {
      return this.car.auction.startPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })

    }
    // bidToShow() {
    //   // return this.car.auction.bids.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
    //   const bids = this.car.auction.bids.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })
    //   return bids[0]
    // },
  },
  methods: {
    userProfile(userId) {
      this.$router.push(`/activity/${userId}`)
    },
  },
  created() {
    this.bidToShow = this.car.auction.bids?.sort((bid1, bid2) => { return bid2.createdAt - bid1.createdAt })[0]
  },
  components: {
    avatar
  }
}
</script>