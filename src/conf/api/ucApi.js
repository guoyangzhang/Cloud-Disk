/**
 * UC相关服务接口
 * @type {}
 */
module.exports = {
    ucApi: {
        // UC单点登录
        ucssoLogin: {
            path: '/login/ucssoLogin',
            method: 'POST',
            server: 'uc'
        },
    }
};
