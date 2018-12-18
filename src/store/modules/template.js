const NS = 'template.'

export default {
    state: {
        data: '',

    },
    getters: {
        [NS + 'template']: state => state.data,

    },
    mutations: {
        [NS + 'template'] (state, data) {
            state.data = data
        },

    },
    actions: {
        [NS + 'template'] (context, data) {
            context.commit(NS + 'data', data)
        },
    }
}
