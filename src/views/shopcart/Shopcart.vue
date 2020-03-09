<template>
    <div class="cart">
      <!-- 导航 -->
      <nav-bar class="nav-bar">
        <div slot="center">购物车({{length}})</div>
      </nav-bar>
      <!-- 商品列表 -->
      <cart-list/>
      <!-- 底部汇总 -->
      <cart-bottom-bar/>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import { mapGetters } from 'vuex'

export default {
  name:'Shopcart',
  components:{
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 两种语法
    // ...mapGetters(['cartLength','cartList'])
    // ...mapGetters({
    //   length: 'cartLength',
    //   list: 'cartList'
    // })
    ...mapGetters({
      length: 'cartLength'
    })
    // cartLength() {
    //   return this.$store.getters.cartLength
    // }
  }
}
</script>

<style scoped>
.nav-bar{
  background-color: var(--color-tint);
  color: #ffffff;
}
</style>
