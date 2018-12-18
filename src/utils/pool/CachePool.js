/**
 * 缓存池集合
 */
let poolList = {}
const cachePoolData = Symbol.for('CachePool#data')

/**
 * 缓存池
 */
export default class CachePool {
    /**
     * 获取指定的缓存池
     * @param key
     * @returns {CachePool}
     */
    static getPool (key = 'default') {
        let tempPool = poolList[key]
        if (!tempPool) {
            tempPool = new CachePool()
        }
        return tempPool
    }

    static clearAll () {
        for (let cachePool of poolList) {
            cachePool.clear()
        }
        poolList = {}
    }

    /**
     * 缓存内容
     * @type {{}}
     */
    [cachePoolData] = {}

    add (key, value) {
        this[cachePoolData][key] = value
    }

    del (key) {
        delete this[cachePoolData][key]
    }

    get (key) {
        return this[cachePoolData][key]
    }

    /**
     * key 集合
     * @returns {Array}
     */
    getKeys () {
        let keys = []
        for (let key in this[cachePoolData]) {
            keys.push(key)
        }
        return keys
    }

    /**
     * value 集合
     * @returns {Array}
     */
    getValues () {
        let values = []
        for (let key in this[cachePoolData]) {
            values.push(this[cachePoolData][key])
        }
        return values
    }

    clear () {
        this[cachePoolData] = {}
    }

    has (key) {
        return !!this[cachePoolData][key]
    }
}