<template>
    <div class="weatherbox" v-loading='weatherLoading'>
        <div class="topweather" v-if="weatherData">
            <div class="left">
                <div class="city">{{weatherData.city}}</div>
                <div><img :src="require(`../../../static/img/icon/${weatherData.img}.png`)"/></div>
                <div class="weather">
                    <div>{{weatherData.temp}}℃</div>
                    <div>{{weatherData.weather}}</div>
                    <div class="wind">{{weatherData.winddirect}}{{weatherData.windpower}}</div>
                    <div>(实时)</div>
                </div>
                <!-- <div class="wind">{{weatherData.winddirect}}{{weatherData.windpower}}</div> -->
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
            chartLine:null,
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
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'index.scss';
</style>