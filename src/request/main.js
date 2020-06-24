import config from '../../.config.js';
/**
 * ajax请求
 * @param { query参数 } params 
 * @param { 成功回调 } success 
 */
const ajax = function(params, success) {
    // 是否需要Loading
    if (params.loading) {
        tools.alert.loading()
    }
    // 请求参数
    var data = {
        type: params.type || 'POST',
        url: params.url || '',
        data: {
            q: Boolean(JSON.stringify(params.data) == '{}') ? '{}' : params.data,
            n: params.name,
            s: tools.cache.get('SESSION') || new Date().getTime()
        },
        success: response => {
            tools.alert.closeLoading();
            // 服务器状态码
            let code = response.q.s;
            // 错误提示
            let errMsg = response.q.d;

            // 请求结果正常
            if (code == 0) {
                let outPutResult = JSON.parse(JSON.stringify(response));
                delete outPutResult.q.d;
                delete outPutResult.q.s;
                delete outPutResult.q.t;
                // 回调方法执行
                success(outPutResult.q);
            }
            // 请求结果异常
            else {
                switch (Number(code)) {
                    case 1004:
                        tools.alert.error(errMsg);
                        break;

                    case 1100:
                        // 未登录（场景为账号被冲突）
                        executeLogin();
                        break;

                    case 1012:
                        // token会话过期（用于长时间未登录后要求用户重新登录），重新获取
                        executeLogin();
                        break;

                    case 1002:
                        // session过期
                        tools.cache.del('SESSION');
                        tools.alert.error('用户签名过期，页面即将刷新...')
                        setTimeout(() => {
                            location.reload();
                        }, 1000)
                        break;

                    default:
                        tools.alert.error('服务器错误，错误代码：' + code);
                        break;
                }
            }
        }
    }
    $.ajax(data)
}

/**
 * 微信授权
 */
const executeAuth = function() {
    if (config.authorization.initiative) {
        let callback = location.pathname + location.search;
        location.href = '/authorization?callback=' + callback
    } else {
        let redirect_uri = encodeURIComponent(location.href),
            new_url =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9636924ce391563f&redirect_uri=" +
            redirect_uri +
            "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        window.location.href = new_url;
    }

}

/**
 * 检测是否登陆，未登录跳转至登陆页
 */
const executeLogin = function() {
    let callback = location.pathname + location.search;
    if (!tools.cache.get('IS_AUTH')) {
        executeAuth()
    } else {
        tools.alert.error('用户未登录，正在前往登陆页...')
        setTimeout(() => {
            location.href = '/login?callback=' + callback
        }, 1000)
    }
}

export {
    ajax
}