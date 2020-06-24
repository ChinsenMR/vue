import wx from 'weixin-js-sdk';

export default {
	//原生或h5的分享
	appOpenShare: function(id) { //传入商品id即可
		if(this.isAppVersion() == 'android') {
			window.android.shareForH5(id)
			return true;
		}

		if(this.isAppVersion() == 'ios') {
			window.webkit.messageHandlers.shareForH5.postMessage({
				id: id,
				type: 0
			});
			return true;
		}
	},
	/* 默认图片 */
	defaultImg: function() {
		let baseimg = '~images/logo.png';
		return baseimg;
	},

	/* 判断是否为微信 */
	isWeChat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

	/* 判断是否为Android */
	isAndroid: function() {
		if(/(Android)/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		};
	},
	//页面所在平台
	isAppVersion: function() {
		if(this.isWeChat()) {
			return 'wx';
		} else {
			let version = tools.cache.get('app_version');
			if(version) {
				return version;
			} else {
				return 'pc';
			}

			//			let ua = navigator.userAgent,
			//				isWindowsPhone = /(?:Windows Phone)/.test(ua),
			//				isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
			//				isAndroid = /(?:Android)/.test(ua),
			//				isFireFox = /(?:Firefox)/.test(ua),
			//				isChrome = /(?:Chrome|CriOS)/.test(ua),
			//				isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
			//				isPhone = /(?:iPhone)/.test(ua) && !isTablet,
			//				isPc = !isPhone && !isAndroid && !isSymbian;
			//			if(isTablet) {
			//				return 'ipad';
			//			}
			//
			//			if(isPhone) {
			//				return 'ios';
			//			}
			//
			//			if(isAndroid) {
			//				return 'android';
			//			}
			//
			//			if(isPc) {
			//				return 'pc';
			//			}
			//
			//			return tools.cache.get('app_version');
		}
	},
	//支付平台判断后直接输出
	platformName: function() {
		//判断是不是微信端
		if(this.isWeChat()) {
			return 'mp';
		} else {
			return 'h5';
		}
	},
	/* 判断访问终端 */
	device: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;

		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, //是否微信
			qq: u.match(/\sQQ/i) == " qq" //是否QQ
		};
	},

	/* 微信分享 */
	wechatjs: {
		run: function(obj) {
			return;

			let data = {
				ajax_data: obj.ajax_data || {},
				api_url: obj.api_url || '/',
				api_type: obj.api_type || 'POST',
				api_list: obj.api_list || [],
				hide_menu_items: obj.hide_menu_items || [],
				show_menu_items: obj.show_menu_items || [],
				debug: obj.debug || false
			};

			// data.ajax_data['url'] = location.href.split('#')[0];

			data.api_list.push('hideMenuItems');
			data.api_list.push('showMenuItems');

			//默认为分享朋友圈和好友
			data.api_list.push('onMenuShareTimeline');
			data.api_list.push('onMenuShareAppMessage');

			//微信js配置
			app.wechatjs.config = app.wechatjs.config || false;
			app.wechatjs.share_config = app.wechatjs.share_config || false;

			if(app.wechatjs.config === false) {
				//获取js签名
				tools.ajax({
					url: data.api_url,
					ajaxData: data.ajax_data,
					type: data.api_type,
					successFun: function(res) {

						//全局配置
						app.wechatjs.config = {
							debug: data.debug,
							appId: res.data.sign.appId,
							timestamp: res.data.sign.timestamp,
							nonceStr: res.data.sign.nonceStr,
							signature: res.data.sign.signature,
							jsApiList: data.api_list
						};

						wx.config(app.wechatjs.config);

						wx.ready(function() {

							if(app.wechatjs.share_config !== false) {
								// 分享到朋友圈
								wx.onMenuShareTimeline({
									title: app.wechatjs.share_config.share_title, // 分享标题
									link: app.wechatjs.share_config.share_url, // 分享链接
									imgUrl: app.wechatjs.share_config.share_img, // 分享图标
									success: function() {
										// 用户确认分享后执行的回调函数
									},
									cancel: function() {
										// 用户取消分享后执行的回调函数
									}
								});

								// 分享给朋友
								wx.onMenuShareAppMessage({
									title: app.wechatjs.share_config.share_title, // 分享标题
									desc: app.wechatjs.share_config.share_desc, // 分享描述
									link: app.wechatjs.share_config.share_url, // 分享链接
									imgUrl: app.wechatjs.share_config.share_img, // 分享图标
									type: 'link', // 分享类型,music、video或link，不填默认为link
									dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
									success: function() {
										// 用户确认分享后执行的回调函数
									},
									cancel: function() {
										// 用户取消分享后执行的回调函数
									}
								});

								wx.hideMenuItems({
									menuList: data.hide_menu_items // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
								});

								wx.showMenuItems({
									menuList: data.show_menu_items // 要显示的菜单项
								});

								//注册微信播放录音结束事件
								// wx.onVoicePlayEnd({
								//     success: function (res) {
								//         stopWave();
								//     }
								// });

							}
						});
					}
				});
			}
		},
		ready: function(obj) {
			wx.ready(function() {
				//debugger
				//alert(app.wechatjs.share_config.share_url)
				if(app.wechatjs.share_config !== false) {
					// 分享到朋友圈
					wx.onMenuShareTimeline({
						title: obj.share_title, // 分享标题
						link: obj.share_url, // 分享链接
						imgUrl: obj.share_img || app.defaultImg(), // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					// 分享给朋友
					wx.onMenuShareAppMessage({
						title: obj.share_title, // 分享标题
						desc: obj.share_desc, // 分享描述
						link: obj.share_url, // 分享链接
						imgUrl: obj.share_img || app.defaultImg(), // 分享图标
						type: 'link', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
				}
			});
			wx.error(function(res) {
				tools.alert.error(res);
				//              location.href = location.href;
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			});
		}
	},

	/* 克隆对象 */
	extend: function(origin) {
		let originProto = Object.getPrototypeOf(origin);
		return Object.assign(Object.create(originProto), origin);
	},

	/* 查看大图 */
	seeImg: function(curSrc, srcList) {
		if(!curSrc || !srcList || srcList.length == 0) {
			return;
		}

		if(this.isWeChat()) {
			wx.previewImage({
				'current': curSrc,
				'urls': srcList
			});
		} else {

		}

	},

	/* 是否数组 */
	isArray: function isArray(args) {
		return Object.prototype.toString.call(args) === "[object Array]"
	},

	/* cookie */
	cookie: {
		/* 获取 */
		get: function(name) {
			var arr = document.cookie.split('; ');
			var i = 0;
			for(i = 0; i < arr.length; i++) {

				var arr2 = arr[i].split('=');

				if(arr2[1] !== "" && arr2[0] === name) {
					return decodeURIComponent(arr2[1]);
				}
			}
		},

		/* 保存 */
		set: function(name, value, iDay) {
			var oDate = new Date();

			oDate.setDate(oDate.getDate() + iDay);

			document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + oDate + ';path=/';
		},

		/* 删除 */
		del: function(name) {
			this.set(name, "", -1);
		}
	}
}