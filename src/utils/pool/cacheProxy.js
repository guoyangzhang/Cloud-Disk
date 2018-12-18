/**
 * 缓存数据管理，可以使用 内存/LocalStorage/SessionStorage/sql/等各种本地缓存技术
 */
export default {
    /**
     *
     * @param key
     * @param value
     */
    set (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get (key) {
        JSON.parse(localStorage.getItem(key));
    },
    del (key) {
        localStorage.removeItem(key);
    },
    clear () {
        localStorage.clear();
    }
};