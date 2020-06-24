<template>
  <div page="info" :style="`height: ${height}px`">
    <div class="content" v-if="hideText">
      <div class="filter" @touchmove.prevent @click="hideText = false"></div>
      <div class="text">
        <div class="view" v-html="imageText"></div>
      </div>
    </div>
    <div class="img-cover"></div>
    <div class="main clearfix">
      <div class="form-wrap clearfix">
        <div class="form-item flex-center">
          <div class="name">姓&nbsp;&nbsp;&nbsp;&nbsp;名</div>
          <input class="cont" type="text" placeholder="姓名" v-model="form.name" maxlength="20" />
        </div>
        <div class="form-item flex-center">
          <div class="name">性&nbsp;&nbsp;&nbsp;&nbsp;别</div>
          <div class="cont flex-center text-right" i="sex">
            <div class="text flex-row-1 mr10 text-right">{{form.sex || ''}}</div>
            <div class="arrow-right"></div>
          </div>
        </div>
        <div class="form-item flex-center">
          <div class="name">手&nbsp;&nbsp;&nbsp;&nbsp;机</div>
          <input class="cont" type="number" placeholder="手机" v-model="form.phone" />
        </div>
        <div class="form-item flex-center">
          <div class="name">省&nbsp;&nbsp;&nbsp;&nbsp;份</div>
          <div class="cont flex-center" i="province">
            <div class="text flex-row-1 mr10">{{form.province || ''}}</div>
            <div class="arrow-right"></div>
          </div>
        </div>
        <div class="form-item flex-center" v-show="form.province_id">
          <div class="name">城&nbsp;&nbsp;&nbsp;&nbsp;市</div>
          <div class="cont flex-center" i="_city">
            <div class="text flex-row-1 mr10">{{form.city || ''}}</div>
            <div class="arrow-right"></div>
          </div>
        </div>
        <div class="form-item flex-center" v-show="form.city_id">
          <div class="name">经销商</div>
          <div class="cont flex-center" i="dealer">
            <div class="text flex-row-1 mr10">{{form.dealer || ''}}</div>
            <div class="arrow-right"></div>
          </div>
        </div>
      </div>
      <div class="agreement flex-content-center" @click="form.is_read = !form.is_read">
        <div class="checkbox" :class="{checked: form.is_read}"></div>我同意将以上信息提交给品牌方联系试驾事宜
      </div>
      <div class="desc" v-if="false">
        预约试驾，更有机会与网红摄影师，专业飞手同场交流竞技，解锁大片拍摄/后期技巧，更有机会享受到店购车丰厚优惠。
        <span
          class="more"
          @click="getImageText"
        >了解更多</span>
      </div>
      <button class="post-btn" @click.stop="postInfo">报名线下试驾</button>
    </div>

    <base-picker
      ref="picker"
      sex="[i='sex']"
      date="[i='date']"
      city="[i='city']"
      _city="[i='_city']"
      province="[i='province']"
      dealer="[i='dealer']"
      v-on:callback="fun"
    ></base-picker>
  </div>
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
      tools.request.getCityRankingList({ id: 1 }, res => {
        this.$refs.picker.picker4.setData(res.q.enrollRegionProvinceList);
      });
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
