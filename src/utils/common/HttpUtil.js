/**
 * 获取请求、html页面相关工具函数
 */
export default {
    /**
     * 获取浏览器url参数键值对
     */
    getUrlParams () {
        return window.location.hash.replace(/.+\?/, '').split('&').reduce((prev, next) => {
            let list = next.split('=')
            prev[list[0]] = list[1]
            return prev
        }, {})
    }
}