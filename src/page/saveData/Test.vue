<template>
  <div>这是一个正常的页面</div>
</template>
<style rel="stylesheet/scss" lang="scss">
@import "~sass/saveData/index.scss";
</style>
<script>
import basePicker from "@components/picker/Picker.vue";
import Picker from "better-picker";
export default {
  data() {
    return {
      form: {
        name: "",
        phone: "",
        province: "",
        province_id: "",
        city: "",
        city_id: "",
        sex: "",
        dealer: "",
        dealer_id: "",
        is_read: false
      },
      imageText: "",
      hideText: false,
      height: window.innerHeight
    };
  },
  methods: {
    fun(res) {
      console.log(res);
      if (res.type == "sex") {
        this.form.sex = res.text;
      }
      if (res.type == "province") {
        if (this.form.province_id && this.form.province_id != res.id) {
          this.form.city = "";
          this.form.city_id = "";
          this.form.dealer = "";
          this.form.dealer_id = "";
        }
        this.getCity(res.id, () => {
          console.log(res);
        });
        this.form.province = res.text;
        this.form.province_id = res.id;
      }
      if (res.type == "_city") {
        if (this.form.city_id && this.form.city_id != res.id) {
          this.form.dealer = "";
          this.form.dealer_id = "";
        }
        this.getMerchant(res.id, () => {
          console.log(res);
        });
        this.form.city = res.text;
        this.form.city_id = res.id;
      }

      if (res.type == "dealer") {
        this.form.dealer = res.text;
        this.form.dealer_id = res.id;
      }
      // console.log(this.$refs.picker)
      // this.$refs.picker.muiPicker()
    },
    getImageText() {
      tools.alert.loading();
      tools.ajax(
        { name: "Setting", query: { a: 13 } },
        res => {
          this.hideText = true;
          console.log(res);
          this.imageText = res.q.setting.value;
          console.log(this.imageText);
          tools.alert.closeLoading();
        },
        err => {
          console.log(err);
        }
      );
    },
    getPro() {
     tools.request.getUserDetails({a: 11}, res => {

     })
    },
    getCity(id, cb) {
      tools.alert.loading();
      tools.ajax(
        { name: "EnrolRegionlCityList", query: { id } },
        res => {
          this.$refs.picker.picker5.setData(res.q.enrollRegionCityList);
          tools.cache.set("city", JSON.stringify(res.q.enrollRegionCityList));
          console.log(res.q.enrollRegionCityList, "222");
          tools.alert.closeLoading();
          cb();
        },
        err => {
          console.log(err);
        }
      );
    },
    getMerchant(id, cb) {
      tools.alert.loading();
      tools.ajax(
        { name: "DealerList", query: { id } },
        res => {
          tools.alert.closeLoading();
          if (!res.q.cisDealerList || res.q.cisDealerList.length == 0) {
            tools.alert.error("您所选的城市暂无经销商，请选择其他城市的经销商");
            setTimeout(() => {
              this.form.city = "";
              this.form.city_id = "";
            }, 1000);
            return;
          }
          this.$refs.picker.picker6.setData(res.q.cisDealerList);
          tools.cache.set("dealer", JSON.stringify(res.q.cisDealerList));

          cb();
        },
        err => {
          console.log(err);
        }
      );
    },
    postInfo() {
      let ajaxData = JSON.parse(JSON.stringify(this.form));

      if (!ajaxData.name) {
        tools.alert.error("请输入姓名");
        return;
      }
      if (!ajaxData.sex) {
        tools.alert.error("请选择性别");
        return;
      }

      if (!ajaxData.phone) {
        tools.alert.error("请输入手机号码");
        return;
      }
      if (ajaxData.phone.length < 11 || ajaxData.phone.length > 11) {
        tools.alert.error("手机格式错误");
        return;
      }

      if (!ajaxData.province_id) {
        tools.alert.error("请选择省份");
        return;
      }
      if (!ajaxData.city_id) {
        tools.alert.error("请选择城市");
        return;
      }
      if (!ajaxData.dealer_id) {
        tools.alert.error("请选择经销商");
        return;
      }
      if (!ajaxData.is_read) {
        tools.alert.error("请同意将以上信息提交给品牌方联系驾驶");
        return;
      }

      delete ajaxData.is_read;
      delete ajaxData.province;
      delete ajaxData.city;
      delete ajaxData.dealer;
      ajaxData.sex = ajaxData == "男" ? 1 : ajaxData == "女" ? 2 : 0;

      tools.alert.loading();
      tools.ajax(
        { name: "EnrollSubmit", query: { id: 1 } },
        res => {
          tools.alert.closeLoading();
          this.form = {
            name: "",
            phone: "",
            province: "",
            province_id: "",
            city: "",
            city_id: "",
            sex: "",
            dealer: "",
            dealer_id: "",
            is_read: false
          };

          tools.alert.success("提交成功");

          setTimeout(() => {
            location.reload();
            // this.toUrl("/showPhotos/index");
          }, 500);
        },
        err => {
          console.log(err);
        }
      );

      console.log(ajaxData);
    }
  },
  watch: {
    form(n, o) {
      if (n !== o) {
        if (n.phone.length > 11) {
          n.phone = o.phone;
        }
      }
    }
  },
  components: { basePicker },
  filters: {},
  mounted() {
    // console.log(tools);
    // tools.ajax(
    //   { name: "Session", query: { a: 3 } },
    //   res => {
    //     console.log(res);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    // this.getCity(1, () => {});
    // this.getMerchant(2, () => {})
    // var picker = new mui.PopPicker();
    this.getPro();
  }
};
</script>
