/**
 文件：src/utils/core/EventBus.js
 作者：沈旭东
 时间：2018-4-10
 描述：事件调度对象
 */
export default class EventBus {
    /**
     * 注册监听
     * @param type
     * @param listener
     */
    static on (type, listener) {
        if (staticEventBus) {
            staticEventBus.on(type, listener)
        }
        return staticEventBus
    };

    /**
     * 移除监听
     * @param type
     * @param listener
     */
    static remove (type, listener) {
        if (staticEventBus) {
            staticEventBus.remove(type, listener)
        }
    };

    /**
     * 清除全部事件监听
     * @param type
     */
    static removeAll (type) {
        if (staticEventBus) {
            staticEventBus.removeAll(type)
        }
    };

    /**
     * 发送事件
     * @param type
     */
    static emit (type) {
        if (staticEventBus) {
            staticEventBus.emit(type)
            let len = arguments.length
            let args = new Array(len - 1)
            for (let i = 1; i < len; i++) {
                args[i - 1] = arguments[i]
            }
            staticEventBus.emit.apply(this, args)
        }
    };

    constructor () {
        this._eventtarget = {}
    }

    /**
     * 注册监听
     * @param type
     * @param listener
     */
    on (type, listener) {
        if (this._eventtarget) {
            let typeSet = this._eventtarget.typeSet
            if (!typeSet) {
                this._eventtarget.typeSet = typeSet = {}
            }

            let funList = typeSet[type]
            if (!funList) {
                typeSet[type] = funList = []
            }

            funList.push(listener)
        }
        return this
    };

    /**
     * 移除监听
     * @param type
     * @param listener
     */
    remove (type, listener) {
        if (this._eventtarget) {
            let typeSet = this._eventtarget.typeSet
            if (typeSet) {
                let funList = typeSet[type]
                if (funList) {
                    let index = funList.indexOf(listener)
                    if (index !== -1) {
                        funList.splice(index, 1)
                    }
                }
            }
        }
    };

    /**
     * 清除全部事件监听
     * @param type
     */
    removeAll (type) {
        if (this._eventtarget) {
            if (type) {
                let typeSet = this._eventtarget.typeSet
                if (typeSet) {
                    delete typeSet[type]
                }
            } else {
                this._eventtarget.typeSet = {}
            }
        }
    };

    /**
     * 发送事件
     * @param type
     */
    emit (type) {
        // console.log("发送事件：" + type + " " + arguments.length + " " + this.__proto__.constructor.name);
        if (this._eventtarget) {
            let typeSet = this._eventtarget.typeSet
            if (typeSet) {
                let funList = typeSet[type]
                if (funList) {
                    for (let listener of funList) {
                        let len = arguments.length
                        let args = new Array(len - 1)
                        for (let i = 1; i < len; i++) {
                            args[i - 1] = arguments[i]
                        }
                        listener.apply(this, args)
                    }
                }
            }
        }
    }
}

const staticEventBus = new EventBus()
