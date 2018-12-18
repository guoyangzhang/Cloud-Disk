// import store from './../../store'
// import $router from './../../router'

/**
 * 对http请求拦截
 * @returns {*}
 */
export default function httpInterceptor (result) {
    if (!result.success) {
        if (Number(result.code) === 120000) {
            // TODO 不中断
            // store.dispatch('setUser', null) // 清空前端session
            // $router.push({name: 'login'})

            return Promise.reject('未登录或登录超时，请重新登陆')
        } else {
            return Promise.reject(result.msg || '业务操作失败，系统未提供错误消息')
        }
    } else {
        return result
    }
}