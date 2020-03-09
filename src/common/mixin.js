import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    // 1.监听item中图片加载完成
    let refresh = debounce(this.$refs.scroll.refresh, 100)
    // 对监听的事件进行保存
    this.itemImageListener = ()=>{
      refresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImageListener)
    // console.log("我是混入");
  }
}

export const backTopMixin = {
  components: {
    BackTop,
  },
  data() {
    return{
      isShowBackTop: false
    }
  },
  methods: {
    backClick(){
      // 回到顶部  this.$refs.scroll 拿到的是scroll组件
      this.$refs.scroll.scrollTo(0,0,500)
    },
    listenShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
