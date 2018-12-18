import { SessionUtils } from '@/utils/business'

let NS = 'global.'

export const state = {
	global: {
		user: null,
		loading: false, // 默认不加载进度条
		error: null
	}
}

export const getters = {
	[NS + 'user']: state => {
		state.global.user = SessionUtils.getLoginUser()
		return state.global.user
	},
	[NS + 'loading']: state => state.global.loading,
	[NS + 'error']: state => state.global.error
}

export const mutations = {
	[NS + 'user'] (state, user) {
		state.global.user = user
		SessionUtils.setLoginUser(user)
	},
	[NS + 'loading'] (state, loading) {
		state.global.loading = loading
	},
	[NS + 'error'] (state, error) {
		state.global.error = error
	}
}

export const actions = {
	[NS + 'setUser'] (context, user) {
		context.commit(NS + 'user', user)
	},
	[NS + 'setLoading'] (context, loading) {
		context.commit(NS + 'loading', loading)
	},
	[NS + 'setError'] (context, error) {
		context.commit(NS + 'error', error)
	}
}