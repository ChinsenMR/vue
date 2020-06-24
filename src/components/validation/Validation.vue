<template>
	<div i="components-validation"></div>
</template>
<style rel="stylesheet/scss" lang="scss">
	.components-validation-active {
		background-color: #EDEDED !important;
		color: #AAAAAA;
	}
</style>
<script>
	export default {
		data() {
			return {
				is_send: false,
				domObj: undefined,
				time: 60
			};
		},
		components: {},
		props: ["request", "dom", "butClick"],
		watch: {	
			is_send(val) {
				if(val) {
					if(this.butClick != undefined) {
						this.$emit('update:butClick', val);
					}
					this.domObj.addClass('components-validation-active');
				} else {
					this.domObj.removeClass('components-validation-active');
				}
			}
		},
		computed: {},
		methods: {
			//发送验证码
			send: function() {
				var _this = this;
				if(_this.is_send) { //正在倒计时
					return;
				}
				
				//用户传手机才去验证
				
				if(this.request.hasOwnProperty('phone')) {
					if(this.request.phone == '') {
						tools.alert.error('请输入手机号码');
						return;
					}

					var pattern = /^(0)?1[3|4|5|6|7|8|9]([0-9]){9}$/;
					if(!pattern.test(this.request.phone)) {
						tools.alert.error('请输入正确手机号码');
						return;
					}
				}
				
				//用户传邮箱才去验证
				if(this.request.hasOwnProperty('email')) {
					if(this.request.email == '') {
						tools.alert.error('请输入邮箱');
						return;
					}

					var pattern = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
					if(!pattern.test(this.request.email)) {
						tools.alert.error('请输入正确邮箱');
						return;
					}
				}
				
				//url必传
				if(!this.request.url || this.request.url == '') {
					console.error('请给请求地址');
					return;
				}

				_this.countdown();

				tools.alert.loading();
				tools.ajax({
					url: this.request.url,
					type: this.request.type || 'GET',
					ajaxData: {
						phone: this.request.phone||undefined,
						email:this.request.email||undefined
					},
					successFun: function(res) {
						tools.alert.closeLoading();
						tools.alert.success('发送成功！');
					},
					errorFun: function(error_data, status, headers, error_obj) {
						_this.is_send = false;
						tools.alert.error(error_data.error_msg);
						tools.alert.closeLoading();
					}
				});
			},
			//倒计时
			countdown() {
				var _this = this;
				_this.is_send = true;
				var x = this.time;
				var time = setInterval(function() {
					if(x > 0 && _this.is_send) {
						x--;
						_this.domObj.text('重新获取(' + x + ')'); //输出数字
					} else {
						clearInterval(time);
						_this.is_send = false;
						_this.domObj.text('重新获取');
					}
				}, 1000)
			}
		},
		mounted() {
			var that = this;
			this.domObj = $(this.dom);
			this.domObj.on('click', function() {
				that.send();
			});
		}
	};
</script>