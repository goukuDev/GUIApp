<template>
    <div class="weatherbox" v-loading='weatherLoading'>
        <div class="topweather" v-if="weatherData">
            <div class="left">
                <div class="city">
                    {{weatherData.city}}
                    <a title='切换城市' herf='javascript:;' class='el-icon-sort' @click='showcity = !showcity'/>
                    <!-- 切换城市 -->
                    <div class='showcity' v-if='showcity'>
                        <div class='title'>热门城市:</div>
                        <div class='hotcitybox'>
                            <span v-for='(item,index) in hotcities' :key='index' @click='checkcity(item.city)'>
                                {{item.city}}
                            </span>
                        </div>
                        <div class='searcity'>
                            <div>
                                <el-input placeholder='请输入城市名称' v-model='searcity'/>
                                <el-button @click='esarchcity(searcity)'>搜索</el-button>
                            </div>
                            <div class='searcitylist' v-loading='searchcityloading'>
                                <li v-for='(item,index) in checkcitylist' :key='index' @click='searchcity(item.province)'>{{item.province}}</li>
                            </div> 
                        </div>
                    </div>
                </div>
                <div><img :src="require(`../../../static/img/icon/${weatherData.img}.png`)"/></div>
                <div class="weather">
                    <div>{{weatherData.temp}}℃</div>
                    <div>{{weatherData.weather}}</div>
                    <div class="wind">{{weatherData.winddirect}}{{weatherData.windpower}}</div>
                    <div>(实时)</div>
                </div>
            </div>
            <div class="right">
                <div class='quality' :class="aqipm(weatherData.aqi.quality)">{{weatherData.aqi.quality}}{{weatherData.aqi.ipm2_5}}</div>
                <div class='aqiinfo'>{{weatherData.aqi.aqiinfo.affect}}</div>
                <div class='aqiinfo'>{{weatherData.aqi.aqiinfo.measure}}</div>
            </div>
        </div>
        <!-- 一周天气显示 -->
        <div class="weekweather">
            <swiper v-if="weatherData" :options='swiperOptionWeek' ref="myswiperweek">
                <swiper-slide v-for="(item,index) in weatherData.daily" :key="index">
                    <div class="swiperweekdetail">
                        <div>{{item.week}}</div>
                        <div>{{item.date}}</div>
                        <img :src="require(`../../../static/img/icon/${item.day.img}.png`)"/>
                        <div>{{`${item.night.templow==item.day.temphigh? item.day.temphigh:item.day.temphigh+'~'+item.night.templow}`}}℃</div>
                        <div>{{`${item.day.weather==item.night.weather? item.day.weather:item.day.weather+'转'+item.night.weather}`}}</div>
                        <div>
                            {{`${item.day.winddirect==item.night.winddirect? item.day.winddirect:item.day.winddirect+'转'+item.night.winddirect}`}}
                            {{`${item.day.windpower==item.night.windpower? item.day.windpower:item.day.windpower+'~'+item.night.windpower}`}}
                        </div>
                        <div>日出:{{item.sunrise}}日落:{{item.sunset}}</div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <!-- 24小时天气显示 -->
        <div class="hourweather">
            <swiper v-if="weatherData" :options='swiperOptionHourly' ref="myswiperhourly">
                <swiper-slide v-for="(item,index) in weatherData.hourly" :key="index">
                    <div class="swiperhourlydetail">
                        {{item.time}}
                        <img :src="require(`../../../static/img/icon/${item.img}.png`)"/>
                        {{item.weather}}
                        {{item.temp}}℃
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import swiper from 'swiper';
export default {
    props:['address'],
    data(){
        return{
            weatherLoading:false,
            ChooseAddress:this.address,
            weatherData:null,
            swiperOptionWeek: {
                observer: true,
                observeParents: true,
                speed: 500,
                slidesPerView: 3,
                spaceBetween: 20,
            },
            swiperOptionHourly: {
                observer: true,
                observeParents: true,
                speed: 500,
                slidesPerView: 10,
            },
            showcity:false,
            hotcities:[
                {
                    province:'北京市',
                    city:'北京市'
                },
                {
                    province:'上海市',
                    city:'上海市'
                },
                {
                    province:'广东省,广州市',
                    city:'广州市'
                },
                {
                    province:'广东省,深圳市',
                    city:'深圳市'
                },
                {
                    province:'浙江省,杭州市',
                    city:'杭州市'
                },
                {
                    province:'四川省,成都市',
                    city:'成都市'
                },
                {
                    province:'河南省,郑州市',
                    city:'郑州市'
                },
                {
                    province:'湖北省,武汉市',
                    city:'武汉市'
                },
                {
                    province:'重庆市',
                    city:'重庆市'
                },
                {
                    province:'江苏省,苏州市',
                    city:'苏州市'
                },
                {
                    province:'江苏省,无锡市',
                    city:'无锡市'
                },
                {
                    province:'湖南省,长沙市',
                    city:'长沙市'
                },
                {
                    province:'辽宁省,沈阳市',
                    city:'沈阳市'
                },
                {
                    province:'陕西省,西安市',
                    city:'西安市'
                },
                {
                    province:'山东省,青岛市',
                    city:'青岛市'
                },
                {
                    province:'福建省,厦门市',
                    city:'厦门市'
                },
                {
                    province:'天津市',
                    city:'天津市'
                },
                {
                    province:'西藏自治区,拉萨市',
                    city:'拉萨市'
                },
            ],
            searcity:'',
            searchcityloading:false,
            checkcitylist:[],
        }
    },
    mounted(){
        // if(!!sessionStorage.getItem('weather'))
        //     this.weatherData = JSON.parse(sessionStorage.getItem('weather'));
        // else    
            this.getLoaclPosition();
    },
    methods:{
        async getLoaclPosition(){
            this.getWeather(this.ChooseAddress.name)
        },
        async getWeather(city){
            this.weatherLoading = true;
            await axios.get(`https://jisutqybmf.market.alicloudapi.com/weather/query?city=${city}`,{headers:{'Authorization':'APPCODE def0b8f2c0304cb59b0a7cdaa24dd000' }})
            .then(res=>{
                this.weatherData = res.data.result;
                this.weatherLoading = false;
                // sessionStorage.setItem('weather',JSON.stringify(res.data.result));
            })
            .catch(err=>{
                console.log(err)
                this.$message.error('请求失败');
                this.weatherLoading = false;
            })
        },
        aqipm(data){
            switch(data){
                case '优':
                    return 'one';
                case '良':
                    return 'two';
                case '轻度污染':
                    return 'three';
                case '中度污染':
                    return 'four';
                case '重度污染':
                    return 'five';
                case '严重污染':
                    return 'six';
            }
        },
        checkcity(city){
            this.getWeather(city);
            this.showcity = false;
        },
        async esarchcity(city){
            this.searchcityloading = true;
            await axios.get(`https://ali-city.showapi.com/areaName?&areaName=${city}&&maxSize=20`,{headers:{'Authorization':'APPCODE def0b8f2c0304cb59b0a7cdaa24dd000' }})
            .then(res=>{
                this.searchcityloading = false;
                this.checkcitylist = res.data.showapi_res_body.data.filter(o=>!(o.areaName.endsWith('乡') || o.areaName.endsWith('镇') || o.areaName.endsWith('街道'))).map(o=>Object.assign({},{province:o.wholeName? o.wholeName.split('中国,')[1]:o.areaName,city:o.areaName}));
            })
            .catch(err=>{
                console.log(err)
            })
        },
        searchcity(data){
            let county = data.split(',')[data.split(',').length-1];
            this.getWeather(county);
            this.showcity = false;
            this.searcity = '';
            this.checkcitylist = [];
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'index.scss';
</style>