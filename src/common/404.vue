<template>
    <div i="not_found_wrap">
        <div class="not-container-box">
            <div class="not-container">
                <img src="~images/404.jpg">
                <div class="not-container-text">
                    <div>抱歉，页面被外星人劫走了~~</div>
                    <div class="pt5">{{num}}秒后自动跳转到
                        <router-link to="/index" replace>首页</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">

    [i="not_found_wrap"]{
        width: 100%;
        height: 100%;
        background: #2b3348;

        .not-container-box{
            width: 100%;
            background-image: url('~images/404_background.jpg');
            // background-repeat: no-repeat;
            height: 526px;

            .not-container{
                width: 1000px;
                margin: auto;

                img{
                    width: 100%;
                }

                .not-container-text{
                    position: relative;
                    top: -150px;
                    text-align: center;
                    font-size: 18px;
                    // color:
                }

            }

        }

        @media screen and (max-width: 768px){
            .not-container-box{
                background-image: none!important;
            }

            .not-container-box .not-container{
                width: 100%;

                .not-container-text{
                    top: -100px;
                }
            }
        }

        @media screen and (max-width: 750px){
            .not-container-box{
                background-image: none!important;
            }

            .not-container-box .not-container{
                width: 100%;

                .not-container-text{
                    top: -50px;
                    font-size: 12px;
                }
            }
        }

    }

</style>
<script>
    export default{
        data(){
            return{
                num: 3
            }
        },
        methods:{

        },
        watch: {

        },
        components:{

        },
        filters: {

        },
        mounted(){
            var that = this;
            that.time = setInterval(function () {
                that.num--;
                if(that.num <=0){
                    tools.router.replace({path: '/index'});
                    clearInterval(that.time);
                }
            },1000)
        },
        destroyed() {
            clearInterval(this.time);
        }
    }
</script>
