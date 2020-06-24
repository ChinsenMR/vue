/* 请求方法 */
/* 全局配置同于存放在根目录config.js */
const config = require('../../.config.js')
const $ajax = require('./main.js').ajax;
/* 后端域名 */
const DOMAIN = config.api.domain;
const TEST_DOMAIN = config.api.test_domain;

/*  模块区域 */
const Base = DOMAIN + '/api/Base/';
const Api = DOMAIN + '/api/';
const Act = DOMAIN + '/api/Act/';
const Cis = DOMAIN + '/api/Cis/';

/**
 * { url: 接口地址, （必传）
 *   data: 传入的是接口所需要的参数, 
 *   name: 接口命名空间, （必传）
 *   methods: 请求方式，（必传）
 *   noLoading: 是否关闭loading动画
 * }
 * 规范
 * 1 方法命名第一个单词一定是动词
 * 2 把相应模块统一放置
 * 3 写好相应的注释
 * 4 对于方法的定义做了简单的封装，避免重复的工作
 * 5 最终我们在page里面调用，在success, 里面做逻辑处理,如果接口报错会直接抛出在逻辑层，所以开发过程中不需要处理
 */


/* 所有方法都定义在数组中，我们只需要关心参数 */
const methodsList = [
        /* 获取Session */
        {
            name: 'getSign',
            type: 'Session',
            url: Base + 'Session',
            methods: 'POST',
            loading: true,
        },
        /* 登陆 */
        {
            name: 'Login',
            type: 'Login',
            url: Base + 'Login',
            methods: 'POST',
            loading: true,
        },
        /* 登出 */
        {
            name: 'Logout',
            type: 'Logout',
            url: Base + 'Logout',
            methods: 'POST',
            loading: true,
        },
        /* 测试 */
        {
            name: 'getGetSlideShowList',
            type: 'GetSlideShowList',
            url: Api + 'GetSlideShowList',
            methods: 'POST',
            loading: true,
        },
        /* 测试2 */
        {
            name: 'getCityRankingList',
            type: 'CityRankingList',
            url: Act + 'CityRankingList',
            methods: 'POST',
            loading: true,
        },
        /* 测试2 */
        {
            name: 'getUserDetail',
            type: 'UserDetail',
            url: Cis + 'UserDetail',
            methods: 'POST',
            loading: true,
        },
        {
            name: 'GetWechatSignPackage',
            type: 'GetWechatSignPackage',
            url: Base + 'GetWechatSignPackage',
            methods: 'POST',
            loading: false,
        },
    ]
    /* 用于输出方法的对象 */
const outputMethods = {}

/* 循环遍历，最终将所有方法暴露出去 */
methodsList.forEach(item => {

    let params = data => {
        return {
            url: item.url,
            data,
            name: item.type,
            methods: item.methods,
            loading: item.loading
        }
    }

    outputMethods[item.name] = (data, success, error) => $ajax(params(data), success, error)
})

module.exports = outputMethods