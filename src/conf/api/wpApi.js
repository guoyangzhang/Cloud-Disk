/**
 * wp 相关服务接口
 * @type {}
 */
module.exports = {
    wpApi: {
        // 登录平台门户用户密码登录接口
        login: {
            path: '/wplogin/login',
            method: 'POST',
            server: 'wp'
        },
    }
};
