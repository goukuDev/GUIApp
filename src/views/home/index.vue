<template>
  <div class="home">
    <!-- 头部 -->
    <div class="top">
      <el-radio-group v-model="isCollapse">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 底部 -->
    <div class="bottom">
      <!-- 左侧边栏 -->
      <el-menu default-active="maps" class="el-menu-vertical-demo" :collapse="isCollapse">
        <el-menu-item v-for="(item,index) of saides" :index="item.type" :key="index" @click="activeType = item.type">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
      <!-- 右侧边栏 -->
      <div class="right">
        <component :is='activeType'></component>
      </div>
    </div>
  </div>
</template>

<script>
import {maps,news,weather} from 'components';
export default {
  data(){
    return{
      saides:[
        {name:'地图',type:'maps',icon:'el-icon-location'},
        {name:'天气',type:'weather',icon:'el-icon-menu'},
        {name:'新闻',type:'news',icon:'el-icon-setting'}
      ],
      activeType:'maps',
      isCollapse:true,
      elradiobutton:false,
    }
  },
  components:{maps,news,weather},
}
</script>
<style lang="scss" scoped>
  @import 'index.scss';
</style>
