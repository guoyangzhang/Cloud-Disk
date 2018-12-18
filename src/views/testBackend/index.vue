<!--
    文件：src/views/testBackend/index.vue
    作者：沈旭东
    时间：2018-12-06
    描述：网络通信测试
-->
<template>
    <div v-loading="loading">网络通信测试</div>
</template>

<script>
    import appHelper from '../../utils/common/appHelper';
    import testBackendProxy from './testBackendProxy.js';
    import ObjectUtil from '../../utils/core/ObjectUtil';

    import { mapActions, mapGetters } from 'vuex';

    export default {
        data () {
            return {};
        },
        computed: {
            ...mapGetters({
                loading: 'global.loading',
                user: 'global.user',
            }),
        },
        async mounted () {
            await this.init();
            this.testBackEnd();
        },
        methods: {
            ...mapActions({
                setLoading: 'global.setLoading'
            }),
            /**
             * 初始化数据
             * @returns {Promise<void>}
             */
            async init () {
                await appHelper.sleep(1000);
            },
            /**
             * 网络通信测试
             * @returns {Promise<void>}
             */
            async testBackEnd () {
                this.setLoading(true);

                let reqData1 = {};
                let reqData2 = {};
                let reqData3 = {};

                try {
                    let [res1, res2, res3] = await testBackendProxy.testBackEnd(reqData1, reqData2, reqData3);
                    console.log('res1', res1);
                    console.log('res2', res2);
                    console.log('res3', res3);
                    this.$message.success('数据返回成功！');
                } catch (err) {
                    console.error(err);

                    if (ObjectUtil.isSubClass(err, Error)) {
                        this.$message.error(err.message);
                    } else {
                        this.$message.error('数据返回错误！');
                    }
                } finally {
                    this.setLoading(false);
                }
            },
        },
    };
</script>

<style lang="scss">
    .home {
    }
</style>
