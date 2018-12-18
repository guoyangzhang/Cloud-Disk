<!-- 
	文件：commponents/watermark	
        作者：皮书章
	时间：2017-06-26
	描述：水印
 -->
<template>
    <mark class="water-mark">
        <i v-text="text" v-for="c in 250"></i>
    </mark>
</template>
<script>
    export default {
        data () {
            return {
                text: '',
                date: '',
                focus: false
            }
        },
        mounted () {
            let today = new Date()
            let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            this.date = today.getFullYear() + '_' + (today.getMonth() + 1) + '_' + today.getDate() + ' ' + (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()) + ':' + (today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds())
            // 可以通过初始化，获得宽高，计算需要多少水印覆盖
            let user = JSON.parse(window.sessionStorage.getItem('LOGIN_USER'))
            this.text = user.account + '_' + user.userName + '_' + user.ip + ' ' + this.date
        }
    }
</script>