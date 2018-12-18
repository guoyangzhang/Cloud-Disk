import store from '../store';
import { basedata } from '@/conf/basedata';
import session from '@/utils/business/session';
import api from '@/conf/api';
import backend from '@/utils/backend';
import { Message } from 'element-ui';

// 单点登录，dev:login prod:noPermission
let errorTo = process.env.NODE_ENV === 'development' ? 'login' : 'noPermission';
// let errorTo = 'noPermission'
// const isAccessAllowed = true; // 是否进行单点登录验证
const isAccessAllowed = false; // 是否进行单点登录验证

export default function (router) {
    router.beforeEach((to, from, next) => {
        try {
            beforeRouteEnter(to, from, next);
        } catch (e) {
            console.error(e);
        }
    });
}

// 是否已经加载
let isLoad = true;

// 过滤的路由name
let filters = ['login', 'error', '500', '400', 'noPermission'];

// 过滤的路由map
let filterMap = new Map();
filters.forEach(item => {
    filterMap.set(item, true);
});

/**
 * 跳转到平台门户
 */
function onErrorToLogin () {
    // window.open(window.config.wp, '_self')

    // 跳转平台门户
    if (window.config.wpUrl && window.config.wpUrl !== '') {
        window.location.href = window.config.wpUrl;
    } else {
        Message.warning('平台门户地址未配置');
    }
}

/**
 * 路由跳转之前
 */
function beforeRouteEnter (to, from, next) {
    document.body.scrollTop = 0;
    // 适应第三方应用跳转到某个路由
    if (!isLoad) {
        isLoad = true;
        if (typeof (to.query.redirect) !== 'undefined') {
            let redirect = decodeURIComponent(to.query.redirect);
            next(redirect);
            return;
        }
    }

    // 后台用户信息错误，前端拦截器等会自动跳转到登录页面/平台门户
    if (process.env.NODE_ENV !== 'development' && to.name === 'login') {
        onErrorToLogin();
        return;
    }

    // 某些过滤的请求，包括login,error等
    if (isFilter(to.name)) {
        next();
        return;
    }

    // 是否需要进行单点登录验证，（情报墙类似应用不需要登录验证）
    if (isAccessAllowed) {
        getAccount(to, next).then((response) => {
            if (!response.user) {
                if (process.env.NODE_ENV === 'development') {
                    redirect(errorTo, next, to);
                } else {
                    onErrorToLogin();
                }
            } else {
                doNext(next, to);
            }
        });
    } else {
        doNext(next, to);
    }
}

/**
 * 执行跳转
 * @param {*} next
 */
function doNext (next, to) {
    // 如果跳转到admin做权限控制
    if (/^\/admin/.test(to.path)) {
        let loginUser = getLoginUser();
        if (loginUser.yhid !== 'admin') {
            redirect('403', next, to);
            return;
        }
    }
    next();
}

/**
 * 跳转到某个页面
 */
function redirect (name, next, to) {
    if (typeof (to.query.redirect) === 'undefined') {
        to.query.redirect = encodeURIComponent(to.path);
    }
    next({name: name, query: to.query});
}

/**
 * 设置loading
 */
function setLoading (flag) {
    store.dispatch('global.setLoading', flag);
}

/**
 * 获取登陆用户
 */
function getLoginUser () {
    return store.getters['global.user'];
}

/*
 * 单点登录
 * */
function getAccount (to, next) {
    return new Promise(async (resolve, reject) => {
        var queryMaps = window.location.hash.replace(/.+\?/, '').split('&').reduce((prev, next) => {
            let list = next.split('=');
            prev[list[0]] = list[1];
            return prev;
        }, {});
        // 单点登录
        if (queryMaps.TICKET && !getLoginUser()) {
            backend.request(api.user.isAccessAllowed, queryMaps)
                .then((result) => {
                    if (result.data && result.data.moduleMap[window.config.systemId] && result.data.moduleMap[window.config.systemId].length > 0) {
                        store.dispatch('global.setUser', result.data);
                        initUserPrivData(result.data.moduleMap);
                        session.setModuleMap(result.data.moduleMap);
                        resolve({user: result.data, SSO: true});
                    } else if (result.code === '808010') {
                        next({name: 'noPermission', query: ''});
                    } else {
                        resolve({user: null, SSO: false});
                    }
                });

            // // XXX 减少控制层代码，尽量封装在页面模型中（包装在actions中处理掉）
            // let result = await store.dispatch('userProxy.isAccessAllowed', {TICKET: queryMaps.TICKET});
            //
            // if (result.data && result.data.moduleMap[window.config.systemId] && result.data.moduleMap[window.config.systemId].length > 0) {
            //     store.dispatch('global.setUser', result.data);
            //     initUserPrivData(result.data.moduleMap);
            //     session.setModuleMap(result.data.moduleMap);
            //     resolve({user: result.data, SSO: true});
            // } else if (result.code === '808010') {
            //     next({name: 'noPermission', query: ''});
            // } else {
            //     resolve({user: null, SSO: false});
            // }
        } else {
            resolve({user: getLoginUser(), SSO: false});
        }
    });
}

/**
 * 权限初始化
 */
function initUserPrivData (moduleMap, systemId) {
    // 初始化 Menu
    let Menu = [];
    let privKeys = [];
    let paths = ['/', '*', '/error', '/login', '/403'];
    // 平台联网的系统id是否存在
    if (systemId) {
        window.config.systemId = systemId;
    }
    for (let temp of moduleMap[window.config.systemId]) {
        privKeys.push(temp.permiCode);
    }
    session.setPrivData(privKeys);
    session.setPaths(paths);
}

/**
 * 是否在过滤范围内
 */
function isFilter (name) {
    return filterMap.get(name);
}

/**
 * 加载基础数据
 */
function loadBaseData (next, to) {
    setLoading(true);
    // 请求基础数据
    basedata.request().then(result => {
        setLoading(false);
        doNext(next, to);
    }, error => {
        setLoading(false);
        if (error.code && Number(error.code) === -1) {
            redirect(errorTo, next, to);
        } else {
            if (error.stack) {
                error.msg = error.message;
            }
            if (error.code === 120000) {
                redirect(errorTo, next, to);
            } else if (error.code === 808010) {
                redirect('noPermission', next, to);
            } else {
                store.dispatch('global.setError', error);
                redirect('error', next, to);
            }
        }
    });
}
