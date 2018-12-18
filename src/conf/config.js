window.config = {
    // 版本号
    version: 'VERSION',

    servers: {
        // 必须和浏览器打开的ip端口相同
        default: 'http://localhost:3010/appName',
        wp: 'http://localhost:3010/wp/', // 平台门户登录模拟
        uc: 'http://localhost:3010/uc'   // UC模拟单点并获取用户信息
    },

    // webSocket 映射地址，必须和浏览器打开的ip端口相同
    wsUrl: 'ws://localhost:3010/appName/webSocket',

    systemId: 'APP008',

    // 登录错误，跳转到平台门户
    wpUrl: 'http://localhost:9090/'
}
