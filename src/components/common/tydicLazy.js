import Vue from 'vue';

/**
 * 延迟加载控件
 */
export default Vue.component('tydic-lazy', {
    template: `<span>
        <slot v-if="initSuccess"></slot>
    </span>`,

    name: 'tydic-lazy',
    props: {
        delay: {
            type: Number,
            default: 0,
        }
    },
    data () {
        return {
            initSuccess: false,
        };
    },
    created () {
        setTimeout(() => {
            this.initSuccess = true;
        }, this.delay);
    }
});