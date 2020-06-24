<template>
  <div
    page="index"
    :style="`height: ${height}px;background: url(${image})center center / cover no-repeat`"
  >
    <div class="animate-wrap"></div>
    <button class="f40 bg-orange padding-20" @click="toUrl('/authorization')">主动授权</button>
    <button class="f40 padding-20 bg-red" @click="toUrl('/showPhotos/test')">测试未登录并授权</button>
    <button class="f40 padding-20 bg-blue" @click="toUrl('/saveData/index')">常规页面</button>
    <button class="f40 padding-20 bg-gray6" @click="toUrl('/personal/index')">个人中心</button>
    <button class="f40 padding-20 bg-gray6" @click="clearStatus()">清除所有状态</button>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
@import "../assets/sass/index.scss";
</style>    
<script>
export default {
  data() {
    tools.title.set("首页");

    return {
      height: window.innerHeight,
      image: this.includeImage("404.jpg")
    };
  },
  methods: {
    getCityRankingList() {
      tools.request.getCityRankingList({ a: 1 }, res => {
        console.log(res);
      });
    },
    clearStatus() {
      tools.cache.del("SESSION");
      tools.cache.del("IS_USER");
      tools.cache.del("IS_AUTH");
      tools.cache.del("CODE");
      tools.alert.success("已清除");
      location.reload();
    }
  },
  watch: {},
  components: {},
  filters: {},
  mounted() {
    this.getCityRankingList();
  }
};
</script>
