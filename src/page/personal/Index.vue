<template>
  <div>
   
      <div class="f40 p20 bg-gray6 text-center mt20" @click.stop="logout">退出登陆</div>
    </div>

  
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
      
    };
  },
  methods: {
    logout(){
       tools.request.Logout({}, r => {
         tools.cache.del('IS_USER');
         tools.alert.success('已登出，即将刷新页面')
         setTimeout(() => {
           location.reload();
         }, 1000)
      });
    }
  },
watch: {
  
  },
  components: { basePicker },
  filters: {},
  mounted() {
       tools.request.getUserDetail({a: 11}, res => {

     })
  }
};
</script>
