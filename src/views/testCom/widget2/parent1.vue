<!--
    文件：src/views/testCom/widget2/parent1.vue
    作者：沈旭东
    时间：2018-12-06
    描述：测试父子组件传值 - 父组件
-->
<template>
    <div class="parent1">
        <div class="title">
            <h2>父组件</h2>
            <span>父亲年龄:{{age}}</span>
            <span :class="num2?'color1':'color2'">儿子年龄{{num2?'偶数':'基数'}}</span>
            <span>{{allAgeMsg}}</span>
            <el-button @click="onClick">过了一年</el-button>
        </div>
        <son1 :parentAge="age" :age="sonAge" @num2="onNum2" v-model="isAll"></son1>
    </div>
</template>

<script>
    import son1 from './son1';

    export default {
        components: {
            son1,
        },
        computed: {
            sonAge: {
                get () {
                    return this.age - 24;
                },
                set () {
                    console.log('设置计算属性');
                }
            },
            allAgeMsg () {
                if (this.isAll) {
                    return `总年龄:${this.age + this.sonAge}`;
                } else {
                    return `整数年龄:${this.age + this.sonAge}`;
                }
            }
        },
        data () {
            return {
                age: 30,
                num2: true,
                isAll: false, // 是否总年龄为10整数倍年龄
            };
        },
        created () {
        },
        mounted () {
        },
        methods: {
            onClick () {
                this.age++;
            },
            onNum2 (isNumb2) {
                this.num2 = isNumb2;
            }
        },
    };
</script>

<style lang="scss">
    .parent1 {
        span {
            font-size: 16px;
        }

        .title {
            background-color: #eee;
        }

        .color1 {
            color: orange;
        }

        .color2 {
            color: #5FB878;
        }
    }
</style>
