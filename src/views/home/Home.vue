<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                @tabClick="tabClick"
                ref="tabControl1"
                class="tab-control"
                v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <ul><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li></ul> -->
  </div>
</template>

<script>
// 公共组件
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
// import BackTop from '../../components/content/backTop/BackTop'

// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

// 请求的数据
// 不是default导出要用{}
import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'

export default {
  name:'Home',
  components:{
    // 公共组件
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    // BackTop,
    // 子组件
    HomeSwiper,
    RecommendView,
    FeatureView
  },
  mixins: [itemListenerMixin, backTopMixin],
  data(){
    return {
      // 保存返回的数据
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list:[]},
        'new': {page: 0, list:[]},
        'sell': {page: 0, list:[]},
      },
      currentType: 'pop',
      // isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  // 活跃时
  activated(){
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  // 不活跃时
  deactivated(){
    // 保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    // 取消全局事件的监听
    this.$bus.$off('itemImageLoad',this.itemImageListener)
  },
  created() {
    // 不要在created里面拿元素 可能拿不到
    // 1.请求多个数据 调用函数
  this.getHomeMultidata()

    // 2.请求商品数据
  this.getHomeGoods('pop')
  this.getHomeGoods('new')
  this.getHomeGoods('sell')
  },
  // mounted() {
  // // 1.监听item中图片加载完成
  // const refresh = debounce(this.$refs.scroll.refresh, 100)
  // // 对监听的事件进行保存
  // this.itemImageListener = ()=>{
  //   refresh()
  // }
  // this.$bus.$on('itemImageLoad',this.itemImageListener)
  // },
  methods: {
    /**
     * 事件监听相关方法
     */

    tabClick(index){
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    // backClick(){
    //   // 回到顶部  this.$refs.scroll 拿到的是scroll组件
    //   this.$refs.scroll.scrollTo(0,0,500)
    // },
    contentScroll(position){
      // 1.判断回到顶部是否显示
      // this.isShowBackTop = (-position.y) > 1000
      this.listenShowBackTop(position)
      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      // 获取tabControl的offsetTop
      // 所有的组件都有一个属性$el：用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /**
     * 网络请求相关方法
     */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page+1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // 下一次加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home{
  /* padding-top: 44px; */
  /* 百分之百视口高度 */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #ffffff;
  /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
  /* position: fixed;
  left: 0;
  top: 0px;
  right: 0;
  z-index: 9; */
}
/* .tab-control{
  到达高度之前是static 达到高度之后是fixed 低版本浏览器不支持
  position: sticky;
  top:44px;
  z-index: 9;
} */
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
}
/* .content{
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
.tab-control{
  /* z-index 只对定位的元素起作用 */
  position: relative;
  z-index: 9;
}
</style>

