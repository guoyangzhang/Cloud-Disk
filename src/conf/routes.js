/**
 * 路由配置项
 */
export default [
    {
        'path': '/',
        'component': 'home/index',
        'label': '首页',
    },
    {
        'path': 'login',
        'component': 'default/login'
    },
    {
        'path': 'layout',
        'component': 'layout/flexIndex',
        'label': '圣杯布局'
    },
    {
        'path': 'testBackend',
        'component': 'testBackend/index',
        'label': '网络通信测试'
    },
    {
        'path': 'testParent',
        'component': 'testParent/index',
        'label': '测试父子组件'
    },
    {
        'path': 'testChildren',
        'component': 'testChildren/index',
        'label': '测试子路由',
        'children': [
            {
                'path': 'vue2_1',
                'component': 'testChildren/vue2_1.vue',
            },
            {
                'path': 'testChildren/vue2_2',
                'component': 'testChildren/vue2_2.vue',
            },
            {
                'path': 'testChildren/vue2_3',
                'component': 'testChildren/vue2_3.vue',
            },
        ]
    },
    {
        'path': 'testCom',
        'component': 'testCom/index',
        'label': '测试组件渲染',
    },
    {
        'path': 'error',
        'component': 'default/error',
        'label': '通用错误页面'
    },
    {
        'path': '403',
        'component': 'default/403',
        'label': '没有权限访问当前页面'
    },
    {
        'path': 'noPermission',
        'component': 'default/noPermission',
        'label': '没有权限访问当前页面'
    },
    {
        'path': '*',
        'component': 'default/404',
        'label': '资源未找到',
        'comments': '这项配置一定要放到最后面'
    }
];
