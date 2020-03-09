<template>
  <div class="toast"  v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  // props: {
  //   message: {
  //     type: String,
  //     default: ''
  //   },
  //   show: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    show(message, duration=1000){
      // console.log(11111111111111111)
      this.isShow = true;
      this.message = message;

      setTimeout(() => {
        this.isShow = false;
        this.message = ''
      }, duration);
    }
  }
}
</script>

<style scoped>
.toast{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
  padding: 5px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, .7);
  z-index: 99;
}
</style>
