<!--
    文件：src/views/layout/flexIndex.vue
    作者：沈旭东
    时间：2018-12-06
    描述：FLex圣杯布局
-->
<template>
    <div class="flexIndex">
        <!--头部-->
        <tydic-header class="tHeader"></tydic-header>
        <div class="tBody">
            <!--侧边栏-->
            <tydic-aside class="tNav"></tydic-aside>
            <main class="tMain">主体</main>
        </div>
        <!--底部-->
        <tydic-footer class="tFooter"></tydic-footer>
    </div>
</template>

<script>
    import header from './widget/header';
    import footer from './widget/footer';
    import aside from './widget/nav';

    export default {
        components: {
            'tydic-header': header,
            'tydic-footer': footer,
            'tydic-aside': aside,
        },
        data () {
            return {};
        },
        async mounted () {
        },
        methods: {}
    };

</script>

<style lang="scss">

    #app {
        height: 100%;
    }

    .flexIndex {
        & {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .tHeader {
            flex: 0 0 50px;
            background-color: #f2f2f2;
        }

        .tBody {
            flex: 1;
            display: flex;
        }

        .tNav {
            flex: 0 0 200px;
            background-color: #e2e2e2;
        }

        .tMain {
            flex: 1;
            background-color: #f6f6f6;
        }

        .tFooter {
            flex: 0 0 50px;
            background-color: #f2f2f2;
        }
    }
</style>