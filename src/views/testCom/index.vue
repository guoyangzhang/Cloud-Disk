<template>
    <div class="overall">
        <div class="img-container"><img src="../vue-simple-uploader/images/text-icon.png"/></div>
        <div><i>网</i></div>
        </div>

    </div>
</template>

<script>
    // 安装 npm install --save vue-slicksort
    import { SlickList, SlickItem } from 'vue-slicksort';

    export default {
        components: {
            SlickItem,
            SlickList,
        },
        data() {
            return {
                flag: true,
                items: [
                    {
                        name: 'Tab-1',
                        itemArr: ['1-1', '1-2', '1-3'],
                    },
                    {
                        name: 'Tab-2',
                        itemArr: ['2-1', '2-2', '2-3'],
                    },
                    {
                        name: 'Tab-3',
                        itemArr: ['3-1', '3-2', '3-3'],
                    },
                ],
            };
        },
        methods: {
            getChangeList(val) {
                console.log(val, '二级');
            },
            getChangeLists(vals) {
                //  拖拽完成后返回被打乱后的顺序
                console.log(vals, '一级');
            },
        },
    };
</script>
<style lang="scss" scoped>
    .list {
        width: 100%;
        max-height: 80vh;
        margin: 0 auto;
        padding: 0;
        overflow: auto;
        background-color: #f3f3f3;
    }

    .list-item {
        width: 100%;
        //   padding: 20px;
        background-color: #fff;
        box-sizing: border-box;
        color: #333;
        font-weight: 400;
        text-align: center;
        padding: 20px;
        box-shadow: 0 1px 2px #ccc;
    }

    .SortableList {
        display: flex;
        width: 600px;
        max-height: 90vh;
        margin: 0 auto;
        background-color: #dfdbdb;

    }

    .SortableItem {
        text-align: center;
        width: 100%;
        background-color: #fff;
        box-sizing: border-box;
        user-select: none; //不允许用户选中文字
        color: #333;
        font-weight: 400;
        position: relative;
        box-shadow: 0 1px 2px #ccc;
        .title {
            height: 50px;
            width: 100%;
            background: rgba(11, 145, 71, 0.658);
            color: white;
            font-weight: bold;
            line-height: 50px;
        }
    }
</style>