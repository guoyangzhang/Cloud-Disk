// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import '@babel/polyfill'
import Vue from 'vue';
import backend from '@/utils/backend';
import utils from '@/utils/common/index';
import router from './router';
import api from '@/conf/api/index';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'; //在 APP.vue中加入主题
// 加载其他第三方库
import App from './App';
import store from './store';
import '@/filters/index';
import codes from './conf/basedata/codes';
// 树组件
// import TydicGaUI from 'tydic-ga-ui';
// import 'tydic-ga-ui/css/tydic-ga-ui.css';
// import laydate from '../lib/laydate/laydate.js';
// XXX 发布时自动排除引用
import '@/conf/config';

Vue.use(ElementUI);
// Vue.use(TydicGaUI);

Vue.config.productionTip = false;
// 挂载全局常量，可在vue中直接使用
Object.defineProperty(Vue.prototype, 'codes', {
    get() {
        return codes;
    }
});

// Object.defineProperty(Vue.prototype, '$laydate', {
//     get () {
//         return laydate;
//     }
// });
Object.defineProperty(Vue.prototype, '$api', {
    get() {
        return api;
    }
});

Object.defineProperty(Vue.prototype, '$backend', {
    get() {
        return backend;
    }
});

Object.defineProperty(Vue.prototype, '$utils', {
    get() {
        return utils;
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});