/**
 * 用户信息
 * @type {}
 */
module.exports = {
    user: {
        // 本应用单点登录
        isAccessAllowed: {
            // path: '/user/isAccessAllowed',
            // method: 'POST'

            // 平台门户模拟登陆
            path: '/user/isAccessAllowed',
            method: 'POST',
            server: 'wp'
        },
    }
}
