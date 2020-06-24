<template>

    <div i="prelook_uploader">
        <div class="prelook-wrapper clearfix pb10" :id="container_id">
            <div class="prelook-inner" v-show="base_img_url">
                <span class="circle-box" @click="delImg">
                    <i class="circle"></i>
                </span>
                <a rel="group" class="fancybox prelook-block">
                    <img :src="base_img_url">
                </a>
            </div>
            <div class="form-groups" v-show="!base_img_url">
                <div class="col-10">
                    <div class="upload-wrapper" :id="pickfiles_id">
                        <div class="progress text-center" :id="progress_id"></div>
                        <i class="fa fa-plus f16"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style>

    [i="prelook_uploader"] .prelook-wrapper{
        padding-top: 10px;
        /* border-bottom: 1px dotted #ddd; */
    }
    [i="prelook_uploader"] .prelook-wrapper .upload-wrapper{
        float: left;
        position: relative;
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 120px;
        border: 1px solid #ddd;
        margin-bottom: 20px;
        cursor: pointer;
        overflow: hidden;
    }
    [i="prelook_uploader"] .prelook-wrapper .upload-wrapper i{
        line-height: 120px;
    }
    [i="prelook_uploader"] .prelook-wrapper .prelook-inner .circle-box{
        position: absolute;
        right: -10px;
        top: -10px;
        cursor: pointer;
        z-index: 1;
    }
    [i="prelook_uploader"] .prelook-wrapper .prelook-inner .circle{
        position: relative;
        display: inline-block;
        font-family:"Ionicons";
        font-style:normal;
        vertical-align: middle;
        line-height: 22px;
        text-align: center;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    [i="prelook_uploader"] .prelook-wrapper .prelook-inner .circle:after {
        display: inline-block;
        content: " ";
        background: #d80404;
        width: 22px;
        height: 22px;
        -moz-border-radius: 100%;
        -webkit-border-radius: 100%;
        border-radius: 100%;
    }
    [i="prelook_uploader"] .prelook-wrapper .prelook-inner .circle:before {
        position: absolute;
        display: inline-block;
        width: 22px;
        height: 22px;
        content: "\f404";
        font-size: 22px;
        line-height: 22px;
        color: #fff;
    }
    [i="prelook_uploader"] .prelook-wrapper .upload-wrapper .file-button{
        font-size: 200px;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        width: 120px;
        height: 120px;
        cursor: pointer;
        z-index: 9;
    }
    [i="prelook_uploader"] .prelook-inner {
        float: left;
        width: 120px;
        height: 160px;
        margin-right: 20px;
        margin-bottom: 10px;
        position: relative;
    }
    [i="prelook_uploader"] .prelook-inner i.fa-times-circle {
        font-size: 20px;
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 999;
        cursor: pointer;
    }
    [i="prelook_uploader"] .prelook-block {
        display: block;
        width: 120px;
        height: 120px;
        overflow: hidden;
        position: relative;
    }
    [i="prelook_uploader"] .prelook-block img {
        width: 100%;
    }
    [i="prelook_uploader"] .prelook-inner .prelook-radio {
        display: block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }
    [i="prelook_uploader"] .moxie-shim{
        display: none;
    }
    [i="prelook_uploader"] .progress{
        position: absolute;
        top: 0;
        background-color: #5cb85c;
        color: #000;
        font-size: 12px;
        line-height: 20px;

        background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        -webkit-background-size: 40px 40px;
        background-size: 40px 40px;

        -webkit-animation: progress-bar-stripes 2s linear infinite;
        -o-animation: progress-bar-stripes 2s linear infinite;
        animation: progress-bar-stripes 2s linear infinite;
    }

</style>
<script>
    import Upload from '@package/upload';

    export default{
        name: 'baseUpload',
        data(){
            return {
                container_id: 'container' + this.getRandomNum(1,10000000),
                pickfiles_id: 'pickfiles' + this.getRandomNum(1,10000000),
                progress_id: 'progress' + this.getRandomNum(1,10000000),
                base_img_url: ''
            }
        },
        components: {

        },
        props: ['parameter', 'success_data'],
        watch: {
            success_data: function (data,oldData) {
                var that = this;
                that.base_img_url = data.url;
            }
        },
        methods: {
            /* 生成随机数 */
            getRandomNum: function (s1,s2) {
                var Range = s2 - s1;
                var Rand = Math.random();
                return(s1 + Math.round(Rand * Range));
            },

            delImg: function () {
                var that = this;

                that.base_img_url = '';
                that.$delete(that.success_data,'origin_filename');
                that.$delete(that.success_data,'path');
                that.$delete(that.success_data,'upload_id');
                that.$delete(that.success_data,'url');
            }
        },
        mounted(){
            var that = this;

            var uploads = Upload({
                container: that.container_id,                  //容器ID
                browse_button: that.pickfiles_id,                 //按钮ID
                progress: that.progress_id,                    //进度条ID
                type: that.parameter.type,                               //请求接口时的传参，upload_type
                setting : that.parameter.setting,          //local：本地，cloud：云
                chunk_size : that.parameter.chunk_size,    //分段传输的大小
                group: that.parameter.group,               //上传格式组
                custom: that.parameter.custom,             //自定上传义格式
                url: that.parameter.url,                   //上传路径
                callback: function (res) {
                    // that.base_img_url = res.data.url;
                    that.$set(that.success_data,'origin_filename',res.data.origin_filename);
                    that.$set(that.success_data,'path',res.data.path);
                    that.$set(that.success_data,'upload_id',res.data.upload_id);
                    that.$set(that.success_data,'url',res.data.url);
                }
            });

        },
        destroyed(){

        }
    }
</script>
