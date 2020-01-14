<template>
    <div class="news" v-loading='newsLoading'>
        <div class="top">
            <el-button v-for="(item,index) of newslist" :key="index" @click="getNewsList(item.type)">{{item.name}}</el-button>
        </div>
        <div class="list">
            <div v-for="item of newsdetail" :key="item.uniquekey" @click="openWindow(item)">
                <h2>{{item.title}}</h2>
                <span>{{item.author_name}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>{{item.date}}</span>
                <div class="imglist">
                    <img v-lazy='item[imgurl]' alt="" v-for="(imgurl,index) in item.imgUrl" :key="index">
                </div>
            </div>
        </div>
        <div class='taskbar'>
            <div v-for="wind in windows" :key="wind.uniquekey" :class="{active:wind==currentWindow}" @click="openWindow(wind)">
                {{wind.author_name}}
            </div>
        </div>
        <!-- 新闻详情 -->
        <transition name="details">
            <detail class="detail" 
            v-if="currentWindow" 
            @hidding="currentWindow=null" 
            @closing="closeWindow(currentWindow)"
            :key="currentWindow.uniquekey" 
            :datanews="currentWindow">
            </detail>
        </transition>
    </div>
</template>
<script>
import axios from 'axios';
import detail from 'NewsDetail';
export default {
    data(){
        return{
            newslist:[
                {
                    name:"头条",
                    type:"top",
                },
                {
                    name:"娱乐",
                    type:"yule",
                },
                {
                    name:"体育",
                    type:"tiyu",
                },
                {
                    name:"财经",
                    type:"caijing",
                },
                {
                    name:"军事",
                    type:"junshi",
                },
                {
                    name:"科技",
                    type:"keji",
                },
                {
                    name:"社会",
                    type:"shehui"
                },
                {
                    name:"国内",
                    type:"guonei",
                },
                {
                    name:"国际",
                    type:"guoji"
                },
                {
                    name:"时尚",
                    type:"shishang",
                }
            ],
            type:'top',
            newsdetail:[],
            windows:[],
            currentWindow:null,
            newsLoading:false,
        }
    },
    components:{detail},
    mounted(){
        this.getNewsList(this.type)
    },
    methods:{
        async getNewsList(type){
            this.newsLoading = true;
            this.newsdetail = [];
            await axios.get(`http://toutiao-ali.juheapi.com/toutiao/index?type=${type}`,{headers:{'Authorization':'APPCODE def0b8f2c0304cb59b0a7cdaa24dd000'}})
            .then(res=>{
                this.newsLoading = false;
                this.newsdetail = res.data.result.data && res.data.result.data.map(o=>Object.assign({},o,{imgUrl:[].concat(Object.keys(o).filter(e=>e.includes('thumbnail_pic_s')))}));
            })
        },
        openWindow(item){
            let wind = this.windows.find(o => o.uniquekey == item.uniquekey);
            if(wind)
                this.currentWindow = item;
            else
                this.windows.push(item);this.currentWindow = item;
        },
        closeWindow(wind) {
            this.windows = this.windows.filter(o=>o.uniquekey!=wind.uniquekey);
            this.currentWindow = null;
        },
    }
}
</script>
<style lang="scss" scoped>
    @import 'index.scss';
</style>