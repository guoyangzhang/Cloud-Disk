/**
 * 文件：src/views/testCom/index.vue
 * 作者：沈旭东
 * 时间：2018-12-07
 * 描述：AppComponent 纯jS模式注册组件
 */
import Vue from 'vue';

export default Vue.component('AppComponentJS', {
    template: `<div class="app-component" v-show="isShow">
    <h2>JS文件注册的组件</h2>
    <div>
        <button @click="onClick">点我</button>
        <button @click="onClickList">添加</button>
    </div>
    <div>
        {{title}}
    </div>

    <div v-if="isEnabled">111</div>
    <div v-else>222</div>

    <div :class="isEnabled?'class1':'class2'">AAAAAAAAA</div>

    {{list.length}}
    {{listSize}}

    <div v-for="(item,index) in list" :key="index">{{item.name}} -- {{item.key}}</div>
</div>`,

    name: 'vue1-template',
    // 组件
    components: {},
    // 接收父组件属性
    props: {
        isShow: {
            type: Boolean,
            default: true
        }
    },
    // data 数据
    data () {
        return {
            isEnabled: false,
            title: 'Hello Worldasd',
            list: []
        };
    },
    // 监听属性props
    watch: {},
    // 计算属性
    computed: {
        listSize () {
            let total = 0;
            for (let item of this.list) {
                if (item.key > 0.5) {
                    total++;
                }
            }
            return total;
        }
    },
    // 生命周期-created
    created () {

    },
    // 生命周期-mounted
    mounted () {

    },
    // 自定义的处理方法集合
    methods: {
        onClick () {
            this.isEnabled = !this.isEnabled;
        },
        onClickList () {
            this.list.push({
                name: 'aaaa',
                key: Math.random()
            });
        }
    },
});