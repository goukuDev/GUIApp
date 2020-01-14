<template>
    <div class="weather" v-loading='weatherLoading'>
        <div class="topweather" v-if="weatherData">
            <div class="left">
                <div class="city">{{weatherData.city}}</div>
                <div>{{weatherData.weather}}</div>
                <img :src="require(`../../../static/img/icon/${weatherData.img}.png`)"/>
                <div>最低温度:{{weatherData.templow}}℃</div>
                <div>在高温度:{{weatherData.temphigh}}℃</div>
            </div>
            <div class="right">
                PM2.5:{{weatherData.aqi.quality}}{{weatherData.aqi.ipm2_5}}
            </div>
        </div>
        <!-- 一周天气显示 -->
        <div class="weekweather">
            <swiper v-if="weatherData" :options='swiperOptionWeek' ref="myswiperweek">
                <swiper-slide v-for="(item,index) in weatherData.daily" :key="index">
                    <div class="swiperweekdetail">
                        {{item.week}}
                        {{item.date}}
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
                        {{item.weather}}
                        {{item.temp}}℃
                        <img :src="require(`../../../static/img/icon/${item.img}.png`)"/>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
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
                silders:'3'
            },
            swiperOptionHourly: {
                observer: true,
                observeParents: true,
                speed: 500,
                silders:'3'
            }
        }
    },
    mounted(){
        if(!!sessionStorage.getItem('weather'))
            this.weatherData = JSON.parse(sessionStorage.getItem('weather'));
        else    
            this.getLoaclPosition();
        console.log(this.weatherData)
    },
    methods:{
        async getLoaclPosition(){
            this.getWeather(this.ChooseAddress.name)
        },
        async getWeather(city){
            this.weatherLoading = true;
            await axios.get(`https://jisutqybmf.market.alicloudapi.com/weather/query?city=${city}`,{headers:{'Authorization':'APPCODE def0b8f2c0304cb59b0a7cdaa24dd000' }})
            .then(res=>{
                this.weatherLoading = false;
                this.weatherData = res.data.result;
                sessionStorage.setItem('weather',JSON.stringify(res.data.result));
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'index.scss';
</style>