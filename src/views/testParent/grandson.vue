<!--
    文件：src/views/testParent/grandson.vue
    作者：沈旭东
    时间：2018-12-06
    描述：测试父子组件 - 孙组件
-->
<template>
    <div>
        <div>孙组件:小小三</div>
        <span>今年{{grandsonAge}}岁了</span>
    </div>
</template>

<script>
    const logStyle = 'background:#2196F3;color:#fff;font-size:16px';
    console.log3 = function (msg, ...data) {
        console.log(`%c ${msg}`, logStyle, ...data);
    };

    export default {
        name: 'grandsonCom',
        props: {
            thisEvent: Object,
            age: Number
        },
        computed: {
            grandsonAge () {
                return this.age - 20;
            },
        },
        data () {
            console.log3('grandson data');
            return {
                testAge: 2
            };
        },
        beforeCreate () {
            console.log3('grandson beforeCreate');
        },
        created () {
            console.log3('grandson created');
        },
        beforeMount () {
            console.log3('grandson beforeMount');
        },
        mounted () {
            console.log3('grandson mounted');
        },
        beforeUpdate () {
            console.log3('grandson beforeUpdate');
        },
        updated () {
            console.log3('grandson updated');
        },
        methods: {},
        beforeDestroy () {
            console.log3('grandson beforeDestroy');
        },
        destroyed () {
            console.log3('grandson destroyed');
        },
    };
</script>

<style scoped>

</style>
