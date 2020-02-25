<template>
    <div class="tab-bar-item" @click="itemClick">
        <div v-if='!isActive'><slot name="item-icon"></slot></div>
        <div v-else><slot name="item-icon-active"></slot></div>
        <!-- 插槽可能会被替换掉 所以外面套一层div 写逻辑 -->
        <div :style="activeStyle"><slot name="item-text"></slot></div>
    </div>
</template>

<script>
export default {
    name:'TabBarItem',
    props:{
        path: String,
        activeColor:{
            type:String,
            default:'blue'
        }
    },
    data(){
        return{
            // isActive:true,
        }
    },
    computed:{
        isActive(){
            // $router 路由对象
            // $route 当前路由对象 处于活跃的路由对象
            // 判断当前路由里面有没有这个item的path
            // 在所以路由里面找到当前路由
            return this.$route.path.indexOf(this.path) !== -1
        },
        activeStyle(){
            return this.isActive ? {color: this.activeColor} : {}
        }
    },
    methods:{
        itemClick(){
            if(this.$router.history.current.path !== this.path){
               //replace重定向不返回 push返回
               this.$router.replace(this.path)
            }
        }
    }
}
</script>

<style scoped>
 .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
 .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
</style>