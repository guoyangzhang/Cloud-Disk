import store from '../../store';
import api from '@/conf/api';
import backend from '@/utils/backend';
import session from './session';
import router from '../../router';

export default {
    logout () {
        store.dispatch('global.setUser', null);
        backend.request(api.user.logout);
    },
    isLogin (response, toUrl) {
        document.body.className = '';
        // 将用户信息保存到本地
        store.commit('global.user', response.data);
        let redirect = router.currentRoute.query.redirect;
        // 初始化用户权限
        this.initUserPrivData(response.data.moduleMap);
        session.setModuleMap(response.data.moduleMap);
        if (redirect) {
            redirect = decodeURIComponent(redirect);
            if (session.getPaths().indexOf(redirect) !== -1) {
                redirect = '/';
            }
        } else {
            redirect = toUrl;
        }
        router.push({path: redirect});
        // 判断是否已经初始化基础数据
        // if (basedata.isInited()) {
        // 	router.push({path: redirect})
        // } else {
        // 	// 初始化基础数据
        // 	 basedata.init().then(() => {
        // 		router.push({path: redirect})
        // 	})
        // }
    },
    initUserPrivData (moduleMap) {
        // 初始化 Menu
        let Menu = [];
        let privKeys = [];
        let paths = ['/', '*', '/error', '/login', '/403'];
        for (let temp of moduleMap[window.config.systemId]) {
            privKeys.push(temp.permiCode);
        }
        session.setPrivData(privKeys);
        session.setPaths(paths);
    }
};