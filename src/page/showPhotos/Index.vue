<template>
  <div page="wrapper" :style="`height:${height}px `">
    <div class="swiper-wrap" :class="{'show-swiper': showSwiper}"  @touchstart="touchStart" @touchmove="touchMove">
      <div class="close-swiper" @click="showSwiper = false;" v-if="showSwiper"></div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide flex-content-center">
            <img src="https://nissanxk.aiitec.net/h5-nissan/static/images/j1.png" style="width: 100%;height: auto;">
          </div>
          <div class="swiper-slide flex-content-center">
            <img src="https://nissanxk.aiitec.net/h5-nissan/static/images/j2.png" style="width: 100%;height: auto;">
          </div>
          <div class="swiper-slide flex-content-center">
            <img src="https://nissanxk.aiitec.net/h5-nissan/static/images/j3.png" style="width: 100%;height: auto;">
          </div>
        </div>

        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->

        <!-- 如果需要滚动条 -->
        <div class="swiper-scrollbar"></div>
      </div>
    </div>
    <!-- <div class="scroll-filter" v-if="showFilter"></div> -->
    <div class="big-filter" @touchmove.prevent v-if="!is_show"></div>
    <div id="info" page="info">
      <div class="photo-wrap">
        <div class="cover">
          <!-- <div class="light"></div> -->
          <!-- 左按钮 -->
          <div
            class="prew"
            :class="{'leave-l': thisIndex > 0 && thisIndex !== undefined}"
            @click="reScalse(thisIndex - 1, true)"
          ></div>
          <!-- 右按钮 -->
          <div
            class="next"
            :class="{'leave-r': thisIndex < imageList.length - 1 && thisIndex !== undefined}"
            @click="reScalse(thisIndex + 1, true)"
          ></div>
          <!-- 底部的牌 -->
          <div
            class="tag"
            :class="{'leave-t': thisIndex !== undefined}"
            @click="toUrl('/cityInfo/index')"
          ></div>
          <!--start 图片展示部分 -->
          <div
            class="photo-item"
            v-for="(item, index) in imageList"
            :key="index"
            :class="`chan${thisIndex == index ? index + 1 : ''}`"
            :style="`left: ${pxToRem(index * 750)};background: url(${item.link})center center / 100% 100%  no-repeat`"
          >
            <div class="box">
              <!-- 遮罩层 -->
              <div
                class="filter"
                @click="reScalse(undefined)"
                v-if="thisIndex == index"
                @touchmove.prevent
              ></div>
              <div
                @touchmove.prevent
                class="photo"
                :class="`pos-${index}`"
                style="background: url(/static/images/j1.png)center center / cover no-repeat"
                @click="reScalse(index)"
              >
                <div class="cont">
                  <div class="city-name">{{item.cityName}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- end 图片展示部分-->
        </div>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
@import "../../assets/sass/showPhotos/index.scss";
@import "../../../static/swiper/swiper.min.css";
</style>
<script>
// import pciker from '@components/'
import "./js/roll.js";
import "../../../static/swiper/swiper.min.js";
export default {
  data() {
    return {
      is_show: false,
      height: window.innerHeight,
      thisIndex: undefined,
      imageArr: [1, 2, 3, 4, 5, 6, 7],
      showSwiper: false,
      swiperList: [],
      imageList: [
        {
          link: "/static/picture/cover_01.png",
          left: 750,
          top: 50,
          cityName: "广州"
        },
        {
          link: "/static/picture/cover_02.png",
          left: 750,
          top: 50,
          cityName: "武汉"
        },
        {
          link: "/static/picture/cover_03.png",
          left: 750,
          top: 50,
          cityName: "深圳"
        },
        {
          link: "/static/picture/cover_04.png",
          left: 750,
          top: 50,
          cityName: "北京"
        },
        {
          link: "/static/picture/cover_05.png",
          left: 750,
          top: 50,
          cityName: "西安"
        },
        {
          link: "/static/picture/cover_06.png",
          left: 750,
          top: 50,
          cityName: "安庆"
        },
        {
          link: "/static/picture/cover_07.png",
          left: 750,
          top: 50,
          cityName: "汕头"
        },
        {
          link: "/static/picture/cover_08.png",
          left: 750,
          top: 50,
          cityName: "汕头"
        },
        {
          link: "/static/picture/cover_09.png",
          left: 750,
          top: 50,
          cityName: "汕头"
        },
        {
          link: "/static/picture/cover_10.png",
          left: 750,
          top: 50,
          cityName: "汕头"
        }
      ]
    };
  },
  methods: {
    pxToRem(px) {``
      let prop = 75.0;
      return (Number(px) / prop) * 1 + "rem";
    },
    onScroll(s, t) {
      //匀速滚动<br>function scroll(s,t){
      let sp = 10; //也可根据当前scrollTop动态改变sp的值，从而实现加速和减速滚动的效果
      let cont = Number.parseInt(t / sp);
      let oneLong = s / cont;
      let timer = setInterval(() => {
        console.log(cont);
        if (cont > 0) {
          cont--;
          window.scrollBy(0, oneLong);
        } else {
          clearInterval(timer);
        }
      }, sp);
    },
    touchStart(e){
      console.log(e)
    },
     touchMove(e){
      console.log(e)
    },
    reScalse(idx, handle) {
      // console.log(idx, 22);
      let that = this;
      if (idx != undefined) {
        that.is_show = false;
      }

      if (handle) {
        that.thisIndex = undefined;
        setTimeout(() => { 
          next();
        }, 500);
      } else {
        next();
      }

      function next() {
        if (idx !== undefined) {
          let scrollNum = Number(idx) * window.innerWidth;
          let beforeScrollNum = $("#info").scrollLeft();
          let num = 0;
          let slider = 0;
          let timer1 = null;
          let timer2 = null;

          $("#info").scrollLeft(beforeScrollNum);

          if (beforeScrollNum > scrollNum) {
            slider = beforeScrollNum - scrollNum;
            timer1 = setInterval(() => {
              if (num < slider) {
                num += 2;
                $("#info").scrollLeft(beforeScrollNum - num);
              } else {
                that.thisIndex = idx;
                that.is_show = true;
                clearInterval(timer1);
              }
            }, 1);
          } else {
            slider = scrollNum - beforeScrollNum;

            timer2 = setInterval(() => {
              if (num < slider) {
                num += 2;
                $("#info").scrollLeft(beforeScrollNum + num);
              } else {
                that.thisIndex = idx;
                that.is_show = true;
                clearInterval(timer2);
              }
            }, 1);
          }

          // $("#info").scrollLeft(scrollNum);
        } else {
          that.thisIndex = undefined;
        }
      }

      if (that.thisIndex != undefined && !this.is_show) {
        this.showSwiper = true;
      }
      console.log(that.thisIndex, this.is_show, "index");
    },
    initSwiper() {
      var mySwiper = new Swiper(".swiper-container", {
        // effect: "fade",
        // direction: '',
        autoplay: false,
        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination"
        }
      });
    },
    bindScroll() {
      let ele = $("#info");
      let num = 6750;
      let timer = null;
      // tools.alert.loading();
      // this.is_show = true;
      //  $("#info").animate({ opacity: 1 });
      // $("#info").scrollLeft(0);
      // return;
      $("#info").animate({ opacity: 1 }, 2000);
      timer = setInterval(() => {
        if (num > 0) {
          num -= 50;

          tools.alert.closeLoading();
          $("#info").scrollLeft(num);
        } else {
          clearInterval(timer);
          this.is_show = true;
        }
      }, 40);

      ele.on("scroll", function(e) {
        let left = $(this).scrollLeft();
        if (left > 1000) {
          // $(this).scrollLeft(0);
        }
      });
    }
  },
  watch: {},
  components: {},
  filters: {},
  mounted() {
    // setTimeout(() => {
    // this.is_show = true;
    this.initSwiper();
    this.bindScroll();
    // }, 1000);
  }
};
</script>
