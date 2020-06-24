<template>
  <div i="components-picker"></div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../static/picker/mui.min.css";
@import "../../../static/picker/mui.picker.min.css";
@import "../../../static/picker/mui.poppicker.css";
</style>
<script>
export default {
  data() {
    return {
      cityData3: [],
      picker1: undefined,
      picker2: undefined,
      picker3: undefined,
      picker4: undefined, // 省
      picker5: undefined, // 省
      picker6: undefined, // 省
      open: false
    };
  },
  components: {},
  props: ["sex", "date", "city", "province", "_city","dealer"],
  watch: {},
  computed: {},
  methods: {
    //三级联动
    muiPicker: function() {
      var that = this;
      if (!window.mui) {
        window.mui = require("../../../static/picker/mui.min.js");
      }

      require("../../../static/picker/mui.picker.min.js");
      require("../../../static/picker/mui.poppicker.js");

      var $$ = $;

      (function($, doc) {
        //					$.init();
        $.ready(function() {
          if ($$(that.sex).length > 0) {
            //性别选择
            that.picker1 = new $.PopPicker();
            var objx = [
              {
                value: 0,
                text: "保密"
              },
              {
                value: 1,
                text: "男"
              },
              {
                value: 2,
                text: "女"
              }
            ];
            that.picker1.setData(objx);
            $$(that.sex).on("click", function() {
              that.clickBg(); //初始化打开并绑定点击背景
              that.picker1.show(function(items) {
                that.open = false;
                that.$emit("callback", {
                  type: "sex",
                  sex: items[0].value,
                  text: items[0].text
                });
                //返回 false 可以阻止选择框的关闭
                //									return false;
              });
            });
          }

          if ($$(that.date).length > 0) {
            //日期
            that.picker2 = new $.DtPicker({
              type: "date",
              beginYear: new Date().getFullYear() - 28,
              endYear: new Date().getFullYear() - 1
            });
            $$(that.date).on("click", function() {
              that.clickBg(); //初始化打开并绑定点击背景
              that.picker2.show(function(rs) {
                that.open = false;
                /*
                 * rs.value 拼合后的 value
                 * rs.text 拼合后的 text
                 * rs.y 年，可以通过 rs.y.value 和 rs.y.text 获取值和文本
                 * rs.m 月，用法同年
                 * rs.d 日，用法同年
                 * rs.h 时，用法同年
                 * rs.i 分（minutes 的第二个字母），用法同年
                 */
                var dateText = rs.y.value + "-" + rs.m.value + "-" + rs.d.value;
                var timestamp = new Date(dateText).getTime() / 1000;

                that.$emit("callback", {
                  type: "date",
                  date: timestamp,
                  text: dateText
                });

                //									return false;
              });
            });
          }

          if ($$(that.city).length > 0) {
            //城市
            require("../../../static/picker/city.js");
            that.picker3 = new $.PopPicker({
              layer: 3
            });
            that.picker3.setData(city);
            that.picker3.pickers[0].setSelectedIndex(18);
            that.picker3.pickers[1].setSelectedIndex(0);

            $$(that.city).on("click", function() {
              that.clickBg(); //初始化打开并绑定点击背景
              that.picker3.show(function(items) {
                that.open = false;
                that.$emit("callback", {
                  type: "city",
                  province: format(items[0].text),
                  city: format(items[1].text),
                  area: format(items[2].text)
                });
                //返回 false 可以阻止选择框的关闭
                //									return false;
              });
            });
          }
          if ($$(that.province).length > 0) {
            // debugger
            //城市
            // require("../../../static/picker/city.js");
            let provinceData = [
              {
                id: 1,
                text: "黑龙江省"
              },
              {
                id: 2,
                text: "吉林省"
              },
              {
                id: 3,
                text: "辽宁省"
              },
              {
                id: 4,
                text: "甘肃省"
              },
              {
                id: 5,
                text: "内蒙古"
              },
              {
                id: 6,
                text: "宁夏"
              },
              {
                id: 7,
                text: "青海省"
              },
              {
                id: 8,
                text: "陕西省"
              },
              {
                id: 9,
                text: "新疆"
              },
              {
                id: 10,
                text: "北京市"
              },
              {
                id: 11,
                text: "河北省"
              },
              {
                id: 12,
                text: "山东省"
              },
              {
                id: 13,
                text: "山西省"
              },
              {
                id: 14,
                text: "天津市"
              },
              {
                id: 15,
                text: "江苏省"
              },
              {
                id: 16,
                text: "上海市"
              },
              {
                id: 17,
                text: "浙江省"
              },
              {
                id: 18,
                text: "安徽省"
              },
              {
                id: 19,
                text: "河南省"
              },
              {
                id: 20,
                text: "湖北省"
              },
              {
                id: 21,
                text: "湖南省"
              },
              {
                id: 22,
                text: "江西省"
              },
              {
                id: 23,
                text: "福建省"
              },
              {
                id: 24,
                text: "广东省"
              },
              {
                id: 25,
                text: "广西省"
              },
              {
                id: 26,
                text: "海南省"
              },
              {
                id: 27,
                text: "贵州省"
              },
              {
                id: 28,
                text: "四川省"
              },
              {
                id: 29,
                text: "西藏"
              },
              {
                id: 30,
                text: "云南省"
              },
              {
                id: 31,
                text: "重庆市"
              },
              {
                id: 32,
                text: "香港特别行政区"
              },
              {
                id: 33,
                text: "澳门特别行政区"
              },
              {
                id: 34,
                text: "台湾地区"
              }
            ];
            
            that.picker4 = new $.PopPicker({
              layer: 1
            });
            that.picker4.setData(provinceData);
            that.picker4.pickers[0].setSelectedIndex(0);
            // that.picker4.pickers[1].setSelectedIndex(0);

            $$(that.province).on("click", function() {
              that.clickBg(); //初始化打开并绑定点击背景
              that.picker4.show(function(items) {
                that.open = false;
                that.$emit("callback", {
                  type: "province",
                  text: format(items[0].text),
                  id: format(items[0].id)
                  // area: format(items[2].text)
                });
                //返回 false 可以阻止选择框的关闭
                //									return false;
              });
            });
          }

          if ($$(that._city).length > 0) {
            // debugger
            //城市
            console.log(6);
            // require("../../../static/picker/city.js");
            // console.log(tools.cache.get("city"))
            // let cityData = JSON.parse(tools.cache.get("city"))
            // tools.cache.get("city") ||
            that.picker5 = new $.PopPicker({
              layer: 1
            });
            // that.picker5.setData(JSON.parse(tools.cache.get("city")));
            that.picker5.pickers[0].setSelectedIndex(0);
            // that.picker5.pickers[1].setSelectedIndex(0);

            $$(that._city).on("click", function() {
              that.clickBg(); //初始化打开并绑定点击背景
              that.picker5.show(function(items) {
                that.open = false;
                that.$emit("callback", {
                  type: "_city",
                  text: format(items[0].text),
                  id: format(items[0].id)
                });
                //返回 false 可以阻止选择框的关闭
                //									return false;
              });
            });
          }
          if ($$(that.dealer).length > 0) {
            that.picker6 = new $.PopPicker({
              layer: 1
            });
            that.picker6.setData(JSON.parse(tools.cache.get("dealer")));
            that.picker6.pickers[0].setSelectedIndex(0);
            $$(that.dealer).on("click", function() {  
              that.clickBg(); //初始化打开并绑定点击背景
              that.picker6.show(function(items) {
                that.open = false;
                that.$emit("callback", {
                  type: "dealer",
                  text: format(items[0].text),
                  id: format(items[0].id)
                });
                //返回 false 可以阻止选择框的关闭
                //									return false;
              });
            });
          }
        });
      })(window.mui, document);

      function format(val) {
        return val || "";
      }
    },
    //绑定黑色背景
    clickBg: function() {
      var that = this;
      that.pushHistory();
      that.open = true;

      setTimeout(function() {
        $(".mui-backdrop,.mui-btn").on("touchend", function() {
          that.open = false;
        });
      }, 500);
    },
    //回退的时候作出判断
    backMechanism: function() {
      var that = this;
      $(window).unbind("popstate");
      if (that.open) {
        that.open = false;
        that.picker1 ? that.picker1.hide() : false;
        that.picker2 ? that.picker2.hide() : false;
        that.picker3 ? that.picker3.hide() : false;
        that.picker4 ? that.picker4.hide() : false;
        that.picker5 ? that.picker5.hide() : false;
        that.picker6 ? that.picker6.hide() : false;
        //						$('.mui-poppicker').remove();
        //						$('.mui-dtpicker').remove();
        //						$('.mui-backdrop').remove();
        //						pushHistory(); //出栈
      } else {
        that.picker1 ? that.picker1.dispose() : false;
        that.picker2 ? that.picker2.dispose() : false;
        that.picker3 ? that.picker3.dispose() : false;
        that.picker4 ? that.picker4.dispose() : false;
        that.picker5 ? that.picker5.dispose() : false;
        that.picker6 ? that.picker6.dispose() : false;
        if (location.href.indexOf("#") > -1) {
          tools.router.go(-2);
        } else {
          tools.router.back();
        }
      }
    },
    //在地址中注入#
    pushHistory: function() {
      this.bingBack();
      var state = {
        title: "title",
        url: "#"
      };
      window.history.pushState(state, "title", "#");
    },
    //绑定返回键
    bingBack: function() {
      var that = this;
      if (/(Android)/i.test(navigator.userAgent)) {
        // alert(_this.type);
        $(window).on("popstate", function() {
          that.backMechanism();
        });
        return;
      }
      var bool = false;
      $(window).on("popstate", function() {
        that.backMechanism();
        //					setTimeout(function() {
        //						bool = true;
        //					}, 100);
        //					if(bool) {
        //						that.backMechanism();
        //					}
      });
    }
  },
  mounted() {
    var that = this;
    that.muiPicker();
  },
  destroyed() {
    //组件销毁前
    $(window).unbind("popstate");
  }
};
</script>