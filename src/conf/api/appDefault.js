/**
 * 当前应用测试相关接口
 * @type {}
 */
module.exports = {
    appDefault: {
        // 获取业务数据
        queryConfig: {
            path: '/sysCommon/queryConfig',
            method: 'POST'
        },

        // mock数据测试
        testMock: {
            path: '/test/testMock',
            method: 'POST'
        }
    }
};
