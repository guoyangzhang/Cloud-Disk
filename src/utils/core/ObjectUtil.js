/**
 * Created by shen on 2016/3/19.
 */
// 对象工具函数

/**
 * ObjectUtil
 */
export default {
    /**
     * 对象拷贝
     * @param obj
     */
    copyVo (obj) {
        // TODO 深拷贝
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 输出函数内容
     * @param hasFun
     */
    toStringFun (hasFun) {
        // XXX 修改内部this指针
        let str = '[' + this.constructor.name + '] ';
        for (let prototype in this) {
            if (this[prototype] instanceof Function) {
                if (hasFun) {
                    str += 'function:' + prototype + ' ';
                }
            } else {
                str += prototype + ':' + this[prototype] + ' ';
            }
        }
        return str;
    },

    /**
     * 对象属性拷贝
     * @param target 目标对象
     * @param source 数据源
     * @returns {*}
     */
    cloneFun (target, source) {
        // XXX 内部回调
        function _cloneFun (source, target) {
            if (!source) {
                return source;
            }

            if (!target) {
                if (source.constructor === Object) {
                    target = new source.constructor();
                } else if (Array.isArray(source)) {
                    target = [];
                } else {
                    target = new source.constructor(source.valueOf());
                }
            }

            for (let key in source) {
                if (target[key] !== source[key]) {
                    if (typeof (source[key]) === 'object') {
                        target[key] = _cloneFun(source[key], target[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            }

            return target;
        }

        // XXX 默认使用当前指针
        return _cloneFun(source || this, target);
    },

    /**
     * 判断是否继承自该类
     * @param obj
     * @param Clazz
     * @returns {boolean}
     */
    isSubClass (obj, Clazz) {
        if (obj) {
            if (Clazz === Object) {
                return true;
            }

            let temp = obj;
            try {
                while (true) {
                    if (temp.__proto__.constructor === Clazz) {
                        return true;
                    } else if (temp.__proto__.constructor === Object) {
                        return false;
                    } else {
                        temp = temp.__proto__;
                    }
                }
            } catch (err) {
                console.error('判断错误', err);
            }
        }
        return false;
    },

    /**
     * 是否有指定的的模式
     * @param examMode
     * @param ModeType
     * @returns {boolean}
     */
    hasMode (examMode, ModeType) {
        return (examMode & ModeType) === ModeType;
    },

    addMode (examMode, ModeType) {
        return examMode | ModeType;
    },

    removeMode (examMode, ModeType) {
        return examMode & ~ModeType;
    },
};