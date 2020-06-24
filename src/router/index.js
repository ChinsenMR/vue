//基本路由 
export default {
     'authorization': resolve => require(['../page/Authorization.vue'], resolve),
     'index': resolve => require(['../page/Index.vue'], resolve),
     'login': resolve => require(['../page/Login.vue'], resolve),
     'personal/index': resolve => require(['../page/personal/Index.vue'], resolve),
     'register': resolve => require(['../page/Register.vue'], resolve),
     'savedata/index': resolve => require(['../page/saveData/Index.vue'], resolve),
     'savedata/test': resolve => require(['../page/saveData/Test.vue'], resolve),
     'showphotos/index': resolve => require(['../page/showPhotos/Index.vue'], resolve),
     'showphotos/test': resolve => require(['../page/showPhotos/Test.vue'], resolve),

       //首页
      '/': resolve => require(['../page/Index.vue'], resolve)
}