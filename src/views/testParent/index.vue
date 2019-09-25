
<template>
    <div>
        <div>父组件:张三</div>
        <span ref="test">今年{{age}}岁了</span>

        <son :age="age"
             ref="son1"
             @eventName="onEventName($event)"></son>

        <!--测试延迟加载-->
        <!--<tydicLazy>-->
            <!--<son :age="age"-->
                 <!--ref="son1"-->
                 <!--@eventName="onEventName($event)"></son>-->
        <!--</tydicLazy>-->
    </div>
</template>

<script>
    import son from './son';
    import appHelper from '../../utils/common/appHelper';
    import tydicLazy from '../../components/common/tydicLazy.js';

    const logStyle = 'background:#333;color:#FFF;font-size:16px';
    console.log1 = function (msg, ...data) {
        console.log(`%c ${msg}`, logStyle, ...data);
    };

    export default {
        name: 'parentCom',
        components: {
            son,
            tydicLazy,
        },
        data () {
            console.log1(`parent data`, this.$refs.son);
            return {
                age: 50,
            };
        },
        beforeCreate () {
            console.log1('parent beforeCreate', this.$refs.son1);
        },
        created () {
            console.log1('parent created', this.$refs.son1);
        },
        beforeMount () {
            console.log1('parent beforeMount', this.$refs.son1);
        },
        async mounted () {
            console.log1('parent mounted', this.$refs.son1);

            await appHelper.sleep(2000);
            console.log('************************************ 更新年龄 **************************************** ');
            this.age = 52;

            await appHelper.sleep(2000);
            console.log('************************************ 销毁 **************************************** ');
            this.$destroy();

            console.log('%c ***************** 完成销毁 dom未删除 *****************', 'background:red;color:#FFF;font-size:20px');
        },
        beforeUpdate () {
            console.log1('parent beforeUpdate');
        },
        updated () {
            console.log1('parent updated');
        },
        methods: {
            onEventName (value, item) {
                // debugger
                // item.name = value
            }
        },
        beforeDestroy () {
            console.log1('parent beforeDestroy');
        },
        destroyed () {
            console.log1('parent destroyed');
        },
    };
</script>

<style scoped>

</style>
