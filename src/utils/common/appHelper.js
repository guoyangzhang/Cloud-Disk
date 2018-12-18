export default {
    /**
     * 延迟执行
     * @param time (0-60000)
     * @returns {Promise<any>}
     */
    sleep (time = 1000) {
        time = Math.min(60000, time);
        time = Math.max(0, time);
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, time);
        });
    }
};