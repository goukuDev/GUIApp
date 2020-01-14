<template>
    <div class="newsdetail">
        <div class="top">
            <i class="el-icon-minus" @click="$emit('hidding')" title="最小化"></i>
            <i class="el-icon-close" @click="$emit('closing',datanews)" title="关闭"></i>
        </div>
        <div class="bottom">
            <iframe :src="datanews.url" frameborder="0"></iframe>
        </div>
    </div>
</template>
<script>
export default {
    props:['datanews'],
    data(){
        return{

        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'index.scss';
</style>