<!--
    文件：src/app.vue
    作者：沈旭东
    时间：2018-05-02
    描述：主界面
-->
<template>
    <div id="app" v-loading="loading" element-loading-text="玩命加载中">
        <!-- http拦截器 -->
        <http-interceptor></http-interceptor>

        <!--路由切换不清空页面-->
        <!--<keep-alive>-->
        <!--<router-view></router-view>-->
        <!--</keep-alive>-->

        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { httpInterceptor } from '@/components/common';

    export default {
        components: {
            httpInterceptor: httpInterceptor.default ? httpInterceptor.default : httpInterceptor
        },
        computed: {
            ...mapGetters({
                loading: 'global.loading'
            })
        },
        watch: {
            $route (to, from) {
                // console.log('route', to.path);
                document.title = `路由地址:${to.path}`;
            }
        }
    };
</script>

<style lang="scss">
    /*less样式库*/
    @import url('assets/css/index.css');
    /* tydic公共组件样式库 */
    @import 'assets/scss/index.scss';
    // element-ui 主题
    @import './../theme/index.css';
</style>
