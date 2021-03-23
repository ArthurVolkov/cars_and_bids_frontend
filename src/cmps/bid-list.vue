<template>
  <div class="bid-container flex flex-col align-center">
    <h2>Last bids</h2>
    <ul v-if="bids.length" class="bid-list clean-list">
      <li v-for="bid in bids" :key="bid.id">
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
    <h3 v-else>No bids on this car yet</h3>
  </div>
</template>



<script>
var moment = require("moment");

import avatar from 'vue-avatar'

export default {
  props: {
    bids: {
      type: Array,
    },
  },
  name: "bid-list",
  data() {
    return {
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

    getImgUrl(pic) {
      if (!pic.includes('images')) {
        return pic
      }
      return require('../assets/' + pic)
    },
  },
  created() {

  },
  watch: {

  },
  destroyed() {

  },
  components: {
    avatar,
  }
}
</script>