<template>
  <section class="list-row card-grid" :class="isHome">
    <car-preview
      v-for="car in cars"
      :car="car"
      :key="car._id"
      class="car-item-container flex flex-col justify-between align-center"
    ></car-preview>
    <!-- <div v-else class="car-loading flex justify-center align-center">
      LOADING...
    </div> -->
  </section>
</template>

<script>
import carPreview from "@/cmps/car-preview.vue";
import { Loading } from 'element-ui';

export default {
  props: {
    cars: {
      type: Array,
    },
  },
  name: "car-row",
  data() {
    return {
      isHomeRout: false
    }
  },
  methods: {
    // remove(car) {
    //   this.$emit('remove', car);
    // },
    setPage(val) {
      console.log('val:', val)
      this.$emit('setPage', val);
    }
  },
  computed: {
    loading() {
      return false
      // return this.$store.getters.loading
    },
    carsCount() {
      return this.$store.getters.carsCount
    },
    isHome() {
      return this.isHomeRout ? 'in-home' : ''
    }
  },
  created() {
    this.isHomeRout = (this.$route.path === '/') ? true : false
  },
  components: {
    carPreview,
  },
};
</script>