<template>
  <div i="authorization" class="login_wrapper">
    <div class="title f40 text-center">授权</div>
    <!-- qq授权 -->
    <div class="auth-container pt50 flex-center col-xs-12 text-center">
      <div class="item qq flex-row-1" @click="auth(1)">QQ</div>
      <div class="item wechat flex-row-1" @click="auth(2)">微信</div>
      <div class="item weibo flex-row-1" @click="auth(3)">微博</div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
@import "../assets/sass/common/tool.scss";
// @import "../../assets/sass/common/tool";
// @import "../../static/font/ionicons.css";
[i="authorization"] {
}
</style>


<script>
import md5 from "../lib/md5";
import  Verify  from "../lib/package/verify";
import baseValidation from "../components/validation/Validation.vue";
export default {
  data() {
    tools.title.set("授权");

    return {};
  },
  created() {},
  methods: {
    auth(type) {
      let auth_url = "";
      if (type == 1) {
        this.qqAuth();
      } else if(type == 2){
        this.wechatAuth()
      }
  
    },
    qqAuth() {
      auth_url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=appid&scope=all&redirect_uri=回调地址`;
      location.href = auth_url;
    },
    wechatAuth(){
        let path = decodeURIComponent(tools.url.params("callback"));

          let redirect_uri = encodeURIComponent(location.origin + path),
            auth_url =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9636924ce391563f&redirect_uri=" +
              redirect_uri +
              "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          location.href = auth_url;
    }
  },
  watch: {},
  components: {
    baseValidation
  },
  filters: {},
  mounted() {}
};
</script>
