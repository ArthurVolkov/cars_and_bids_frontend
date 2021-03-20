<template>
  <section class="home-nav flex justify-between align-center">
    <!-- <div class="flex flex-col justify-center align-center"> -->

    <button @click="yearsRangeIsOpen = !yearsRangeIsOpen" class="filter-btn">
      Years
    </button>
    <div v-if="yearsRangeIsOpen" class="block years-range">
      <el-slider
        @change="setFilter"
        v-model="filterBy.years"
        range
        :min="1970"
        :max="2021"
        :marks="marks"
      >
        >
      </el-slider>
    </div>

    <!-- <div class="flex flex-col justify-center align-center"> -->
      <el-select
        v-model="filterBy.bodyStyles"
        @change="setFilter"
        placeholder="Body style"
        class="body-style"
      >
        <el-option
          v-for="item in bodyStyles"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    <!-- </div> -->

    <!-- <div class="flex flex-col justify-center align-center"> -->
      <!-- <label for="sort">Sort:</label> -->
      <el-select
        v-model="filterBy.vendors"
        @change="setFilter"
        placeholder="Vendors"
        multiple
        collapse-tags
      >
        <el-option
          v-for="item in vendors"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    <!-- </div> -->

    <el-input
      @input="setFilterName"
      placeholder="Search for car"
      v-model="filterName"
      class="search"
      clearable
    >
    </el-input>
    <button class="round-main go">🔎 Go</button>
  </section>
</template>

<script>
// function debounce(callback, wait) {
//   let timeout;
//   return (...args) => {
//     const context = this;
//     clearTimeout(timeout);
//     timeout = setTimeout(() => callback.apply(context, args), wait);
//   };
// }
import { carService } from "@/services/car.service.js";

export default {


  name: 'home-nav',
  data() {
    return {
      filterBy: {
        byYears: [1970, 2021],
        year: {
          from: 0,
          to: 2021
        },
        // bodyStyles: [],
        years: [1970, 2021],
        bodyStyles: '',
        vendors: [],
        sortBy: '',
      },
      filterName: '',
      years: [],
      bodyStyles: carService.getBodyStyleList(),
      vendors: carService.getVendorList(),
      yearsRangeIsOpen: false,
    }
  },
  computed: {
    marks() {
      return {
        [this.filterBy.byYears[0]]: '' + this.filterBy.byYears[0],
        [this.filterBy.byYears[1]]: '' + this.filterBy.byYears[1],
        // 2021: '2021',
      }
    }
  },
  methods: {
    setFilter() {
      console.log('In Car Filter', this.filterBy.vendors)
      this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
      this.$store.dispatch({ type: 'loadCars' })
    },
    setFilterName() {

    }
  },
  created() {
    //this.filterDebounce = debounce(this.setFilter, 1000);

    for (let i = 2021; i >= 1970; i--) {
      this.years.push({ value: i, label: i });
    }
  },
}
</script>

