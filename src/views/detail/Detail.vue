<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScoll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <!-- @addCart="addToCart" -->
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'

import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'

import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    Scroll,
    GoodsList,
    // Toast,

    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar
  },
  mixins: [itemListenerMixin, backTopMixin],
  data(){
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
  created(){
    // 保存传入的iid
    this.iid = this.$route.params.iid

    // 根据iid请求详情数据
    getDetail(this.iid).then(res => {
    const data = res.result
    //  1.获取顶部的轮播数据
    this.topImages = data.itemInfo.topImages
    // console.log(data)
    // 2.获取商品信息
    this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
    // 3.创建店铺信息对象
    this.shop = new Shop(data.shopInfo)
    // 4.保存商品的详情数据
    this.detailInfo = data.detailInfo;
    // 5.获取参数信息
    this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
    // 6.取出评论信息
    if(data.rate.cRate !== 0){
      this.commentInfo = data.rate.list[0]
    }
    })
    // 请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })
    // 给getThemeTopY赋值 对给this.themeTopYs赋值的操作进行防抖
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs)
    }, 100)
  },
  // mounted() {
  //   const refresh = debounce(this.$refs.scroll.refresh, 100)
  //   this.itemImageListener = ()=>{
  //     refresh()
  //   }
  //   this.$bus.$on('itemImageLoad',this.itemImageListener)
  // },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImageListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
    },
    contentScoll(positions){
      // 1.获取y值
      // console.log(positions);
      const positionY = -positions.y
      // 2.positionY和主题中值进行对比
      // [0, 7938, 9120, 9452]
      // positionY 在 0 和 7938 之间 ， index= 0
      // positionY 在 7938 和 9120 之间 ， index= 1
      // positionY 在 9120 和 9452 之间 ， index= 2
      // positionY大于等于9452时， index= 3
      let length = this.themeTopYs.length
      for(let i = 0; i < length-1; i++){
        // if(this.currentIndex !== i && ((i < length - 1 && positionY > this
        // .themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||(i === length - 1 && positionY
        // >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex;
        //   console.log(this.currentIndex)
        // }
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this
        .themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
          // console.log(this.currentIndex)
          this.listenShowBackTop(positions)
        }
      }
    },
    addToCart(){
      // 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.nowPrice;
      product.iid = this.iid;
      // 将商品添加到购物车里
      // this.$store.commit('addCart', product)
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res)
      // })

      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = '';
        // }, 1500);

        this.$toast.show(res, 1000)
      })
    }
  }
}
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #ffffff;
  height: 100vh;
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color: #ffffff;
}
.content{
  height: calc(100% - 44px - 58px);
}
</style>
