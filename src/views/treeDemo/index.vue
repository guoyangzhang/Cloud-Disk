<template>
    <div class="treeDemo">
        <div style="margin-bottom: 20px;">
            <label>
                <span style="left: 35px;bottom: 11px;color: #2a7afa;font-size: 14px;">文件夹名称</span>
                <input type="text" class="form-control" v-model="query_rootName"
                       style="width: 230px;height: 24px;"/>
            </label>
            <button @click="OnQueryTree()" class="button_new">
                查询
            </button>
        </div>
        <div style="float: right;">
            <div id="fileDragArea" ref="select_frame" style="width: 300px;height: 300px;" class="borWith">将文件拖到此处
            </div>
            <div class="filebox" id="thelist">
                <p v-if="fileList.length<1">暂无文件</p>
            </div>
            <div v-if="isButton && fileList.length > 0">
                <button type="button" class="button_new" @click="OnUpdate()" id="buttonId"
                        style="float: left; margin-right: 10px;">开始上传
                </button>
            </div>
        </div>
        <div class="left">
            <ul id="treeDemo" class="ztree"></ul>
        </div>
        <div class="left">
            <table class="biaoge" v-if="exampleList.length > 0">
                <tr>
                    <td>文件名称</td>
                </tr>
                <tr v-for="list in exampleList">
                    <td>
                        <input type="text" name="aa" value="list.name" style="width: 300px" class="inputText"
                               readonly="readonly" v-model="list.name" @click="download(list)"/>
                    </td>
                </tr>
            </table>
        </div>
        <div class='loading' v-if="isloading"><img style="vertical-align: middle;"
                                                   src="../../../public/static/loading.jpg"></div>
    </div>

</template>

<script>
    /* eslint-disable no-undef */
    import '../../../public/static/zTree/js/jquery-1.4.4.min';
    import '../../../public/static/zTree/js/jquery.ztree.all.min.js';
    import '../../../public/static/zTree/js/jquery.ztree.exhide.min.js';

    var $thelist = $('#thelist');
    var treeObj = $.fn.zTree.getZTreeObj('treeDemo');

    export default {
        name: 'treeDemoCom',
        props: {
            // isButton: Boolean,
            // chunkNum: {
            //     type: String,
            //     default: '5',
            // },
        },
        created() {
            let self = this;
            self.isButton = this.$route.query.isButton;
            self.chunkNum = this.$route.query.chunkNum;
        },
        data() {
            return {
                isButton: true,
                chunkNum: 5,
                fileList: [],
                query_rootName: '新建文件夹',
                exampleList: '',
                newCount: 0,
                treeList: '',
                isloading: false,
            };
        },
        methods: {
            download(res) {
                window.location.href = '/api/service-B/file/download?pathUrl=' + res.pathUrl;
            },
            // 取消选中节点
            init() {
                var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                if (treeObj) {
                    treeObj.cancelSelectedNode();
                }
            },
            OnUpdate() {
                let self = this;
                self.isloading = true;
                treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                var node = treeObj === null ? [] : treeObj.getSelectedNodes();
                var path = '';
                // 方案一:做适配文件大小小于两个分片不做分片,直接上传
                if (self.fileList.length > 0) {
                    for (var i = 0; i < self.fileList.length; i++) {
                        path = self.fileList[i].path;
                        var file = self.fileList[i].file;
                        if (node.length > 0) {
                            path = node[0].pathUrl + '/' + path;
                        }
                        if (file.size < self.chunkNum * 1024 * 1024 * 2) {  // 做个限制
                            self.uploadNoChunk(file, path, self.fileList[i].guid, i);
                        } else {
                            self.initFileSize(file, self.fileList[i].guid, path, i);
                        }
                    }
                }
            },
            // 初始化校验是否上传,并获取分片
            initFileSize(fileObj, md5, path, count) {
                let self = this;
                $.ajax({
                    contentType: 'application/json;',
                    dataType: 'json',
                    type: 'POST',
                    url: '/api/service-B/fileUpload/checkFileMd5',
                    data: JSON.stringify({ 'guid': md5 }),
                    success: function (res) {
                        var start = parseInt(res.data);
                        // 设置进度条
                        var progress = document.getElementById(md5);
                        progress.max = fileObj.size;
                        progress.value = start * self.chunkNum * 1024 * 1024;
                        var fileCount = Math.ceil(fileObj.size / (1024 * 1024 * self.chunkNum));
                        self.upload(start, fileObj, md5, path, count, fileCount);
                    },
                });
            },
            // 分片传参
            upload(start, fileObj, md5, path, count, fileCount) {
                let self = this;
                // 上传完成
                if (start >= fileCount) {
                    // 合并文件
                    this.mergeFile(md5, path, fileObj.name, start, fileObj.size, count, fileCount);
                } else {
                    var startSize = start * 1024 * 1024 * self.chunkNum;
                    var chunkNumSize = self.chunkNum * 1024 * 1024;
                    // 获取文件块的终止字节
                    let end = (startSize + chunkNumSize > fileObj.size) ? fileObj.size : (startSize + chunkNumSize);
                    // 将文件切块上传
                    let fd = new FormData();
                    fd.append('file', fileObj.slice(startSize, end));
                    fd.append('guid', md5);
                    fd.append('chunkSize', start);
                    fd.append('fileName', fileObj.name);
                    // POST表单数据
                    let xhr = new XMLHttpRequest();
                    xhr.open('post', 'http://localhost:7075/service-B/fileUpload/upload', true);
                    xhr.send(fd);
                    xhr.onload = function (res) {
                        if (this.readyState === 4 && this.status === 200) {
                            var obj = JSON.parse(xhr.responseText);
                            console.log(obj.success);
                            console.log(obj.data);
                            if (obj.success) {
                                // 上传一块完成后修改进度条信息，然后上传下一块
                                var progress = document.getElementById(md5);
                                progress.value = end;
                                // }, 1000)
                                self.upload(Math.ceil(end / chunkNumSize), fileObj, md5, path, count, fileCount);
                            } else {
                                self.isloading = false;
                                self.$alert('分片上传失败!', '提示', {
                                    confirmButtonText: '确定',
                                });
                            }
                        } else {
                            self.isloading = false;
                            self.$alert('分片上传失败!', '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                    };
                }
            },
            // 直传
            uploadNoChunk(fileObj, path, md5, count) {
                let self = this;
                // 将文件切块上传
                let fd = new FormData();
                fd.append('file', fileObj);
                fd.append('guid', md5);
                fd.append('filePath', path);
                fd.append('fileName', fileObj.name);
                // POST表单数据
                let xhr = new XMLHttpRequest();
                xhr.open('post', '/api/service-B/fileUpload/uploadNoChunk', true);
                xhr.send(fd);
                xhr.onload = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        var obj = JSON.parse(xhr.responseText);
                        if (obj.success) {
                            var progress = document.getElementById(md5);
                            progress.value = fileObj.size;
                            self.newCount++;
                        } else {
                            self.isloading = false;
                            self.$alert('分片上传失败!', '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                    }
                };
            },
            // 合并
            mergeFile: function (md5, path, name, start, size, count, fileCount) {
                let self = this;
                if (start >= fileCount) {
                    $.ajax({
                        contentType: 'application/json;',
                        dataType: 'json',
                        type: 'POST',
                        async: false,
                        url: '/api/service-B/fileUpload/mergeFile',
                        data: JSON.stringify({
                            'guid': md5,
                            'pathUrl': path,
                            'name': name,
                        }),
                        success: function (res) {
                            if (res.success) {
                                self.newCount++;
                            } else {
                                self.isloading = false;
                                self.$alert('合并失败,请重新上传!', '提示', {
                                    confirmButtonText: '确定',
                                });
                            }
                        },
                    });
                }
            },
            // 添加到库,并重新渲染tree
            addTree(resolve, reject) {
                let self = this;
                let obj;
                let objList = [];
                treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                var node = treeObj === null ? [] : treeObj.getSelectedNodes();
                if (node.length > 0) {
                    if (self.fileList.length > 0) {
                        for (var i = 0; i < self.fileList.length; i++) {
                            obj = {
                                'pathUrl': self.fileList[i].path,
                                'name': self.fileList[i].file.name,
                                'parentId': node[0].guid,
                                'isHidden': true,
                                'rootName': node[0].rootName,
                                'isFile': true,
                                'parentPathUrl': node[0].pathUrl,
                            };
                            objList.push(obj);
                        }
                        Promise.all(objList).then(function (data) {
                            $.ajax({
                                contentType: 'application/json;',
                                dataType: 'json',
                                type: 'POST',
                                async: false,
                                url: '/api/service-B/dragFile/add',
                                data: JSON.stringify(objList),
                                success: function (res) {
                                    self.OnQueryTree(node[0].rootName);
                                    resolve('数据请求成功');
                                },
                            });
                        });
                    }
                } else {
                    resolve('不需要执行渲染');
                }
            },
            // 清空分片的缓存文件
            delCacheFile(dataList) {
                let self = this;

                new Promise((resolve, reject) => {
                    self.addTree(resolve, reject);
                }).then(() => {
                    $.ajax({
                        contentType: 'application/json;',
                        dataType: 'json',
                        type: 'POST',
                        async: false,
                        url: '/api/service-B/fileUpload/delList',
                        data: JSON.stringify(dataList),
                        success: function (res) {
                            self.exampleList = [];
                            self.fileList = [];
                            self.newCount = 0;
                            $thelist.empty();
                            $('#thelist').empty();// 删除dom子元素
                            self.isloading = false;
                            self.$alert('上传成功', '提示', {
                                confirmButtonText: '确定',
                            });
                        },
                    });
                });
            },
            // 查询tree
            queryTree(zNodes) { // tree
                var setting = {
                    view: {
                        expandSpeed: '',
                        addHoverDom: this.addHoverDom, // 添加节点
                        removeHoverDom: this.removeHoverDom, // 移除节点
                        dblClickExpand: false,
                        showLine: true,
                        showIcon: true,
                        selectedMulti: true,
                    },
                    edit: {
                        drag: {
                            isCopy: false, // 所有操作都是move
                            isMove: false,
                            prev: true,
                            next: true,
                            inner: true,

                        },
                        showRemoveBtn: this.showRemoveBtn,
                        showRenameBtn: this.showRenameBtn,
                        enable: true,
                        editNameSelectAll: true,
                    },
                    data: {
                        key: {
                            name: 'name', // 设置树显示的字段与接口里的字段对应关系
                            tId: 'guid',
                            children: 'childList', // 子节点名称与接口字段对应关系，梯形数据结构需要
                        },
                        simpleData: {
                            enable: true, // 禁用简单的json数据结构，即用梯形结构
                            idKey: 'guid', // 设置id与接口字段对应关系（可以根据id找到当前节点）
                            pIdKey: 'parentCode', // 设置子pid与接口字段对应关系（可以根据pid找到父节点）
                            rootPId: '',
                        },
                    },
                    callback: {
                        onClick: this.zTreeOnCheck, // 点击节点时 回调
                        // beforeRemove: beforeRemove,
                        beforeRename: this.beforeEditName,
                    },
                };
                var zTree = $.fn.zTree.init($('#treeDemo'), setting, zNodes);// 初始化
                zTree.expandAll(true);
                // var nodes = zTree.transformTozTreeNodes();
                var nodes1 = zTree.getNodesByParam('isHidden', true);
                // zTree.removeNode(nodes1);
                zTree.hideNodes(nodes1);
            },
            // 是否显示删除图标
            showRemoveBtn(treeId, treeNode) {
                if (treeNode.parentId === '-1') {
                    return false;
                } else {
                    return true;
                }
            },
            // 是否显示修改图标
            showRenameBtn(treeId, treeNode) {
                if (treeNode.childList.length > 0) {
                    return false;
                } else {
                    return true;
                }
            },

            OnQueryTree(res) {
                let self = this;
                var str = '';
                if (self.query_rootName) {
                    str = self.query_rootName;
                } else {
                    str = res;
                }
                if (!str) {
                    return;
                }
                this.exampleList = [];
                this.axios({
                    method: 'post',
                    url: '/api/service-B/dragFile/selectList',
                    data: {
                        'rootName': str,
                    },
                }).then(function (response) {
                    if (response.data.success) {
                        self.fileList = [];
                        this.queryTree(response.data.data);
                    }
                }.bind(this)).catch(function (error) {
                    console.log(error);
                });
            },

            removeHoverDom(treeId, treeNode) {
                $('#addBtn_' + treeNode.tId).unbind().remove();
            },

            addHoverDom(treeId, treeNode) {
                let self = this;
                var sObj = $('#' + treeNode.tId + '_span');
                if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) return;
                var addStr = '<span class=\'button add\' id=\'addBtn_' + treeNode.tId +
                    '\' title=\'add node\' onfocus=\'this.blur();\'></span>';
                sObj.after(addStr);
                var btn = $('#addBtn_' + treeNode.tId);
                if (btn) {
                    btn.bind('click', function () {
                        let newName = 'new node' + (treeNode.childList.length + 1);
                        new Promise((resolve, reject) => {
                            // self.addNode(treeNode.id, 'new node' + (treeNode.childList.length + 1), resolve, reject);
                            self.addNode(treeNode.guid, newName, treeNode.rootName, treeNode.pathUrl + '/' + newName, resolve, reject);
                        }).then(res => {
                            treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                            treeObj.addNodes(treeNode, {
                                id: res,
                                pId: treeNode.id,
                                isParent: true,
                                name: newName,
                            });
                            return false;
                        });
                    });
                }
            },

            addNode(parentId, name, rootName, pathUrl, resolve, reject) {
                $.ajax({
                    contentType: 'application/json;',
                    dataType: 'json',
                    type: 'POST',
                    url: '/api/service-B/dragFile/addNode',
                    data: JSON.stringify({
                        parentId: parentId,
                        name: name,
                        rootName: rootName,
                        pathUrl: pathUrl,
                        isHidden: false,
                        isFile: false,
                    }),
                    success: function (res) {
                        if (res.success) {
                            resolve(res.data);
                        } else {
                            reject(res.data);
                        }
                    },
                });
            },

            zTreeOnCheck() {
                treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                var node = treeObj.getSelectedNodes();// 点击节点后 获取节点数据
                if (node[0].childList === []) {
                    this.exampleList = [];
                    // });
                } else {
                    this.exampleList = [];
                    for (var i = 0; i < node[0].childList.length; i++) {
                        if (node[0].childList[i].childList.length === 0 && node[0].childList[i].isHidden) {
                            this.exampleList.push(node[0].childList[i]);
                        }
                    }
                }
            },

            // 修改节点名称
            beforeEditName(treeId, treeNode, newName) {
                let self = this;
                // 根据当前节点查询上级节点,获取子级所有节点,根据节点名称查询当前修改的节点是否存在相同或为空
                var zTree = $.fn.zTree.getZTreeObj('treeDemo');
                var node = zTree.getNodeByParam('guid', treeNode.parentId);
                let cache = [];

                if (!newName) {
                    var zTree1 = $.fn.zTree.getZTreeObj('treeDemo');
                    zTree1.cancelEditName();
                    self.$alert('节点名称不能为空', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                }
                if (newName.length === 0) {
                    zTree.cancelEditName();
                    self.$alert('节点名称不能为空', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                }
                if (treeNode.name === newName) {
                    return;
                }
                if (node.childList.length > 0) {
                    for (let i = 0; i < node.childList.length; i++) {
                        cache.push(node.childList[i].name);
                    }
                    if (cache.includes(newName)) {
                        setTimeout(function () {
                            zTree.cancelEditName();
                            self.$alert('节点名称重复', '提示', {
                                confirmButtonText: '确定',
                            });
                        }, 0);
                        return false;
                    }
                }

                if (treeNode.name === newName) {
                    return;
                }
                self.updateTree(treeNode.guid, newName, cache);
                return true;
            },

            updateTree(treeId, newName) {
                let self = this;
                treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                var node = treeObj == null ? [] : treeObj.getSelectedNodes();// 点击节点后 获取节点数据
                $.ajax({
                    contentType: 'application/json;',
                    dataType: 'json',
                    type: 'POST',
                    url: '/api/service-B/dragFile/updateTree',
                    data: JSON.stringify({
                        guid: treeId,
                        name: newName,
                    }),
                    success: function () {
                        $thelist.empty();
                        self.OnQueryTree(node[0].rootName);
                    },
                });
            },

            setList() {
                let self = this;
                $thelist.empty();// 删除dom子元素
                if (self.fileList.length > 0) {
                    for (var i = 0; i < self.fileList.length; i++) {
                        var file = self.fileList[i].file;
                        var md5 = self.fileList[i].path.replace(/\//g, '_');// 处理进度条id
                        var buttonId = md5 + '_' + i;
                        self.fileList[i].buttonId = buttonId;
                        self.fileList[i].guid = md5;
                        $('#thelist').append('<div>' +
                            '<h4 class="info">' + file.name + '</h4>' +
                            '<progress id="' + md5 + '"max="' + file.size + '"value="0"></progress>' +
                            // '<button  id="' + buttonId + '"  item = "' + i + '"  type="button" class="OnSetChunk" style="float: right; margin-left: 100px " >分片</button>' +
                            '</div>');
                    }
                }
            },
        },
        watch: {
            'newCount': function (value) {
                let self = this;
                if (value > 0) {
                    if (value === self.fileList.length) {
                        self.delCacheFile(self.fileList);
                    }
                }
            },
        },
        components: {},
        mounted() {
            let self = this;
            // -------------------------------------拖拽上传文件夹
            this.fileList = [];
            var dateList = [];// 文件夹包含文件
            var aaList = [];// 文件流+文件路径+文件参数(单纯的是文件,不包含文件夹)
            this.$refs.select_frame.ondragleave = (e) => {
                e.preventDefault();  // 阻止离开时的浏览器默认行为
            };
            this.$refs.select_frame.ondrop = (e) => {
                e.preventDefault();    // 阻止拖放后的浏览器默认行为
                const data = e.dataTransfer.files;  // 获取文件对象
                if (data.length < 1) {
                    return;  // 检测是否有文件拖拽到页面
                }
                const items = e.dataTransfer.items;
                aaList = [];
                $('#thelist').empty();
                self.exampleList = [];
                dateList = [];
                // for (let i = 0; i < items.length; i++) {
                //     var item = items[i].webkitGetAsEntry();
                //     if (item) {
                //         // 判断是否为文件夹
                //         if (item.isDirectory) {
                //             traverseFileTree(item);
                //         } else {
                //             self.$alert('只支持上传文件夹', '提示', {
                //                 confirmButtonText: '确定',
                //             });
                //             return;
                //         }
                //     }
                //
                //     if (i + 1 === items.length) {
                //         treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                //         var node = treeObj == null ? [] : treeObj.getSelectedNodes();// 点击节点后 获取节点数据
                //         setTimeout(function () {
                //             if (node.length > 0) {
                //                 self.fileList = aaList;
                //                 dateList = [];
                //                 self.setList();
                //                 // 根据外部组件参数,判断是否需要直接上传数据
                //                 if (!self.isButton) {
                //                     self.OnUpdate();
                //                 }
                //             } else {
                //                 $.ajax({
                //                     contentType: 'application/json;charset-UTF-8',
                //                     dataType: 'json',
                //                     type: 'POST',
                //                     url: 'http://localhost:7075/service-B/dragFile/dragTree',
                //                     data: JSON.stringify(dateList),
                //                     success: function (res) {
                //                         self.fileList = aaList;
                //                         dateList = [];
                //                         self.queryTree(res.data.demoList);
                //                         self.setList();
                //                         // 根据外部组件参数,判断是否需要直接上传数据
                //                         if (!self.isButton) {
                //                             self.OnUpdate();
                //                         }
                //                     },
                //                 });
                //             }
                //         }, 1000);
                //     }
                // }

                new Promise(function (resolve) {
                    resolve();
                }).then(() => {
                    for (let i = 0; i < items.length; i++) {
                        var item = items[i].webkitGetAsEntry();
                        if (item) {
                            // 判断是否为文件夹
                            if (item.isDirectory) {
                                traverseFileTree(item);
                            } else {
                                treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                                var node = treeObj === null ? [] : treeObj.getSelectedNodes();
                                if (node.length === 0) {
                                    self.$alert('只支持上传文件夹', '提示', {
                                        confirmButtonText: '确定',
                                    });
                                } else {
                                    let obj = {
                                        file: data[i],
                                        path: data[i].name,
                                        isDel: false,
                                        isChunck: true,
                                    };
                                    aaList.push(obj);
                                }
                            }
                        }
                    }
                }).then(() => {
                    treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                    var node = treeObj == null ? [] : treeObj.getSelectedNodes();// 点击节点后 获取节点数据
                    setTimeout(function () {
                        if (node.length > 0) {
                            self.fileList = aaList;
                            dateList = [];
                            self.setList();
                            // 根据外部组件参数,判断是否需要直接上传数据
                            if (!self.isButton) {
                                self.OnUpdate();
                            }
                        } else {
                            $.ajax({
                                contentType: 'application/json',
                                dataType: 'json',
                                type: 'POST',
                                url: '/api/service-B/dragFile/dragTree',
                                data: JSON.stringify(dateList),
                                success: function (res) {
                                    self.fileList = aaList;
                                    dateList = [];
                                    self.queryTree(res.data.demoList);
                                    self.setList();
                                    // 根据外部组件参数,判断是否需要直接上传数据
                                    if (!self.isButton) {
                                        self.OnUpdate();
                                    }
                                },
                            });
                        }
                    }, 1000);
                });
            };
            this.$refs.select_frame.ondragenter = (e) => {
                e.preventDefault();  // 阻止拖入时的浏览器默认行为
                this.$refs.select_frame.border = '2px dashed red';
            };
            this.$refs.select_frame.ondragover = (e) => {
                e.preventDefault();    // 阻止拖来拖去的浏览器默认行为
            };

            // 判断是否文件,文件夹
            function traverseFileTree(item, path) {
                path = path || '';
                if (item.isFile) {
                    // Get file
                    item.file((file) => {
                        let obj = {
                            file: file,
                            path: path + file.name,
                            // attr: item.attr,
                            isDel: false,
                            isChunck: true,
                        };
                        aaList.push(obj);
                    });
                } else if (item.isDirectory) {
                    var dirReader = item.createReader();
                    readDir(dirReader, item, path);
                }
            };

            // 获取文件夹中的数据
            function readDir(dirReader, item, path) {
                dirReader.readEntries((entries) => {
                    if (entries.length) {
                        for (let i = 0; i < entries.length; i++) {
                            let obj = {
                                name: entries[i].name,
                                pathUrl: entries[i].fullPath,
                                isFile: entries[i].isFile,
                                guid: null,
                                isChunck: true,
                                buttonId: null,
                            };
                            dateList.push(obj);
                            traverseFileTree(entries[i], path + item.name + '/');
                        }
                        // entries长度不为0，继续调用解析，直至长度为0。因为chrome浏览器只支持一次解析100个
                        readDir(dirReader, item, path);
                    }
                }, function (e) {
                    console.log(e);
                });
            };
        }
        ,
    }
    ;

</script>

<style lang="scss">
    @import '../../../public/static/zTree/css/zTreeStyle/zTreeStyle.css';

    $dialog_width: 500px;
    $dialog_height: 400px;
    .inputText {
        border: solid 1px #000;
    }

    .inputText:hover {
        background: #1E9EFF;
    }

    .inputText:focus {
        border: solid 1px #ccc;
    }

    .loading {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2f332a;
        opacity: 0.7;
    }

    .left {
        width: 30%;
        float: left;
        /*height: 700px;*/
        /*overflow-y: auto;*/
    }

    .biaoge {
        width: 250px;
    }

    .borWith {
        border: 1px dashed #F00;
        width: 300px;
        height: 60px;
        margin-top: 10px
    }

    .testCom {
        .title {
            background-color: #eee;
        }

        .dialogPage {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -$dialog_width/2;
            margin-top: -$dialog_height/2;
        }

        .page {
            background-color: #fff;
            width: $dialog_width;
            height: $dialog_height;
        }
        .control-label {
            margin: 0px 15px;
        }
    }
</style>