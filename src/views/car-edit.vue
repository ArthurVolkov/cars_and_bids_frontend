<template>
  <section v-if="carToEdit" class="car-edit flex flex-col align-center">
    <h2>{{ title }}</h2>
    <form @submit.prevent="saveCar">
    <div class="flex flex-col justify-center align-center">
      <el-select @change="setModel" v-model="carToEdit.vendor" placeholder="vendors">
        <el-option v-for="item in vendors" :key="item.value" 
          :label="item.label"
          :value="item.value"></el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-select v-model="carToEdit.model" placeholder="model">
        <el-option v-for="item in models" :key="item.value"
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-select v-model.number="carToEdit.year" placeholder="year">
        <el-option v-for="item in years" :key="item.value"
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-select v-model="carToEdit.bodyStyle" placeholder="Body style">
        <el-option v-for="item in bodyStyles" :key="item.value" 
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-input-number v-model="carToEdit.mileage" controls-position="right"
        :min="0"></el-input-number>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-select v-model="carToEdit.drivetrain" placeholder="drivetrain">
        <el-option v-for="item in drivetrains" :key="item.value"
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-select v-model="carToEdit.transmission" placeholder="transmission">
        <el-option v-for="item in transmissions" :key="item.value"
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>

    <div class="flex flex-col justify-center align-center">
      <el-select v-model="carToEdit.exteriorColor" placeholder="exterior color"
          filterable remote reserve-keyword>
        <el-option v-for="item in colors" :key="item.value"
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>    

    <div class="flex flex-col justify-center align-center">
      <el-select v-model="carToEdit.interiorColor" placeholder="interior color"
        filterable remote reserve-keyword>
        <el-option v-for="item in colors" :key="item.value"
          :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>    

    <div class="flex flex-col justify-center align-center">
      <el-input v-model="carToEdit.desc" placeholder="description" clearable>
      </el-input>
    </div>    
    <!-- TODO: check that adress exist and fetch lat lang -->
    <div class="flex flex-col justify-center align-center">
      <el-input v-model="carToEdit.location.address" placeholder="address"
        clearable>
      </el-input>
    </div>    

    <div class="flex flex-col justify-center align-center">
      <el-input-number v-model="carToEdit.auction.startPrice" controls-position="right"
        :min="0" >
      </el-input-number>
    </div>

    <button>Save</button>
    <router-link to="/car" class="back-btn">Back</router-link>
    </form>
  </section>
  <div
    v-else
    v-loading.fullscreen.lock="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
  </div>
</template>

<script>
import { dataService } from "@/services/data.service.js";
import { carService } from "@/services/car.service.js";
import { showMsg } from '../services/eventBus.service.js'

export default {
  name: "car-edit",
  data() {
    return {
      carToEdit: null,
      bodyStyles: carService.getBodyStyleList(),
      vendors: carService.getVendorList(),
      models: dataService.getCars(''),
      years: [],
      transmissions: carService.getTransmissionList(),
      drivetrains: carService.getDrivetrainList(),
      colors: dataService.getColors()
    }
  },
  computed: {
    carId() {
      return this.$route.params.carId
    },
    title() {
      return this.carId ? 'Car Edit' : 'Car Add'
    },
    loading() {
      return this.carToEdit ? false : true
    },
  },
  methods: {
    setModel() {
      this.models = dataService.getCars(this.carToEdit.vendor)
    },
    async saveCar() {
      console.log('Saving...', this.carToEdit);
      try {
        await this.$store.dispatch({ type: 'saveCar', car: this.carToEdit })
        showMsg('Car saved')
        this.carToEdit = carService.getEmptyCar()
        this.$router.push('/car')
        try {
          await this.$store.dispatch({ type: "loadCars" });
        } catch (err) {
          showMsg("Cannot load cars", "danger");
        }
      } catch (err) {
        showMsg('Cannot save cars', 'danger')
      }
    },
  },
  created() {
    for (let i = 2021; i >= 1970; i--) {
      this.years.push({ value: i, label: i });
    }
    if (this.carId) {
      try {
        carService.getById(this.carId)
          .then((car) => {
            //console.log('car:', car)
            this.carToEdit = car
          })
      } catch (err) {
        showMsg('Cannot load car', 'danger')
      }
    } else {
      this.carToEdit = carService.getEmptyCar()
    }
  },
}
</script>