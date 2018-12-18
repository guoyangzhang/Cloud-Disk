import backend from '../../utils/backend';
import cacheProxy from '../../utils/pool/cacheProxy';
import $api from '../../conf/api/index';
import appHelper from '../../utils/common/appHelper';

/**
 * 网络请求数据代理
 * testBackendProxy
 */
export default {
    /**
     * 批量请求数据
     * @param reqData1
     * @param reqData2
     * @param reqData3
     * @returns {Promise<Array>}
     */
    async testBackEnd (reqData1, reqData2, reqData3) {
        // XXX 模拟时间长一点
        await appHelper.sleep(1000);

        const key = 'testBackEnd';
        let value = cacheProxy.get(key);
        if (!value) {
            try {
                let [res1, res2, res3] = await Promise.all([
                    backend.request($api.user.isAccessAllowed, reqData1),
                    backend.request($api.appDefault.queryConfig, reqData2),
                    backend.request($api.appDefault.testMock, reqData3),
                ]);

                cacheProxy.set(key, [res1, res2, res3]);
                value = [res1, res2, res3];
            } catch (err) {
                console.error(err);
                throw new Error('testBackendProxy.testBackEnd() 数据请求出错!');
            }
        }

        return value ? JSON.parse(JSON.stringify(value)) : [];
    },
    /**
     * 请求同样接口，返回其他格式数据
     * @param reqData1
     * @param reqData2
     * @param reqData3
     * @returns {Promise<*>}
     */
    async testBackEnd2 (reqData1, reqData2, reqData3) {
        let result = await this.testBackEnd(reqData1, reqData2, reqData3);

        // TODO 经过二次加工返回其他格式数据
        return result;
    },
};
