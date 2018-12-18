<!--
    文件：src/views/testCom/componentGroup.vue
    作者：沈旭东
    时间：2018-12-07
    描述：Solt 组件
-->
<!--dialog 会话框蒙层，用于锁定内容层和导航层操作-->

<template>
    <div v-if="value" v-bind:style="lockStyle"
         style="position: fixed;top: 0;left: 0;width:100%;height: 100%;z-index:10;">
        <transition name="dialogBg">
            <div id="gray-bg" v-if="isShow" class="dialogMask" v-on:click="onMaskClose"></div>
        </transition>
        <transition name="dialogBox" v-on:after-leave="afterLeave">
            <div class="dialogBox" v-if="isShow" v-on:click="onMaskClose($event)">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script>

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            /**
             * 是否锁住弹窗，不进行鼠标交互事件
             */
            isLock: {
                type: Boolean,
                default: false
            },

            /**
             * 是否点击mask遮罩关闭弹窗
             */
            maskClose: {
                type: Boolean,
                default: true
            },

            /**
             * 是否动画打开
             */
            isTween: {
                type: Boolean,
                default: false
            },
            /**
             * 默认直接打开弹窗
             */
            defaultOpen: {
                type: Boolean,
                default: true
            },
            /**
             * 保持显示，不默认关闭
             */
            keepShow: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            lockStyle () {
                if (!this.isShow || this.isLock) {
                    return {
                        'pointer-events': 'none'
                    };
                } else {
                    return {};
                }
            }
        },
        data () {
            return {
                isShow: !this.isTween,
            };
        },
        mounted () {
            this.$nextTick(() => {
                if (this.defaultOpen) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            });
        },
        methods: {
            onMaskClose (event) {
                if (this.maskClose) {
                    if (event) {
                        if (event.target === event.currentTarget) {
                            this.onClose();
                        }
                    } else {
                        this.onClose();
                    }
                }
            },
            /**
             * 打开/关闭弹窗
             * @param value 是否打开
             */
            onOpenOrClose (value) {
                this.isShow = value;
            },
            onClose () {
                if (this.isTween) {
                    this.isShow = false;
                } else {
                    this.onDestroy();
                }
            },
            /**
             * 关闭弹窗，不带动画效果
             */
            onDestroy () {
                this.$emit('input', false);
                this.isShow = true;
                if (!this.keepShow) {
                    // 施放所有事件
                    if (this.$parent && this.$parent.$destroy) {
                        this.$parent.$destroy(true);
                    }

                    this.$destroy(true);

                    let view = this.$el;
                    view && view.parentNode && view.parentNode.removeChild(view);
                }
            },
            afterLeave (el) {
                this.onDestroy();
            },
        },
    };
</script>

<style lang="scss">
    #gray-bg {
        position: fixed;
        z-index: 20;
        background: #000;
        filter: alpha(Opacity=50);
        opacity: 0.5;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    //dialog 会话框蒙层
    .dialogMask {
        position: absolute;
        background: #000;
        filter: alpha(Opacity=50);
        opacity: 0.5;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    // 弹窗盒子显示
    .dialogBox {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        z-index: 100;
    }

    .dialogBox-enter-active, .dialogBox-leave-active {
        transition: all 0.3s ease;
    }

    .dialogBox-enter, .dialogBox-leave-active {
        opacity: 0;
        transform: translateY(-25%);
    }

    .dialogBg-enter-active, .dialogBg-leave-active {
        transition: opacity 0.15s;
    }

    .dialogBg-enter, .dialogBg-leave-active {
        opacity: 0;
    }

    //v-enter: 定义进入过渡的开始状态。在元素被插入时生效，在下一个帧移除。
    //v-enter-active: 定义进入过渡的结束状态。在元素被插入时生效，在 transition/animation 完成之后移除。
    //v-leave: 定义离开过渡的开始状态。在离开过渡被触发时生效，在下一个帧移除。
    //v-leave-active: 定义离开过渡的结束状态。在离开过渡被触发时生效，在 transition/animation 完成之后移除。

</style>