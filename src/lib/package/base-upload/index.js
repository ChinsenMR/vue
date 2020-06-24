import baseUpload from './src/upload.vue';

baseUpload.install = function (Vue) {
    Vue.component(baseUpload.name, baseUpload);
};

export default baseUpload;
