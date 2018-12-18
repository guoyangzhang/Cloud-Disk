<!--
    文件：src/views/testCom/index.vue
    作者：沈旭东
    时间：2018-12-07
    描述：测试组件
-->
<template>
    <div class="testCom">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Vue组件" name="first">
                <AppComponent-Vue/>
            </el-tab-pane>

            <el-tab-pane label="JS组件" name="second">
                <AppComponent-JS/>
            </el-tab-pane>

            <el-tab-pane label="切换组件 If/else" name="third">
                <div class="title">
                    <el-button @click="onClick1">切换组件</el-button>
                </div>
                <vue1 v-if="isShowVue"></vue1>
                <vue2 v-else></vue2>
            </el-tab-pane>

            <el-tab-pane label="切换组件component" name="fourth">
                <div class="title">
                    <el-button @click="onClick2">切换组件</el-button>
                </div>
                <component :is="computeComp"></component>
            </el-tab-pane>

            <el-tab-pane label="父子传值" name="five">
                <parent1></parent1>
            </el-tab-pane>

            <el-tab-pane label="slot插槽" name="six">
                <h3>dialog弹窗，vue动画</h3>
                <el-button @click="onOpenDialog">打开Dialog</el-button>
                <dialogCom v-model="isShowDialog" :isTween="true" :keepShow="true">
                    <div class="dialogPage page">
                        <h1>Hello World</h1>
                    </div>
                </dialogCom>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import AppComponentVue from './AppComponent.vue';
    import AppComponentJS from './AppComponent.js';
    import vue1 from './widget/vue1';
    import vue2 from './widget/vue2';
    import vue3 from './widget/vue3';
    import vue4 from './widget/vue4';
    import parent1 from './widget2/parent1';
    import dialogCom from './dialogCom';

    export default {
        components: {
            'AppComponent-Vue': AppComponentVue,
            'AppComponent-JS': AppComponentJS,
            vue1,
            vue2,
            vue3,
            vue4,
            parent1,
            dialogCom,
        },
        data () {
            return {
                activeName: 'first',
                isShowVue: true,
                vueIndex: 1,
                isShowDialog: false,
            };
        },
        computed: {
            computeComp () {
                switch (this.vueIndex) {
                    case 4:
                        return 'vue4';
                    case 3:
                        return 'vue3';
                    case 2:
                        return 'vue2';
                    case 1:
                    default:
                        return 'vue1';
                }
            }
        },
        async mounted () {

        },
        methods: {
            /**
             * 点击切换组件
             */
            onClick1 () {
                this.isShowVue = !this.isShowVue;
            },
            /**
             * 切换动态组件
             */
            onClick2 () {
                this.vueIndex++;
                if (this.vueIndex > 4) {
                    this.vueIndex = 1;
                }
            },
            /**
             * 切换选项卡
             * @param tab
             * @param event
             */
            handleClick (tab, event) {
                // console.log(tab, event);
            },
            onOpenDialog () {
                this.isShowDialog = true;
            }
        }
    };
</script>

<style lang="scss">
    $dialog_width: 500px;
    $dialog_height: 400px;

    .testCom {
        .title {
            background-color: #eee;
        }

        .dialogPage {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -$dialog_width/2;
            margin-top: -$dialog_height/2;
        }

        .page {
            background-color: #fff;
            width: $dialog_width;
            height: $dialog_height;
        }
    }
</style>