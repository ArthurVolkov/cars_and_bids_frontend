<template>
  <section class="activity flex flex-col">
    <h1>User Activites</h1>
    <!-- {{userCars}} -->
  </section>
</template>

<script>
// import carList from "@/cmps/car-list.vue";

import { showMsg } from '../services/eventBus.service.js'
import { carService } from '../services/car.service.js'

export default {
  name: "activity",
  date() {
    return {
      userCars: null,
    }
  },
  computed: {
    userId() {
      return this.$store.getters.loggedinUser._id;
    },
    carsOwnerToShow() {
      var carsOwner = this.userCars.filter(car => {
        return car.owner._id === this.userId
      })
      return carsOwner;
    },
    carsLikedToShow() {
      var carsLiked = this.userCars.filter(car => {
        var likes = car.likes.filter(like => {
          return like.by._id === this.userId
        })
        car.myLikes = likes
        return likes.length
      })
      return carsLiked;
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
        car.auction.myBids = bids
        return bids.length
      })
      return carsBided;
    },
    user() {
      return this.$store.getters.loggedinUser
    }
  },
  methods: {
    async loadUserCars() {
      this.userCars = await carService.queryUserCars(this.$store.getters.loggedinUser._id);
    }
  },
  components: {
    // carList,
  },
  async created() {
    await this.loadUserCars()
    console.log(this.userCars)
    console.log(this.carsOwnerToShow)
    console.log(this.carsLikedToShow)
    console.log(this.carsCommentedToShow)
    console.log(this.carsBidedToShow)
  }
};
</script>