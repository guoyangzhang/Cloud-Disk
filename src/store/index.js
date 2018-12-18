import Vue from 'vue';
import Vuex from 'vuex';
import userProxy from './modules/userProxy';
import { actions, getters, mutations, state } from './global';

import template from './modules/template';

Vue.use(Vuex);

let store = new Vuex.Store({
    actions,
    state,
    getters,
    mutations,
    modules: {
        template,
        userProxy,
    }
});

export default store;
