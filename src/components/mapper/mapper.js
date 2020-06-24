// BMap.Map、BMap.Control、BMap.Overlay。
const styleList = require('./style')
console.log(styleList, '434')
module.exports = {
    // 设置默认位置为深圳


    // 初始化地图
    init_map(list) {
        console.log(list)
        var markerArr = list;
        // 该代码片段作用为初始化地图 

        // 默认经纬度   
        var lot = 114.147973, lat = 22.588613;
        // 如果缓存中有经纬度缓存,那么默认经纬度为缓存中的

        // lot = tools.session.get('lot');
        // lat = tools.session.get('lat')

        var map = new BMap.Map("container"); // 创建Map实例  
        var point = new BMap.Point(lot, lat); //地图中心点  
        map.centerAndZoom(point, 5); // 初始化地图,设置中心点坐标和地图级别。 
        var myIcon = new BMap.Icon(
            "/static/images/my_ico.png",
            new BMap.Size(30, 50),
            {
                offset: new BMap.Size(0, 0),
                imageSize: new BMap.Size(30, 30),
                imageOffset: new BMap.Size(0, 0)
            });
        var marker = new BMap.Marker(point, { icon: myIcon });
        map.addOverlay(marker);
        var styleJson = styleList.style
        map.setMapStyle({ styleJson: styleJson });          // 将标注添加到地图中 



        // 添加标注 在循环体内使用  
        function addMarker(point, index) {
            map.removeOverlay();
            //创建标注图标     
            var myIcon = new BMap.Icon(
                "/static/images/__icon.png",
                new BMap.Size(30, 60),
                {
                    offset: new BMap.Size(0, 0),
                    imageSize: new BMap.Size(25, 29),
                    imageOffset: new BMap.Size(0, 0)
                });
            var marker = new BMap.Marker(point, { icon: myIcon });
            marker.addEventListener('click', function(){
                alert(111)
            })
            map.addOverlay(marker);
            return marker;
        }

        // 添加信息窗口  在循环体内使用



        // debugger
        var point = new Array(); //存放标注点经纬信息的数组  
        var marker = new Array(); //存放标注点对象的数组  
        var info = new Array(); //存放提示信息窗口对象的数组  
        markerArr = [{ lat: 114.21412, lng: 24.12412421 }, { lat: 104.21412, lng: 25.12412421 }, { lat: 124.21412, lng: 14.12412421 }, { lat: 114.21412, lng: 13.22412421 }]


        function addInfoWindow(thisMaker, poi) {

            // let openInfoWinFun = function () {
            //     alert(222)
            //     // $('.msg_wrap').css({ display: 'block', transition: '1s all' })
            //     // console.log(poi)
            //     // $('[i="map"] #msg .store_name').text(poi.name);
            //     // $('[i="map"] #msg .store_address').text(poi.address);
            //     // $('[i="map"] #msg .store_name').text(poi.title);
            //     // $('[i="map"] #msg .store_info .juli').text((poi.distance / 1000).toFixed(1) + 'km');
            //     // $('[i="map"] #msg .store_info .price').text('￥' + parseInt(poi.product_price / 100));
            //     // $('[i="map"] #msg .store_info .time').text(poi.open_start_time + '-' + poi.open_end_time);
            //     // console.log(poi)
            //     // $('.msg_wrap').attr('href', '/store/detail?id=' + poi.id)

            // };

            thisMaker.addEventListener("click", function () {
                alert(1)
            });
            // return openInfoWinFun;
        }
        var markers = [];

        for (var i = 0; i < markerArr.length; i++) {
            
            var p0 = markerArr[i].lat
            var p1 = markerArr[i].lng
            console.log(p0 + 'p0' + p1 + 'p1')
          
            map.removeOverlay(marker[i])



            var maker = addMarker(new BMap.Point(p0, p1), i);
            console.log(maker)

            maker.addEventListener("click", function () {
                alert(666666666666)
            });

        }




    }
}