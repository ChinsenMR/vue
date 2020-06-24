<template>
	<div i='map'>
		<div class="map_wrapper" :class="{'map-size': sizeCtrl}">
            <div id="container" class="container"></div>
            <a class="msg_wrap" id="msg">
                <p class="store_name fb">五山工作室</p>
                <p class="store_address">广州市天河区五山地铁B1出口广州市天河区五山地铁B1出口广州市天河区五山地铁B1出口广州市天河区五山地铁B1出口...</p>
                <div class="store_info">
                    <div class="item time">10:00-22:00</div>
                    <div class="item price">¥88</div>
                    <div class="item juli">2.7km</div>
                </div>
            </a>
            <div class="handle_icon" @click="changeMapSize()" :class="{max: !sizeCtrl, min: sizeCtrl}"></div>
        </div>
       
	</div>
</template>
<style rel="stylesheet/scss" lang="scss">
// @import '../../assets/sass/tool';
[i="map"]{
    width: 100%;
    height: 100%;
    [src="https://api.map.baidu.com/images/copyright_logo_hd.png"]{
        display:none;
    }
    .BMap_noprint{
        top: 50px!important;
    }
    .map_wrapper{
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        // margin-top: r(30px);
        transition: 0.3s all;
        box-shadow: 0 0 r(24px) 0 rgba(0,0,0,0.08);
        // border-radius: r(20px);
        .container{
            width: 100%;
            height: 100%;
            // border-radius: r(30px);
        }
        .msg_wrap{
            display: none;;
            position: absolute;
            bottom: 5%;
            left: 50%;
            margin-left: r(-300px);
            width: r(600px);
            padding: r(26px) 0 r(12px) r(24px);
            background-color: rgba(255, 255, 255, 0.9);
            background-image: url(/static/images/dh.png);
            background-position:  r(500px) r(30px);
            background-size: r(68px);
            background-repeat: no-repeat;
            border-radius: r(15px);
            .store_name{
                font-size: r(34px);
            }
            .store_address{
                width: r(400px);
                font-size: r(24px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .store_info{
                margin-top: r(23px);
                display: flex;
                .item{
                    position: relative;
                    // flex: 1;
                    text-indent: r(40px);
                    font-size: r(28px);
                    color: #4A4A4A;
                }
                .item:nth-child(1){
                    // width: r(230px);
                    margin-right: r(20px);
                    &:after{
                        position: absolute;
                        content: '';
                        width: r(30px);
                        height: r(30px);
                        //  background-image: url(/static/images/locate@2x.png);
                        background-image: url(/static/images/st_01.png);
                       
                        background-position:  center;
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-color: #eee;
                        border-radius: 50%;
                        left: 0;
                        top: 50%;
                        margin-top: (-8px);
                    }
                }
                 .item:nth-child(2){
                     margin-right: r(20px);
                    //  width: r(120px);
                     &:after{
                        position: absolute;
                        content: '';
                        width: r(30px);
                        height: r(30px);
                        //  background-image: url(/static/images/locate@2x.png);
                        background-image: url(/static/images/item_01.png);
                       
                        background-position:  center;
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-color: #eee;
                        border-radius: 50%;
                        left: 0;
                        top: 50%;
                        margin-top: (-8px);
                    }
                }
                .item:nth-child(3){
                     &:after{
                        position: absolute;
                        content: '';
                        width: r(30px);
                        height: r(30px);
                         background-image: url(/static/images/st_02.png);
                        background-position:  center;
                        background-size: cover;
                        background-repeat: no-repeat;
                        // background-color: #eee;
                        border-radius: 50%;
                        left: 0;
                        top: 50%;
                        margin-top: (-8px);
                    }
                }
            }
        }
        .handle_icon{
            position: absolute;
            right: r(45px);
            top: r(30px);
            width: r(50px);
            height: r(50px);
           
            border-radius: 50%;
        }
        .max{
            background: url(/static/images/max.png)center center / r(30px) no-repeat;
            background-color: #fff;
        }
        .min{
            background: url(/static/images/min.png)center center / r(30px) no-repeat;
             background-color: #fff;
        }
    }
    .work_content_wrap{
        padding: 0 r(30px) r(130px) r(30px);
        width: 100%;
        .work_item{
            position: relative;
            width: 100%;
            background:#fff;
            margin-top: r(30px);
            padding: r(30px) r(27px) r(20px) r(27px);
            box-shadow: 0 0 r(24px) 0 rgba(0,0,0,0.08);
            border-radius: r(25px);
            p{
                width: r(400px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;

            }
            .store_name{
                font-size: r(36px);
                color: #000000;
            }
            .detail{
                display: flex;
                margin-top: r(30px);
                padding-top: r(20px);
                border-top: 1px solid #C5C5C5;
                width: 100%;
                align-items: center;
                font-size: r(28px);
                color: #4A4A4A;
                .icon_1{
                    width: r(40px);
                    height: r(40px);
                     background: url(/static/images/item_01.png)center center / cover no-repeat;
                    margin-right: r(12px);
                }
                .icon_2{
                    width: r(40px);
                    height: r(40px);
                    margin-right: r(12px);
                    margin-left: r(30px);
                    background: url(/static/images/item_02.png)center center / cover no-repeat;
                }
                .icon_3{
                    width: r(40px);
                    height: r(40px);
                   background: url(/static/images/item_03.png)center center / cover no-repeat;
                    margin-right: r(12px);
                    margin-left: r(30px);
                }
            }
            .service_type{
                margin-top: r(24px);
                font-size: r(28px);
                color: #000000;
                span{
                    margin-left: r(15px);
                }
            }
            .activity{
                display: flex;
                align-items: center;
                margin-top: r(15px);
                font-size: r(28px);
                width: r(500px);
                i{
                   display: inline-block;
                   color: #fff;
                   width: r(28px);
                   height: r(28px);
                   line-height: r(29px);
                   background: #FF8268;
                   font-size: r(24px);
                   text-align: center;
                   color: #fff;
                   border-radius: r(5px);
                   margin-right: r(8px);
                }
            }
            .status_0{
                 color: #FF8268;
                i{
                   background: #FF8268;
                   
                }
                
            }
            .work_status{
                margin-top: r(15px);
                font-size: r(28px);
                color: #000000;
            }
            .address{
                margin-top: r(15px);
                font-size: r(26px);
                color: #C1C1C1;
            }
            .go_btn{
                position: absolute;
                width: r(180px);
                height: r(73px);
                border-radius: r(10px);
                top: r(50px);
                right: r(25px);
                font-size: r(30px);
                background: #D4A667;
                color: #fff;
            }
            .go_btn2{
                position: absolute;
                width: r(180px);
                height: r(73px);
                border-radius: r(10px);
                top: r(50px);
                right: r(25px);
                font-size: r(30px);
                background: #C1C1C1;;
                color: #fff;
            }
            .distance{
                position: absolute;
                right: r(20px);
                top: r(30px);
                font-size: r(30px);
                color: #9B9B9B;
            }
        }
    }
    .map-size{
        position: relative;
        width: 100%!important;
        min-height: r(1230px);
        margin: 0!important;
        border-radius: 0!important;
        // margin-top: r(30px);
         .container{
            width: 100%;
            height: 100%;
            // border-radius: r(30px);
        }
    }
}
</style>

<script>
    import { init_map } from './mapper.js'
	export default {
		data() {
			return {
                sizeCtrl: false,
                store_id: 0,
                over_loading: false,
                // store_list: []
               
			}
        },
        props: ['maker'],
		methods: {
            changeMapSize(){
                console.log(this.sizeCtrl)
                this.sizeCtrl = !this.sizeCtrl
            },
           getStoreList(){
                let that = this, ajaxData = that.extra_data || {};
				ajaxData.longitude = tools.session.get('lot');
				ajaxData.latitude =  tools.session.get('lat');
                tools.alert.loading();
                tools.ajax({
                    url: '/api/store/map',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        // that.store_list = res.list;
                        setTimeout(()=>{
                             init_map(res.list);     
                             $('.BMap_noprint').eq(0).css({top: '0.4rem!important', left: '0.4rem!important'})
                        },300)
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.closeLoading();
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
           },
          
        
        },
        watch: {
            '$route': 'initMap'
        },
        destroyed(){
            // init_map = undefined;
        },
		mounted(){
        //   this.getStoreList();
        init_map([{}]);     
        $('.BMap_noprint').eq(0).css({top: '0.4rem!important', left: '0.4rem!important'})
          
        //    setTimeout(()=>{
                       
        //     },300)
          
		}
	}
</script>