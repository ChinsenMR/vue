<template>
  <div id="app" :i="i" :style="`min-height: ${height}px`">
    <!-- <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight" tag="div"> -->
      <router-view></router-view>
    <!-- </v-touch> -->
  </div>
</template>

<script>
import "./mixin";
export default {
  data() {
    return {
      i: this.iFun(),
      height: 554
    };
  },
  name: "app",
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "isLinkChange"
  },
  created() {},
  methods: {
    onSwipeLeft() {
      window.history.go(-1);
    },
    onSwipeRight() {
      window.history.go(1);
    },
    isLinkChange: function() {
      let that = this;
      console.log('改变了导航:',this.$route);

      that.i = that.iFun();
      that.height = document.documentElement.clientHeight;

      that.isPath();
    },

    isPath() {
      //不存在自动跳转到404页面
      if (this.$route.matched.length < 1) {
        tools.router.replace("/404");
        return false;
      }
    },

    iFun() {
      let i = this.$route.path.replace(/\//g, "_");
      if (i.indexOf("_") === 0) {
        i = i.replace("_", "");
      }
      return i === "" ? "index" : i;
    },

    initWechat() {
      let that = this;

      tools.router.afterEach((to, from, next) => {
        setTimeout(() => {
          let desc = "这是首页描述",
            title = "这是首页";
          // ios
          if (
            app.device().ios &&
            app.isWeChat() &&
            that.$store.state.app.is_wxjs
          ) {
            that.wxShare({
              title: title,
              url: `${location.origin}${config.base ? config.base : "/"}`,
              desc: desc,
              img: that.$store.state.app.logo,
              ajax_data: {
                url: tools.cache.get("initUrl")
              }
            });
          }
          // Android
          if (
            app.isAndroid() &&
            app.isWeChat() &&
            that.$store.state.app.is_wxjs
          ) {
            that.wxShare({
              title: title,
              url: `${location.origin}${config.base ? config.base : "/"}`,
              desc: desc,
              img: that.$store.state.app.logo,
              ajax_data: {
                url: location.href
              }
            });
          }
        }, 500);
      });
    }
  },
  mounted() {
    let that = this;
    that.initWechat()
  }
};
</script>

<style>
</style>
