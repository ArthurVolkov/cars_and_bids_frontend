<template>
  <div class="img-upload-container flex flex-col">
    <template>
      <!-- <template v-if="!isLoading"> -->
      <!-- UPLOAD IMG -->
      <h2>Photos</h2>
      <p>
        Please upload at least 5 photos of the exterior and interior of the car.
      </p>
      <label
        for="imgUploader"
        @drop.prevent="handleFile"
        @dragover.prevent="dragOver"
        @dragleave="isDragOver = false"
        :class="{ drag: isDragOver }"
      >
        <div class="drag-container flex flex-col justify-center align-center">
          <div class="upload-logo-container">
            <img src="../assets/images/upload.png" alt="" />
          </div>
          <p>Click to select photos, or drag and drop here</p>
        </div>

        <img-list v-if="imgUrls.length" :imgUrls="imgUrls" />

        <!-- <h3 v-else>Drop image here</h3> -->
      </label>
      <!-- HIDDEN INPUT -->
      <input
        type="file"
        name="img-uploader"
        id="imgUploader"
        @change="handleFile"
      />
    </template>
    <!-- LOADER -->
    <!-- <img
      class="loader"
      v-else
      src="https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"
      alt=""
    /> -->
  </div>
</template>

<script>
import { uploadImg } from "@/services/img-upload.service.js";
import imgList from '../cmps/img-list';



export default {
  data() {
    return {
      isLoading: false,
      isDragOver: false,
      imgUrls: [],

    };
  },
  methods: {
    dragOver(ev) {
      this.isDragOver = true;
    },
    handleFile(ev) {
      console.log('ev:', ev)
      let file;
      if (ev.type === "change") file = ev.target.files[0];
      else if (ev.type === "drop") file = ev.dataTransfer.files[0];
      console.log('file:', file)
      this.onUploadImg(file);
    },

    async onUploadImg(file) {
      // console.log('file:', file)
      this.isLoading = true;
      this.isDragOver = false;
      const res = await uploadImg(file);
      this.imgUrls.push(res.url)
      // this.$emit("save", res.url);
      this.isLoading = false;
    },
  },
  components: {
    imgList
  }
};
</script>

<style>
/* .loader {
  height: 150px;
}

label img {
  height: 100px;
  cursor: pointer;
  transition: height 0.6s;
}

input {
  width: 0;
  height: 0;
}
.drag {
  color: grey;
  display: inline-block;
  padding: 30px 5px;
  width: 220px;
  border: 1px dashed gray;
  border-radius: 8px;
} */
</style>