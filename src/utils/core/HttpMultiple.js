/**
 文件：src/utils/core/HttpMultiple.js
 作者：沈旭东
 时间：2018-4-10
 描述：多请求队列处理
 */
import EventBus from './EventBus'
import backend from '../backend'
import httpInterceptor from './httpInterceptor'

const _getHttpWraper = Symbol.for('HttpMultiple#_getHttpWraper')
const _hasEmptyHttpWraper = Symbol.for('HttpMultiple#_hasEmptyHttpWraper')
const _doNext = Symbol.for('HttpMultiple#_doNext')
const httpWrapperList = Symbol.for('HttpMultiple#httpWrapperList')

/**
 * 上传动作包装器
 */
class HttpWrapper {
    constructor () {
        /**
         * 是否在使用中
         * @type {boolean}
         */
        this.isUser = false

        /**
         * 当前请求的对象
         */
        this.item = null
    }

    /**
     * 包装请求
     * @param item
     * @param isMessageError
     * @returns {*}
     */
    async request (item, isMessageError) {
        this.isUser = true
        this.item = item
        let result = await backend.request(item.api, item.data, item.options, isMessageError)
        if (isMessageError) {
            return result
        } else {
            return httpInterceptor(result)
        }
    }

    clear () {
        this.isUser = false
        this.item = null
    }
}

/**
 * 多文件上传（全局共用三个上传线程）
 * <pre>
 *  Event:
 *      end    ()  //全部完成
 *      oneEnd (result,item)  // 完成一个
 *      oneError (err,item)  // 错误一个
 * </pre>
 * @type {HttpMultiple}
 */
export default class HttpMultiple extends EventBus {

    constructor (isMessageError = false) {
        super()

        /**
         * 全局只创建三个对象
         * @type {Array}
         */
        this[httpWrapperList] = null
        if (!this[httpWrapperList]) {
            this[httpWrapperList] = [new HttpWrapper(), new HttpWrapper(), new HttpWrapper()]
        }

        /**
         * 等待队列
         * @type {Array}
         * @private
         */
        this._watiList = []

        /**
         * 是压栈的模式/堆模式
         * @type {boolean}
         */
        this.isStack = true
        this.isMessageError = isMessageError
    }

    /**
     * 清空上传任务
     */
    destroy () {
        this._watiList = null
    }

    /**
     * 清空数据执行新的请求
     */
    clear () {
        this._watiList = []
    }

    /**
     * 获取可用的包装器
     * @returns {*}
     * @private
     */
    [_getHttpWraper] () {
        if (this[httpWrapperList]) {
            for (let item of this[httpWrapperList]) {
                if (!item.isUser) {
                    return item
                }
            }
        }
        return null
    }

    /**
     * 是否全部空闲
     * @returns {*}
     * @private
     */
    [_hasEmptyHttpWraper] () {
        for (let item of this[httpWrapperList]) {
            if (item.isUser) {
                return false
            }
        }
        return true
    }

    /**
     * 多请求
     * @param api
     * @param data
     * @param options
     * @param key  关键字
     */
    reqMultiple ({api, data, options, key}) {
        if (!key) {
            throw new Error('必须添加关键字')
        }

        if (this.hasKey(key)) {
            console.warn('已有该关键字的请求', key)
            return
        }

        if (this._watiList) {
            this._watiList.push(arguments[0])
        }
        this[_doNext]()
    }

    /**
     * 是否有关键字内容
     * @param key
     * @returns {boolean}
     */
    hasKey (key) {
        let item
        if (key) {
            for (let i in this._watiList) {
                item = this._watiList[i]
                if (item.key === key) {
                    return true
                }
            }

            if (this[httpWrapperList]) {
                for (let i in this[httpWrapperList]) {
                    item = this[httpWrapperList][i].item
                    if (item && item.key === key) {
                        return true
                    }
                }
            }
        }
        return false
    }

    /**
     * 执行下一个任务
     * @private
     */
    [_doNext] () {
        if (this._watiList && this._watiList.length > 0) {
            /**
             * @type {HttpWrapper}
             */
            let httpWrapper = this[_getHttpWraper]()
            if (httpWrapper) {
                let item
                if (this.isStack) {
                    item = this._watiList.shift()
                } else {
                    item = this._watiList.pop()
                }

                if (item) {
                    httpWrapper.request(item, this.isMessageError).then((result) => {
                        httpWrapper.clear()
                        this.emit('oneEnd', result, item)
                        this[_doNext]()
                    }).catch((err) => {
                        // console.error('HttpMultiple', err)
                        httpWrapper.clear()
                        this.emit('oneError', err, item)
                        this[_doNext]()
                    })
                }
                this[_doNext]()
            }
        } else {
            if (this[_hasEmptyHttpWraper]()) {
                this.emit('end')
            }
        }
    }
};