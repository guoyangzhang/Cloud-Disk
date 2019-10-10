<template>
    <div id="global-uploader">
        <div>
            <a href="javascript:history.go(-1)">返回上一步</a>
            <uploader
                    ref="uploader"
                    :options="options"
                    :auto-start="false"
                    @files-submitted="filesSubmitted"
                    @file-success="onFileSuccess"
                    @file-progress="onFileProgress"
                    @file-error="onFileError"
                    class="uploader-app">
                <uploader-unsupport></uploader-unsupport>
                <uploader-btn id="global-uploader-btn" :directory="directory" ref="uploadBtn" title="点击选择文件">
                    上传
                </uploader-btn>
                <uploader-drop class="drop-file" ref="select_frame">
                    <div class="div1">

                        <p>目录: {{rootPath}}</p>
                        <template v-for="(f, i) in myDesktopData" :id="index">
                            <div class="div-inline" v-if="f.isFile">
                                <div class="img-container"><img src="./images/text-icon.png"/></div>
                                <div><p :title="f.name">{{f.name.length>10?f.name.substring(0,8):f.name}}</p></div>
                            </div>
                            <div class="div-inline" v-if="!f.isFile" @click="next(i,f)">
                                <div class="img-container"><img src="./images/folder-icon.png"/></div>
                                <div><i :title="f.name">{{f.name}}</i></div>
                            </div>
                        </template>
                    </div>
                </uploader-drop>

                <uploader-list v-show="panelShow">
                    <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                        <div class="file-title">
                            <h2>文件列表</h2>
                            <!--<div class="operate">-->
                            <!--<el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">-->
                            <!--<i class="iconfont" :class="collapse ? 'inuc-fullscreen': 'inuc-minus-round'"></i>-->
                            <!--</el-button>-->
                            <!--<el-button @click="close" type="text" title="关闭">-->
                            <!--<i class="iconfont icon-close"></i>-->
                            <!--</el-button>-->
                            <!--</div>-->
                        </div>
                        <!--<slot :files="files">-->
                        <!--<ul>-->
                        <!--<li v-for="file in props.files" :key="file.id">-->
                        <!--<uploader-file :file="file"></uploader-file>-->
                        <!--</li>-->
                        <!--<div class="no-file" v-if="!props.files"><i class="iconfont icon-empty-file"></i>-->
                        <!--暂无待上传文件-->
                        <!--</div>-->
                        <!--</ul>-->
                        <!--</slot>-->
                        <ul class="file-list">
                            <li v-for="file in props.fileList" :key="file.id">
                                <uploader-file :class="'file_' + file.id" ref="files" :file="file"
                                               :list="true"></uploader-file>
                            </li>
                            <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i>
                                暂无待上传文件
                            </div>
                        </ul>
                    </div>
                </uploader-list>
                <div v-show="isHidden" class="self-modal">
                    <uploader-files>
                        <div class="file-panel">
                            <ul>
                                <li v-for="file in files" :key="file.id">
                                    <uploader-file :file="file"></uploader-file>
                                </li>
                            </ul>
                        </div>
                    </uploader-files>
                </div>

            </uploader>
        </div>
    </div>

</template>

<script>
    /* eslint-disable no-undef */
    /**
     *   全局上传插件
     *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
     *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
     *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
     */

    import SparkMD5 from 'spark-md5';
    import '../../../public/static/zTree/js/jquery-1.4.4.min';

    export default {
        data() {
            return {
                options: {
                    autoStart: false,
                    target: '/api/service-B/fileUpload/upload', // 接口
                    singleFile: false, // 单文件上传。覆盖式，如果选择了多个会把之前的取消掉。默认 false。
                    chunkSize: 250 * 1024 * 1024, // 分块时按照该值来分。最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小，可见这个 Issue #51，默认 。 理论上支持100M,实际最后一个分片超过100无法录入
                    maxChunkRetries: 0, // 最大自动失败重试上传次数，值可以是任意正整数，如果是 undefined 则代表无限次，默认 0。
                    testChunks: true,   // 是否开启服务器分片校验
                    // 服务器分片校验函数，秒传及断点续传基础
                    checkChunkUploadedByResponse: function (chunk, message) {
                        let objMessage = JSON.parse(message);
                        if (objMessage.success) {
                            if (objMessage.data.skipUpload) {
                                return true;
                            }
                            return (objMessage.data.chunkList || []).indexOf(chunk.offset + 1) >= 0;
                        }
                    },
                    headers: {
                        Authorization: '',
                    },
                    query() {
                    },
                },
                panelShow: false,   // 选择文件后，展示上传文件列表
                collapse: false,
                directory: true,
                myDesktopData: [],
                fileList: {},  // 做全部文件处理
                checkMD5FileList: {}, // 确认md5是否全部校验完整
                rootPath: '',
                files: [],
                filesList: [],
                isHidden: false,
            };
        },
        mounted() {
            let self = this;
            this.$on('openUploader', query => {
                this.params = query || {};
                if (this.$refs.uploadBtn) {
                    $('#global-uploader-btn').click();
                }
            });
            self.getDesktopData();
        },

        computed: {
            // Uploader实例
            uploader() {
                return this.$refs.uploader.uploader;
            },
        },
        methods: {
            PushClick(index) {
                let self = this;
                self.isHidden = true;
                self.filesList.forEach(file => {
                    if (file.id === index) {
                        self.files = file.files;
                    }
                });
            },
            next(index, obj) {
                // this.myDesktopData = obj.childList;
                this.rootPath = obj.pathUrl;
                this.getDesktopData(obj.guid);
            },
            getDesktopData(parentId) {
                let self = this;
                $.ajax({
                    contentType: 'application/json',
                    dataType: 'json',
                    type: 'POST',
                    url: '/api/service-B/dragFile/selectDeskList',
                    data: JSON.stringify({ 'parentId': parentId }),
                    success: function (res) {
                        self.myDesktopData = res.data;
                        console.log(self.myDesktopData);
                    },
                });
            },

            onFileAdded(file, fileId) {
                let self = this;
                self.panelShow = true;
                self.computeMD5(file, fileId);

                self.$emit('fileAdded');
            },

            filesSubmitted(files, fileList) {
                let self = this;
                self.setFileList(files, fileList);
                self.filesList = fileList;
                fileList.forEach(
                    file => {
                        file.files.forEach(
                            file1 => {
                                self.onFileAdded(file1, file.id);
                            },
                        );
                    },
                );
            },

            setFileList(files, fileList) {
                let self = this;
                fileList.forEach(file => {
                    let obj = {};
                    file.files.forEach(file1 => {
                        obj[file1.id] = false;
                    });
                    self.checkMD5FileList[file.id] = obj;
                });
            },

            onFileProgress(rootFile, file, chunk) {
                // console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`);8

            },

            onFileSuccess(rootFile, file, response, chunk) {
                let self = this;
                let res = JSON.parse(response);
                // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
                if (!res.success) {
                    this.$message({ message: res.message, type: 'error' });
                    this.statusSet(rootFile.id, 'failed');
                    return;
                }
                // 如果服务端返回需要合并
                if (res.data.needMerge) {
                    // 文件状态设为“合并中”
                    this.statusSet(rootFile.id, 'merging');
                    this.mergeFile(file.uniqueIdentifier, file.relativePath, file.name, file);
                }
                self.fileList[file.id] = true;
                let flag = true;
                for (let [key, value] in self.fileList) {
                    if (!self.fileList[key]) {
                        flag = false;
                    }
                }
                if (flag) {
                    self.$emit('fileSuccess');
                    self.statusRemove(rootFile.id);
                    self.getDesktopData();
                }
            },

            onFileError(rootFile, file, response, chunk) {
                this.$message({
                    message: response,
                    type: 'error',
                });
            },

            mergeFile(md5, path, name, file) {
                let self = this;
                $.ajax({
                    contentType: 'application/json;',
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    url: '/api/service-B/fileUpload/mergeFile',
                    data: JSON.stringify({
                        'guid': md5,
                        'pathUrl': '/' + path,
                        'name': name,
                    }),
                    success: function (res) {
                        if (res.success) {

                        } else {
                            self.isloading = false;
                            self.statusSet(file.id, 'failed');
                            self.$alert('合并失败,请重新上传!', '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                    },
                });
            },

            /**
             * 计算md5，实现断点续传及秒传
             * @param file
             */
            computeMD5(file, fileId) {
                let self = this;
                let fileReader = new FileReader();
                let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                let currentChunk = 0;
                const chunkSize = 10 * 1024 * 1000;
                let chunks = Math.ceil(file.size / chunkSize);
                let spark = new SparkMD5.ArrayBuffer();
                // 文件状态设为"计算MD5"
                self.statusSet(fileId, 'md5');
                // file.pause();
                loadNext();
                fileReader.onload = e => {
                    spark.append(e.target.result);
                    if (currentChunk < chunks) {
                        currentChunk++;
                        loadNext();
                        // 实时展示MD5的计算进度
                        self.$nextTick(() => {
                            $(`.myStatus_${fileId}`).text(file.name + '  正在校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%');
                        });
                    } else {
                        let md5 = spark.end();
                        self.computeMD5Success(md5, file, fileId);
                    }
                };
                fileReader.onerror = function () {
                    this.error(`文件${file.name}读取出错，请检查该文件`);
                    file.cancel();
                };

                function loadNext() {
                    let start = currentChunk * chunkSize;
                    let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
                }
            },

            computeMD5Success(md5, file, fileId) {
                let self = this;
                document.getElementsByClassName('file_' + fileId)[0].addEventListener('click', function () {
                    self.PushClick(fileId);
                });
                // 将自定义参数直接加载uploader实例的opts上
                Object.assign(this.uploader.opts, {
                    query: {
                        ...this.params,
                    },
                });
                file.uniqueIdentifier = md5;
                file.identifier = md5;
                file.resume();
                self.checkMD5FileList[fileId][file.id] = true;
                let object = self.checkMD5FileList;
                let flag = true;
                Object.keys(object).forEach(key => {
                    Object.values(self.checkMD5FileList[key]).forEach(o => {
                        if (!o) {
                            flag = false;
                        }
                    })
                    if (flag) {
                        self.statusRemove(key);
                    }
                });
            },

            fileListShow() {
                let $list = $('#global-uploader .file-list');

                if ($list.is(':visible')) {
                    $list.slideUp();
                    this.collapse = true;
                } else {
                    $list.slideDown();
                    this.collapse = false;
                }
            },

            close() {
                this.uploader.cancel();
                this.panelShow = false;
            },

            /**
             * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
             * @param id
             * @param status
             */
            statusSet(id, status) {
                let statusMap = {
                    md5: {
                        text: '校验MD5',
                        bgc: '#fff',
                    },
                    md5Finish: {
                        text: 'MD5校验完成',
                        bgc: '#fff',
                    },
                    merging: {
                        text: '合并中',
                        bgc: '#e2eeff',
                    },
                    transcoding: {
                        text: '转码中',
                        bgc: '#e2eeff',
                    },
                    failed: {
                        text: '上传失败',
                        bgc: '#e2eeff',
                    },
                    mergingFailed: {
                        text: '合并失败',
                        bgc: '#e2eeff',
                    },
                };

                this.$nextTick(() => {
                    $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
                        'position': 'absolute',
                        'top': '0',
                        'left': '0',
                        'right': '0',
                        'bottom': '0',
                        'zIndex': '1',
                        'backgroundColor': statusMap[status].bgc,
                    }).text(statusMap[status].text);
                });
            },

            checkMD5(md5) {
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

            statusRemove(id) {
                this.$nextTick(() => {
                    $(`.myStatus_${id}`).remove();
                });
            },

            error(msg) {
                this.$notify({
                    title: '错误',
                    message: msg,
                    type: 'error',
                    duration: 2000,
                });
            },
        },

        watch: {},

        destroyed() {
            this.$off('openUploader');
        },

        components: {},
    };
</script>

<style lang="scss">
    .self-modal {
        z-index: 3000;
        flex: 1;
        text-align: right;
    }

    .container {
        width: 6.4%;
        height: 6%;
    }

    .div-inline {
        display: inline;
        width: 120px;
        float: left;
    }

    .div1 {
        flex: auto;

    }

    .uploader-drop {
        position: relative;
        padding: 200px !important;
        overflow: hidden;
        border: 1px dashed #ad4141;
        background-color: #f5f5f5;
    }

    .myLi {
        position: relative;
    }

    .isOnlineImage {
        position: absolute;
    }

    .myLis {
        line-height: 30px;
        color: #b4b4b4;
    }

    .pname {
        line-height: 15px;
    }
</style>