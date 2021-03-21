<template>
  <section class="car-filter flex justify-between">
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

    <div class="flex flex-col justify-center align-center">
      <el-select
        v-model="filterBy.bodyStyles"
        @change="setFilter"
        placeholder="Body style"
      >
        <el-option
          v-for="item in bodyStyles"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <!-- <label for="sort">Sort:</label> -->
      <el-select
        v-model="filterBy.vendors"
        @change="setFilter"
        placeholder="vendors"
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
    </div>
    <button @click="setSort('ending-soon')" class="sort-btn">
      Ending soon
    </button>
    <button @click="setSort('newly-listed')" class="sort-btn">
      Newly listed
    </button>
    <button @click="setSort('lowest-mileage')" class="sort-btn">
      Lowest mileage
    </button>
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
  data() {
    return {
      filterBy: {
        byYears: [1970, 2021],
        year: {
          from: 0,
          to: 2021
        },
        years: [1970, 2021],
        bodyStyles: '',
        vendors: [],
        sortBy: '',
      },
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
      this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
      this.$store.dispatch({ type: 'loadCars' })
    },
    setSort(sortBy) {
      this.filterBy.sortBy = sortBy
      this.$store.commit({ type: 'setSort', sortBy: this.filterBy.sortBy })
      this.$store.dispatch({ type: 'loadCars' })

    }
  },
  created() {
    this.filterBy = this.$store.getters.filterBy;
    
    for (let i = 2021; i >= 1970; i--) {
      this.years.push({ value: i, label: i });
    }
  },
  destroyed() {
    this.filterBy.byYears = [1970, 2021],
    this.filterBy.years = [1970, 2021],
    this.filterBy.bodyStyles = '',
    this.filterBy.vendors =  [],
    this.filterBy.sortBy = ''
    this.$store.commit({ type: 'setFilter', filterBy: this.filterBy })
  }
}
</script>

