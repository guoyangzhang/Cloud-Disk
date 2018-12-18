/**
 * 开发环境配置
 */
module.exports = {
    // 配置跨域资源代理，静态资源（跨域请求图片等特殊场景，部署时需要在nginx中添加对应配置）
    // XXX （可选配置）
    // nginx: [
    //     // 定义一个server
    //     {
    //         location: '/group1',
    //         proxy_pass: 'http://10.37.61.64:8083' // 泰州
    //     }
    // ],

    // 代理 webSocket
    // XXX （可选配置）
    // webSocket: {
    //     wsName: '/appName/webSocket',   // 拦截的字段
    //     wsUrl: 'ws://10.37.39.91:18080'      // 和后台ip端口相同的 webSocket后台服务器地址
    // },

    // 前端开发环境，代理服务器配置，浏览器ip端口
    devProxy: {
        host: '0.0.0.0', // ip/localhost都可以访问
        // host: '127.0.0.1',
        // host: 'localhost',
        port: 3000
    },

    // 后端服务器
    endServers: {
        default: 'http://localhost:8080/appName', // 本地 打开本地  ``` node ./server/app.js ``` 启动
        wp: 'http://10.37.61.147:8003/wp/', // 平台门户登录模拟
        uc: 'http://10.37.61.147:8001/uc'   // UC模拟单点并获取用户信息
    }
};
