<template>
  <section class="activity flex flex-col">
    <h1>User Activites</h1>
  </section>
</template>

<script>
// import carList from "@/cmps/car-list.vue";

import { showMsg } from '../services/eventBus.service.js'

export default {
  name: "activity",
  computed: {
    carsToShow() {
      // console.log("carsToShow in car-app:", this.$store.getters.carsToShow);
      return this.$store.getters.carsToShow;
    },
  },
  methods: {

  },
  components: {
    // carList,
  },
  created(){
    // this.$store.dispatch({ type: 'loadCars' })
  }
};
</script>