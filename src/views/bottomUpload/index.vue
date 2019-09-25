<template>
    <div class="bottomUpload">
        <div style="margin-bottom: 20px;">
            <input type="text" readonly="readonly"/>
            <label>
                <input id="pop_file" type="file" readonly webkitdirectory @change="tirggerFile($event)" ref="clearFile" />
            </label>
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

</template>

<script>
    /* eslint-disable no-undef */
    import '../../../public/static/zTree/js/jquery-1.4.4.min';
    import '../../../public/static/zTree/js/jquery.ztree.all.min.js';
    import '../../../public/static/zTree/js/jquery.ztree.exhide.min.js';

    var $thelist = $('#thelist');
    var treeObj = $.fn.zTree.getZTreeObj('treeDemo');

    export default {
        name: 'bottomUpload',
        props: {
            // isButton: Boolean,
            // chunkNum: {
            //     type: String,
            //     default: '5',
            // },
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
        created() {
            let self = this;
            self.isButton = this.$route.query.isButton;
            self.chunkNum = this.$route.query.chunkNum;
        },
        methods: {
            tirggerFile(event) {
                let self = this;
                let fileList = event.target.files; // (利用console.log输出看file文件对象)
                debugger
                self.setList(fileList);
            },
            download(res) {
                window.location.href = '/api/service-B/file/download?pathUrl=' + res.pathUrl;
            },
            OnUpdate() {
                let self = this;
                self.isloading = true;
                var path = '';
                // 方案一:做适配文件大小小于两个分片不做分片,直接上传
                if (self.fileList.length > 0) {
                    for (var i = 0; i < self.fileList.length; i++) {
                        path = self.fileList[i].path;
                        var file = self.fileList[i].file;
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
                    url: 'http://localhost:7075/service-B/fileUpload/checkFileMd5',
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
                                self.$alert('上传失败!', '提示', {
                                    confirmButtonText: '确定',
                                });
                            }
                        } else {
                            self.isloading = false;
                            self.$alert('上传失败!', '提示', {
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
                xhr.open('post', 'http://localhost:7075/service-B/fileUpload/uploadNoChunk', true);
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
                        url: 'http://localhost:7075/service-B/fileUpload/mergeFile',
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
                                url: 'http://localhost:7075/service-B/dragFile/add',
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
                        url: 'http://localhost:7075/service-B/fileUpload/delList',
                        data: JSON.stringify(dataList),
                        success: function (res) {
                            self.exampleList = [];
                            self.fileList = [];
                            self.newCount = 0;
                            $thelist.empty();
                            $('#thelist').empty();// 删除dom子元素
                            self.isloading = false;
                            self.$refs.clearFile.value = '';
                            self.$alert('上传成功', '提示', {
                                confirmButtonText: '确定',
                            });
                        },
                    });
                });
            },

            setList(data) {
                let self = this;
                $thelist.empty();// 删除dom子元素
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var file = data[i];
                        debugger;
                        var md5 = file.webkitRelativePath.replace(/\//g, '_');// 处理进度条id
                        var buttonId = md5 + '_' + i;
                        let obj = {
                            file: file,
                            path: file.webkitRelativePath,
                            isDel: false,
                            isChunck: true,
                            buttonId: buttonId,
                            guid: md5,
                        };
                        self.fileList.push(obj);
                        $('#thelist').append('<div>' +
                            '<h4 class="info">' + file.name + '</h4>' +
                            '<progress id="' + md5 + '"max="' + file.size + '"value="0"></progress>' +
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
        },
    };

</script>

<style lang="scss">
    @import '../../../public/static/zTree/css/zTreeStyle/zTreeStyle.css';

    $dialog_width: 500px;
    $dialog_height: 400px;

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