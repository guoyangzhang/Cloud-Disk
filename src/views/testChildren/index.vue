<template>
    <div class="vue2-test-page">
        <div class="tootle">
            <h2 class="title">
                <router-link class="routerLink" to="/">vue2主页面</router-link>
            </h2>
            <vue2ToolBar></vue2ToolBar>
        </div>

        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import vue2ToolBar from './widget/vue2ToolBar';

    export default {
        // 组件
        components: {
            vue2ToolBar,
        },
        // data 数据
        data () {
            return {};
        },
        // 监听属性props
        watch: {},
        // 计算属性
        computed: {},
        // 生命周期-created
        created () {

        },
        // 生命周期-mounted
        mounted () {

        },
        // 自定义的处理方法集合
        methods: {
            onClick () {

            }
        },
    };
</script>

<style lang="scss">
    .vue2-test-page {
        .title {
            margin-bottom: 10px;
        }

        .tootle {
            background-color: #eee;
            margin-bottom: 4px;
        }
    }
</style>