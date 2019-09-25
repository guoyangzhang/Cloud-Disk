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
            <!--&lt;!&ndash;手动注册跳转路由&ndash;&gt;-->
            <!--<el-button type="primary" size="small " @click="onTestNetwork1">网络通信测试1</el-button>-->
            <!--<el-button type="primary" size="small " @click="onTestNetwork2">网络通信测试2</el-button>-->

            <!--&lt;!&ndash;vue生命周期测试&ndash;&gt;-->
            <!--<el-button type="primary" size="small ">-->
            <!--<router-link class="routerLink" to="/testParent">vue生命周期测试</router-link>-->
            <!--</el-button>-->

            <!--&lt;!&ndash;测试 路由切换&ndash;&gt;-->
            <!--<el-button type="primary" size="small ">-->
            <!--<router-link class="routerLink" to="/testChildren">vue-router路由切换</router-link>-->
            <!--</el-button>-->

            <!--&lt;!&ndash;组件化开发&ndash;&gt;-->
            <!--<el-button type="primary" size="small ">-->
            <!--<router-link class="routerLink" to="/testCom">组件化开发</router-link>-->
            <!--</el-button>-->

            <!--<el-button type="primary" size="small ">-->
            <!--<router-link class="routerLink" to="/testCom">动态组件注册</router-link>-->
            <!--</el-button>-->
            <el-button type="primary" size="small ">
                <router-link class="routerLink"
                             :to="{path:'/treeDemo',query:{isButton:this.isButton,chunkNum:this.chunkNum}}">拖拽实现文件夹上传
                </router-link>
            </el-button>
            <el-button type="primary" size="small ">
                <router-link class="routerLink"
                             :to="{path:'/bottomUpload',query:{isButton:this.isButton,chunkNum:this.chunkNum}}">上传按钮实现上传文件
                </router-link>
            </el-button>
            <!--&lt;!&ndash;测试各种动态组件&ndash;&gt;-->
            <!--<el-button type="primary" size="small ">-->
            <!--</el-button>-->
        </el-row>
        <div style="margin-right: 100px; margin-left: 100px">
            <p>设置参数</p>
            <p>是否需要自动上传:</p>
            <button id="buttonUpload" type="button" @click="OnButton()" class="button_full">手动上传</button>
            <p>设置分片大小:</p> <input class="input_new" type="text" v-model="chunkNum"/>
            <p class="p_new">M</p>
        </div>
        <div style="margin-top:50px ">
            <bottomUpload :isButton='isButton' :chunkNum='chunkNum'></bottomUpload>

            <!--<treeDemo :isButton='isButton' :chunkNum='chunkNum'></treeDemo>-->

        </div>
    </div>

</template>

<script>
    import treeDemo from '../treeDemo/index';
    import bottomUpload from '../bottomUpload/index';

    export default {
        data() {
            return {
                isButton: true,
                chunkNum: '5',
            };
        },
        async mounted() {

        },
        components: {
            // treeDemo,
            bottomUpload,
        },
        methods: {
            onTestNetwork1() {
                this.$router.push('/testBackend');
            },
            onTestNetwork2() {
                // this.$router.push({name: 'testBackend', query: {data: 12345}});
                // this.$router.push({name: 'testBackend', query: {data: {age: 123, name: 'Hello WOrld'}}});
            },
            OnButton() {
                let self = this;
                var passwd = document.getElementById('buttonUpload');
                passwd.type = 'button';
                if (self.isButton === true) {
                    passwd.textContent = '自动上传';
                    self.isButton = false;
                } else {
                    passwd.textContent = '手动上传';
                    self.isButton = true;
                }
            },
        },
    };

</script>

<style lang="scss">
    .input_new {
        width: 80px;
        height: 22.5px;
        margin-right: 150px;
        margin-left: 150px;
        margin-top: -40px
    }

    .button_full {
        margin-right: 150px;
        margin-left: 150px;
        margin-top: -40px
    }

    .p_new {
        margin-right: 230px;
        margin-left: 230px;
        margin-top: -40px
    }

    .home {
        .routerLink {
            color: #FFF;
        }

        .rowBtns {
            margin: 10px 20px;
        }
    }
</style>
