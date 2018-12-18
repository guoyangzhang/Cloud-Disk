<!--
    文件：src/views/layout/widget/header.vue
    作者：沈旭东
    时间：2018-04-17
    描述：头部公共模块
-->
<template>
    <header>
        <span>{{title}}</span>
    </header>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        components: {},
        data () {
            return {
                title: '头部',
            }
        },
        watch: {},
        computed: {
            ...mapGetters({
                user: 'global.user',
            }),
        },
        methods: {}
    }
</script>
