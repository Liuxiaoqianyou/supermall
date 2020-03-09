<template>
    <div class="bottom-bar">
      <div class="check-content">
        <check-button
                :is-checked="isSelectAll"
                class="check-botton"
                @click.native="checkClick"/>
        <span>全选</span>
      </div>

      <div class="price">
        合计:{{totalPrice}}
      </div>

      <div class="calculate" @click="calcClick">
        去计算:({{checkLength}})
      </div>
    </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll(){
      if(this.$store.state.cartList.length !== 0){
        return !this.$store.state.cartList.find(item => !item.checked)
        // return !(this.$store.state.cartList.filter(item => !item.checked).length)
      }
    }
  },
  methods: {
    checkClick() {
      // 全部选中
      if(this.isSelectAll){
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        // 部分选中
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick(){
      if(!this.isSelectAll){
        this.$toast.show('请选择购买的商品')
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar{
  height: 40px;
  background-color: #eeeeee;
  position: relative;
  bottom: 135px;
  left: 0;
  line-height: 40px;
  display: flex;
  font-size: 14px;
}
.check-content{
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 5px;
  width: 60px;
}
.check-botton{
  width:20px;
  height: 20px;
  line-height: 20px;
}
.price{
  margin-left: 30px;
  flex: 1;
}
.calculate{
  width: 75px;
  background-color: blue;
  color: #ffffff;
  text-align: center;
}
</style>
