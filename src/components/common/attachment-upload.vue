<!--
    文件：components/common/file-upload.vue
    作者：吴彬
    时间：2017-5-31
    描述：文件上传
    调用方法：
    <attachment-upload
        :onSuccess="onAttachmentSuccess()"
    ></attachment-upload>
    onSucess：上传成功的回调，输出参数为附件数组
        methods: {
            onAttachmentSuccess (attachemnts) {
                console.log(attachments[0])
            }
        }
-->
<template>
<div v-loading="loading" element-loading-text="拼命上传中">
    <div class="form_ipt_col">
        <input type="text" disabled v-model="inputFileName"/>
        <input id="file-upload" type="file" class="input-file" @change="onFileChange($event)" :disabled="disabled"/>
    </div>
    <button type="button" class="butn butn_blue" v-on:click="onUploadBtnClick()" :disabled="disabled">上传文件</button>
    <a class="file-link" :href="remoteFiles[0].url" v-if="remoteFiles.length == 1 && remoteFiles[0].success" target="_blank">下载</a>
    <ul>
        <li v-for="item in remoteFiles" v-show="remoteFiles.length > 1">
            {{ item.fileName }} <a :href="item.url" v-show="item.success" target="_blank">下载</a>
        </li>
    </ul>
</div>
</template>

<script>
import $ from 'jquery'
import api from '@/conf/api'
import backend from '@/utils/backend'
import { StringUtils } from '@/utils/common'
import { basedata, codes } from '@/conf/basedata'

export default {
    props: {
        disabled: Boolean,
        files: Array,
        // 成功后的回调
        onSuccess: Function
    },
    data () {
        return {
            loading: false,
            inputFileName: null, // 显示的文件名
            remoteFiles: [] // 已经上传的文件列表
        }
    },
    watch: {
        // 当输入参数文件列表发生变化，则显示附件列表
        files (val) {
            this.remoteFiles = []
            if (!val || val.length < 1) {
                return
            }
            val.forEach(item => {
                let file = Object.assign({
                    success: true,
                    url: this.getUrl(item.groupName, item.fileName)
                }, item)
                this.remoteFiles.push(file)
            })
            let first = val[0]
            if (!StringUtils.isEmpty(first.originFileName)) {
                // 显示第一个附件的原始文件名
                this.inputFileName = first.originFileName
            } else {
                this.inputFileName = first.fileName
            }
        }
    },
    methods: {
        // private
        onFileChange (e) {
            let files = e.target.files || e.dataTransfer.files
            if (files.length < 1 || !files[0]) {
                return
            }
            let file = files[0]
            this.inputFileName = file.name

            // 创建一个上传文件项
            let uploadItem = {
                cid: new Date().getTime(),
                percent: 0,
                originFileName: file.name
            }
            let pos = file.name.lastIndexOf('.')
            if (pos !== -1) {
                uploadItem.ext = file.name.substr(pos + 1, file.name.length - 1)
            }

            if (this.remoteFiles.length > 0) {
                // TODO: 删除文件
                this.remoteFiles = []
            }
            // 将上传文件项保存
            this.remoteFiles.push(uploadItem)

            this.startUpload(file, uploadItem)
        },
        onUploadBtnClick () {
            $('#file-upload').trigger('click')
        },
        /**
         * 上传成功后的处理
         */
        uploadedHandle (uploadItem, result) {
            let uploaded = result.data[0]
            
            let fileItem = {
                success: true,
                groupName: uploaded.groupName,
                fileName: uploaded.fileName,
                url: this.getUrl(uploaded.groupName, uploaded.fileName)
            }
            Object.assign(uploadItem, fileItem)
            this.loading = false
            if (typeof this.onSuccess === 'function') {
                this.onSuccess(uploadItem)
            }
        },
        /**
         * 开始上传
         */
        startUpload (file, uploadItem) {
            let self = this
            this.loading = true
            if (window.location.host.indexOf('sitepointstatic') >= 0) {
                this.$message.erorr('非法操作')
                return
            }
            var xhr = new window.XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        let result = JSON.parse(this.responseText)
                        if (!result.success) {
                            self.$message.error(result.msg)
                            return
                        }
                        self.uploadedHandle(uploadItem, result)
                    }
                }
            }
            xhr.upload.addEventListener('progress', function (e) {
                uploadItem.percent = (e.loaded / e.total) * 100
            }, false)
            var url = backend.getUrl(api.attachment.upload)
            xhr.open('POST', url, true)
            
            var fd = new window.FormData()
            fd.append('fileExt', uploadItem.ext)
            fd.append('file', new window.Blob([file], {type: 'application/octet-stream'}))
            xhr.send(fd)
        },
        getUrl (groupName, fileName) {
            let httpServer = basedata.get(codes.FILE_HTTP_SERVER).name
            return httpServer + '/' + groupName + '/' + fileName
        }
    }
}
</script>