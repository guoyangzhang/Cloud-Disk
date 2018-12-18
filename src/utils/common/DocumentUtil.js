/**
 * dom相关操作
 */
export default {
    /**
     * 获取元素在浏览器位置
     */
    getReact (element) {
        let rect = element.getBoundingClientRect()
        let top = document.documentElement.clientTop
        let left = document.documentElement.clientLeft

        return {
            top: rect.top - top,
            right: rect.right - left,
            bottom: rect.bottom - top,
            left: rect.left - left,
            width: rect.width,
            height: rect.height,
        }
    },
    // ie9+ ,chrome
    get windowHeight () {
        return window.innerHeight
    },
    get windowWidth () {
        return window.innerWidth
    },
}