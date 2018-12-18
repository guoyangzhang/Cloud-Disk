<!--
    文件：components/common/http-interceptor.vue
    作者：吴彬
    时间：2017-06-02
    描述：http拦截器组件
    调用方法：在app.vue引用即可
-->

<template>
	<!-- 这是http拦截器组件 -->
</template>

<script>
import backend from '@/utils/backend'
import { mapActions } from 'vuex'

export default {
    mounted () {
        this.initAxios()
    },
    methods: {
    	...mapActions({
    		setUser: 'global.setUser',
    		setLoading: 'global.setLoading'
    	}),
        initAxios () {
			let self = this
			backend.setAxiosHandler(axios => {
				// 添加响应拦截器
				axios.interceptors.response.use(response => {
					let result = response.data
					if (!result.success) {
						if (Number(result.code) === 120000) {
                            this.$message.error('未登录或登录超时，请重新登陆')
                            this.setUser(null) // 清空前端session
                            this.$router.push({ name: 'login' })
						} else {
							this.$message.error(result.msg || '业务操作失败，系统未提供错误消息')
						}
						this.setLoading(false)
						return Promise.reject(response)
					} else {
						return response
					}
				}, error => {
					this.setLoading(false)
                    let err = backend.convertError(error)
					this.$message.error(err.msg)
					return Promise.reject(error)
				})
			})
		}
    }
}
</script>