import config from '../../.config.js';
const auth = {
    is_auth: null, //是否需要授权
    authType: null, //授权类型
    authUrl: null, //授权地址
    userStatusUrl: null, //用户状态获取地址
    /**
     * 权限验证
     */
    check(to, from, fun) {
        let that = this;

        // is_user 1 为已经登陆否则反之
        let is_user = tools.cache.get('IS_USER');
        // is_auth 1 为已经授权否则反之
        let is_auth = tools.cache.get('IS_AUTH');
        // 存储状态，如果路径中携带code，就保存
        if (tools.url.params('code') && !tools.cache.get('CODE')) {
            is_auth = 1;
            tools.cache.set('IS_AUTH', 1);
            tools.cache.set('CODE', tools.url.params('code'))
        }

        //已经有token后直接请求登陆状态		
        if (!tools.cache.get('SESSION')) {
            that.getSign(res => {
                if (res.q.s == 0) {
                    tools.cache.set('SESSION', res.s)
                    that.goUrl(to, from, fun, {
                        is_user,
                        is_auth
                    });
                } else {
                    tools.alert.error('获取session失败')
                    setTimeout(() => {
                        location.reload();
                    }, 2000)
                }
            })
        } else {
            that.goUrl(to, from, fun, {
                is_user,
                is_auth
            });
        }
    },

    /**
     * 首次授权方式
     */
    goAuth() {
        let redirect_uri = encodeURIComponent(location.href),
            auth_link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9636924ce391563f&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        window.location.href = auth_link
    },

    /**
     * 跳转页面方式
     * @param {*} to 
     * @param {*} from 
     * @param {*} fun 
     * @param {*} userStatus 
     */
    goUrl(to, from, fun, userStatus) {
        fun(userStatus);
    },
    /**
     * 获取签名
     * @param {成功回调} success 
     */
    getSign(success) {
        $.ajax({
            type: 'POST',
            url: config.api.url + '/api/Base/Session',
            data: {
                q: {
                    a: 1,
                    deviceToken: 1,
                    deviceType: 2123
                },
                n: 'Session',
                deviceToken: '1',
            },
            success: res => {
                success(res)
            },
        })
    },
}

export default auth