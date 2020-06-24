import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import store from './store';
import Config from '../.config.js';
import comApp from './common/app';
import request from './request/urls';

//加载本地路由
import BaseRoute from './router/index';

import VueTouch from 'vue-touch'

Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {

    threshold: 100 //手指左右滑动距离

}
import '@static/flexible.js';
import '@assets/font/ionicons.css';

//加载package
import Tools from '@package/tools';
import Route from '@package/route';
import Log from '@package/log';
import Alert from '@package/alert';

//弹出框类
import { MessageBox, Toast, Indicator } from 'mint-ui';

//ydui UI
// import 'vue-ydui/dist/ydui.rem.css';
import 'vue-ydui/dist/ydui.base.css';

var messageBox = MessageBox;
var toast = Toast;
var indicator = Indicator;
Alert.ui.messageBox = messageBox;
Alert.ui.toast = toast;
Alert.ui.indicator = indicator;

import Promise from 'bluebird';

import '@assets/sass/common/base.scss';

var tools = Tools;
var log = Log;
var alert = Alert;

//定义错误操作数组
tools.request = request;

//初始化路由
Route.data.baseRoute = BaseRoute;

var app = window;

Tools.vue = Vue;
Tools.alert = alert;

app.tools = tools;

app.config = Config;
app.log = log;
app.Promise = Promise;
app.app = comApp;

Vue.use(VueRouter);

/* 定义路由 */
const routes = Route.routes();

let routeObj = {
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
}

// if (Config.base) {
//     Object.assign(routeObj, { base: Config.base })
// }

const router = new VueRouter(routeObj);

//用于记录刷新页面状态
tools.cache.set('locationJump', 1);

//记录刚进页面时的链接，ios用到
tools.cache.set('initUrl', location.href);

/* 定义路由示例 */
app.tools.router = router;

/* 定义路由数组 */
app.tools.routes = routes;

//定义是否可以初始化签名
app.canauthinit = 1;

import Login from './authorization/index.js';

/* 初次打开,检查权限 */
router.beforeEach((to, from, next) => {
    Login(to, from, next);
})

/* eslint-disable no-new */
new Vue({
    store,
    render: v => v(App),
    router
}).$mount('#app');

// 解决安卓在微信上字体放大后样式错乱
if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
    handleFontSize();
} else {
    if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", handleFontSize);
        document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
    }
}

function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
    });
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function() {
        WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
        });
    });
}