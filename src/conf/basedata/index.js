import backend from '@/utils/backend'
import api from '@/conf/api'
import codes from './codes'

let isLoad = false;

const codeMap = new Map();
const typeMap = new Map();

/**
 * 初始化
 */
function init (data) {
    if (!data) {
        throw new Error('基础数据为空');
    }
    isLoad = true;
    data.forEach(item => {
        if (codeMap.has(item.code)) {
            throw new Error('字典表code重复!');
        }
        codeMap.set(item.code, item);
        if (!typeMap.has(item.type)) {
            typeMap.set(item.type, []);
        }
        typeMap.get(item.type).push(item);
    })
}

const basedata = {     
    /**
     * 根据Type获取
     */
    getByType (type) {
        if (typeMap.has(type)) {
            return typeMap.get(type);
        }
        return [];
    },
    /**
     * 根据Code获取
     */
    get (code) {
        if (codeMap.has(code)) {
            return codeMap.get(code);
        }
        return null;
    },
    /**
     * 请求后端数据
     */
    request () {
        return backend.request(api.basedata.getDataDict).then(result => {
            if (result.success) {
                init(result.data);
            } else {
                return Promise.reject(result);
            }
        }, error => {
            let err = backend.convertError(error);
            return Promise.reject(err);
        });
    },
    /**
     * 是否加载完成
     */
    isLoad () {
        return isLoad;
    }
};

module.exports = {
    basedata,
    codes
};