<template>
    <div class="map">
        <div id="container"></div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
        this.initMap()
    },
    methods:{
        initMap(){
            let map = new BMap.Map('container');
            //地图中心
            let point = new BMap.Point(116.404,39.915);
            map.centerAndZoom(point,15);
            //允许滚轮缩放地图
            map.enableScrollWheelZoom(true);
            //切换卫星地图
            map.addControl(new BMap.MapTypeControl({
                mapTypes:[
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]
            }));
            map.setCurrentCity('北京');

            //定位到当前的地址
            let  myFun = (data) =>{
                let cityName = data.name;
                map.setCenter(cityName);
                this.$emit('address',data)
            }
            let myCity = new BMap.LocalCity();
            myCity.get(myFun);
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'index.scss';
</style>