vue-package 1.0.0.1
【1】项目拿到手之后，第一件事，我们先关心以下几个方面

    1 安装依赖 这里不做多说明

    2 .config.js

        --  以下为重要的参数
            authorization: {
                need_auth: true, // 是否开启模拟授权
                initiative: true, // 是否主动授权
            },
            appId: 'wx9636924ce391563f', // 公众号ID，用于授权
            api: {
                url: 'http://d.aiitec.org/nissan-php',  // 图片路径
                domain: 'http://d.aiitec.org/nissan-php' // 请求域名（必配）
            }

    3 npm run route 该命令会将存在于pages文件夹所有的.vue文件进行路由生成

      注意：这条命令会一直在项目开发中用到，每新建一个.vue文件，可执行生成路由

【2】以上步骤完成后，就可以开始正式开发了
    1 进入src目录
        |- src
           |- assets 静态资源，只有js部分和template部分存在于.vue文件，样式请存放于本文件夹
           |- authorization 授权验证，这里仅作粗略验证，主要用于验证session
           |- common 公用模块，存放一些公用方法
           |- components 组件
           |- lib js文件库
           |- mixin 全局方法
           |- page 
           |- store vuex存放位置 
           |- router 路由
           |- main.js 所有公用文件在此引入
           |- App.vue 
    2 请求
        路径：接口存放在request文件夹里urls.js里
    
        参数：以下就是一个完整的接口，最终通过遍历暴露出由main.js引入
    
            /* 获取Session */
            {
                name: 'getSign', // 方法名
                type: 'Session', // 命名空间
                url: '/api/Base/Session', // 接口路由
                methods: 'POST', // 请求方式
                loading: true, 是否需要loading
            }
        
        调用：全局调用方法,跟小程序一样，我们只需要关心参数和成功结果。
           
             tools.request.getData({}, res => { todo... })

        注意：接口发生的所有错误都已经在request/main.js里面处理，包括授权逻辑，登陆逻辑都已经在该文件处理好，如发现逻辑上由问题，请直接排查request/main.js
    
    3 tools 提供了一些常用的工具方法，

        缓存  tools.caches.get() | tools.caches.set() | tools.caches.del()
        标题  tools.title.set()
        弹窗  tools.alert.error() | tools.alert.fonfirm() | tools.alert.loading('加载中...', 500) | tools.alert.closeLoading()
        拿参  tools.url.params('id') 
        请求  tools.request.getData()
        ......具体可在控制台打印尝试
    
    4 assets/sass/common提供了两个类库，工具类库和全局样式类库，可以页面直接使用
    
      类库使用 <div class="padding-20 padding-t-100 padding-b-100"></div>
      工具库使用
        width: r(100px); 100px 为设计稿实际尺寸，r()是tools的公用方法，通过该方法换算出rem单位
        注意：这里使用rem，是通过引入assets/sass/common/tools.scss
    
    此版本为测试版本，后续将继续根据公司业务而进行优化
     

           
    
