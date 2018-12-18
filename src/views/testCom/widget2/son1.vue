<!--
    文件：src/views/testCom/widget2/son1.vue
    作者：沈旭东
    时间：2018-12-06
    描述：测试父子组件传值 - 子组件
-->
<template>
    <div class="son1">
        <div class="title">
            <div class="title">
                <h2>子组件</h2>
                <span>儿子年龄:{{sonAge}}</span>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            parentAge: {
                type: Number,
                default: 0
            },
            age: {
                type: Number,
                default: 0
            }
        },
        computed: {
            sonAge () {
                return Math.max(this.age, 0);
            },
        },
        data () {
            return {};
        },
        watch: {
            sonAge () {
                this.$emit('num2', this.sonAge % 2);
            },
            age () {
                if ((this.age + this.parentAge) % 10) {
                    this.$emit('input', true);
                } else {
                    this.$emit('input', false);
                }
            }
        },
        created () {

        },
        mounted () {

        },
        methods: {},
    };
</script>

<style lang="scss">
    .son1 {
        .title {
            background-color: #ddd;
        }
    }
</style>
