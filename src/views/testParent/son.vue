<!--
    文件：src/views/testParent/son.vue
    作者：沈旭东
    时间：2018-12-06
    描述：测试父子组件 - 子组件
-->
<template>
    <div>
        <div>子组件:张小三</div>
        <span>今年{{sonAge}}岁了</span>

        <grandson :age="sonAge"></grandson>
    </div>
</template>

<script>
    import grandson from './grandson';

    const logStyle = 'background:#FF9800;color:#fff;font-size:16px';
    console.log2 = function (msg, ...data) {
        console.log(`%c ${msg}`, logStyle, ...data);
    };

    export default {
        name: 'sonCom',
        props: {
            age: {
                type: Number,
                default: 0
            }
        },
        components: {
            grandson
        },
        computed: {
            sonAge () {
                return this.age - 20;
            },
        },
        data () {
            console.log2('son data');
            return {
                age1: 20
            };
        },
        beforeCreate () {
            console.log2('son beforeCreate');
        },
        created () {
            console.log2('son created');
        },
        beforeMount () {
            console.log2('son beforeMount');
        },
        mounted () {
            console.log2('son mounted');
        },
        beforeUpdate () {
            console.log2('son beforeUpdate');
        },
        updated () {
            console.log2('son updated');
        },
        methods: {
            setAge (age) {
                this.age1 = age;
            }
        },
        beforeDestroy () {
            console.log2('son beforeDestroy');
        },
        destroyed () {
            console.log2('son destroyed');
        },
    };
</script>

<style scoped>

</style>
