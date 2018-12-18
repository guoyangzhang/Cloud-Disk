<!--
    文件：src/views/home/index.vue
    作者：沈旭东
    时间：2018-04-17
    描述：主页面
-->
<template>
    <div class="home">
        <!--使用router-link跳转路由-->
        <el-button type="info" size="small" class="rowBtns">
            <router-link class="routerLink" to="/layout">FLex圣杯布局</router-link>
        </el-button>

        <el-row class="rowBtns">
            <!--手动注册跳转路由-->
            <el-button type="primary" size="small " @click="onTestNetwork1">网络通信测试1</el-button>
            <el-button type="primary" size="small " @click="onTestNetwork2">网络通信测试2</el-button>

            <!--vue生命周期测试-->
            <el-button type="primary" size="small ">
                <router-link class="routerLink" to="/testParent">vue生命周期测试</router-link>
            </el-button>

            <!--测试 路由切换-->
            <el-button type="primary" size="small ">
                <router-link class="routerLink" to="/testChildren">vue-router路由切换</router-link>
            </el-button>

            <!--组件化开发-->
            <el-button type="primary" size="small ">
                <router-link class="routerLink" to="/testCom">组件化开发</router-link>
            </el-button>

            <el-button type="primary" size="small ">
                <router-link class="routerLink" to="/testCom">动态组件注册</router-link>
            </el-button>

            <!--&lt;!&ndash;测试各种动态组件&ndash;&gt;-->
            <!--<el-button type="primary" size="small ">-->
            <!--</el-button>-->
        </el-row>
    </div>

</template>

<script>
    export default {
        data () {
            return {};
        },
        async mounted () {

        },
        methods: {
            onTestNetwork1 () {
                this.$router.push('/testBackend');
            },
            onTestNetwork2 () {
                this.$router.push({name: 'testBackend', query: {data: 12345}});
                // this.$router.push({name: 'testBackend', query: {data: {age: 123, name: 'Hello WOrld'}}});
            },
        },
    };
</script>

<style lang="scss">
    .home {
        .routerLink {
            color: #FFF;
        }

        .rowBtns {
            margin: 10px 20px;
        }
    }
</style>
