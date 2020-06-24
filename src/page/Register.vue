<template>
  <div i="iogin_wrapper" class="login_wrapper">
    <div class="v_filter" @click="changeType"></div>
    <div class="form-wrap">
      <p class="title">绑定手机号码</p>
      <div class="form">
        <input
          class="input"
          type="tel"
          placeholder="请输入手机号码"
          v-model="form.phone"
          oninput="if(value.length>11)value=value.slice(0,11)"
        />
      </div>
      <div class="form mt15">
        <input
          class="input msg"
          type="tel"
          placeholder="请输入验证码"
          v-model="form.verification_code"
          oninput="if(value.length>6)value=value.slice(0,6)"
        />
        <span class="get-code pull-right" i="but">{{timerMsg}}</span>
        <!-- <base-Validation
          dom="[i="but"]"
          :request="{phone: form.phone,url:'/api/user/phone/add/sms', type:'POST'}"
        ></base-Validation> -->
      </div>
      <!-- <button class="cancel f16"  name="button" v-on:click.stop="alertError()">取消</button> -->
      <button class="comfirm" name="button" v-on:click.stop="sub()">确定</button>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
@import "../assets/sass/register.scss";

</style>


<script>
import md5 from "../lib/md5";
import Verify from "../lib/package/verify";
import baseValidation from "../components/validation/Validation.vue";
export default {
  data() {
    tools.title.set('注册')
    return {
      callback: decodeURIComponent(tools.url.params("callback")),
      isGetCode: false,
      timerMsg: "获取验证码",
      ischeck: tools.cache.get("ischeck") || 0,
      form: {
        phone: tools.cache.get("phone") || "",
        verification_code: "",
        name: tools.cache.get("name") || ""
      },
      showNextStep1: false,
      howNextStep2: false,
      peopleType: ["爸爸", "妈妈", "其他监护人"],
      check_index: 0,
      headImg: "",
      showStep1: true,
      contractList: [],
      nullArr: [],
      canGoNextView: null,
      is_loading: false,
      is_error: tools.cache.get("is_error")
      // showStep2: false,
    };
  },
  created() {
    //  if(tools.url.params('phone')){
    // }
  },
  methods: {
    getService(employee_id) {
      let that = this,
        ajaxData = {};
      ajaxData.employee_id = employee_id;
      if (tools.cache.get("invite_id")) {
        ajaxData.invite_user_id = tools.cache.get("invite_id");
      }
      tools.alert.loading();
      tools.ajax({
        url: "/api/orders",
        ajaxData,
        successFun: function(res) {
          tools.alert.success("叫号成功！");
          that.toUrl("/personal/order/list");
          tools.alert.closeLoading();
        },
        errorFun: function(error_data, status, headers, error_obj) {
          tools.alert.error(error_data.error_msg);
        },
        type: "POST"
      });
    },
    changeType() {
      this.$store.state.app.is_login = false;
      this.toUrl("/");
    },
    /* 获取验证码 */
    getCode() {
      var that = this;

      if (that.isGetCode) {
        return;
      }

      that.isGetCode = true;

      var verify = Verify.run([
        {
          type: "mobile",
          value: that.form.phone,
          name: "手机号码",
          errorMsg: "手机格式错误",
          canEmpty: false
        }
      ]);

      if (verify !== true) {
        setTimeout(function() {
          that.isGetCode = false;
        }, 3000);
        tools.alert.error(verify.msg);
        return;
      }

      that.form.code = "";

      tools.ajax({
        url: "/api/register/sms",
        ajaxData: {
          phone: that.form.phone
        },
        successFun: function(res) {
          that.countDown();
        },
        errorFun: function(error_data, status, headers, error_obj) {
          that.isGetCode = false;
          tools.alert.error(error_data.error_msg);
        },
        type: "POST"
      });
    },

    /* 倒计时 */
    countDown() {
      var that = this;
      var p = {};

      p.num = 60;
      that.time = setInterval(function() {
        p.num--;
        if (p.num <= 0) {
          that.timerMsg = "重新发送";
          that.isGetCode = false;
          clearInterval(that.time);
        } else {
          that.timerMsg = p.num + "s";
        }
      }, 1000);
    },

    /* 保存修改 */
    sub() {
    let params = {
        a: 2,
        code: tools.cache.get('CODE'),
        type: 1
    }
      tools.request.Login(params, res => {

        tools.alert.success("注册成功！登陆中...");
        setTimeout(() => {
          tools.cache.set("IS_USER", 1);
        //   this.toUrl(this.callback);
        location.replace(this.callback)
        }, 2000);
      });
    }
  },
  watch: {
    ischeck: function(o, n) {
      console.log(n);
      if (n !== "") {
        tools.cache.set("ischeck", this.ischeck);
      }
    }
  },
  components: {
    baseValidation
  },
  filters: {
    timeTran: function(value) {
      return parseInt(value) === 0 ? "-" : tools.date("Y.m.d", value);
    }
  },
  
  mounted() {
    if (tools.cache.get("is_auth") == 1 && tools.cache.get("isLogin") == 1) {
      tools.router.replace({ path: "/", query: {} });
      window.history.forward(1);
    }
    var state = { title: "title", url: "#" };
  }
};
</script>
