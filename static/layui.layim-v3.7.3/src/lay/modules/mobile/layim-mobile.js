/**

 @Name：layim mobile 2.1.0
 @Author：贤心
 @Site：http://layim.layui.com
 @License：LGPL
    
 */

layui.define(['laytpl', 'upload-mobile', 'layer-mobile', 'zepto'], function(exports) {
  
      var v = '2.1.0';
      var $ = layui.zepto;
      var laytpl = layui.laytpl;
      var layer = layui['layer-mobile'];
      var upload = layui['upload-mobile'];
      var device = layui.device();
  
      var SHOW = 'layui-show',
          THIS = 'layim-this',
          MAX_ITEM = 20;
  
      //回调
      var call = {};
  
      //对外API
      var LAYIM = function() {
          this.v = v;
          touch($('body'), '*[layim-event]', function(e) {
              var othis = $(this),
                  methid = othis.attr('layim-event');
              events[methid] ? events[methid].call(this, othis, e, 11) : '';
          });
      };
  
      //避免tochmove触发touchend
      var touch = function(obj, child, fn) {
          var move, type = typeof child === 'function',
              end = function(e) {
                  var othis = $(this);
                  if (othis.data('lock')) {
                      return;
                  }
                  move || fn.call(this, e);
                  move = false;
                  othis.data('lock', 'true');
                  setTimeout(function() {
                      othis.removeAttr('data-lock');
                  }, othis.data('locktime') || 0);
              };
          if (type) {
              fn = child;
          }
          obj = typeof obj === 'string' ? $(obj) : obj;
          if (!isTouch) {
              if (type) {
                  obj.on('click', end);
              } else {
                  obj.on('click', child, end);
              }
              return;
          }
  
          if (type) {
              obj.on('touchmove', function() {
                  move = true;
              }).on('touchend', end);
          } else {
              obj.on('touchmove', child, function() {
                  move = true;
              }).on('touchend', child, end);
          }
      };
  
      //是否支持Touch
      var isTouch = /Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(navigator.userAgent);
  
      //底部弹出
      layer.popBottom = function(options) {
          layer.close(layer.popBottom.index);
          layer.popBottom.index = layer.open($.extend({
              type: 1,
              content: options.content || '',
              shade: true,
              shadeClose: true,
              className: 'layim-layer'
          }, options));
      };
  
      //解绑events的事件
      LAYIM.prototype.offEvents = function(content) {
          $('body').off('touchend', '*[layim-event]').off('touchmove', '*[layim-event]').off('click', '*[layim-event]');
          touch($('body'), '*[layim-event]', function(e) {
              var othis = $(this),
                  methid = othis.attr('layim-event');
              events[methid] ? events[methid].call(this, othis, e) : '';
          });
          call = {};
      };
  
      //基础配置
      LAYIM.prototype.config = function(options) {
          options = options || {};
          options = $.extend({
              title: "localStorage.to_name",
              isgroup: 0,
              isNewFriend: !0,
              voice: 'default.mp3',
              chatTitleColor: '#36373C'
          }, options);
          init(options);
      };
  
      //监听事件
      LAYIM.prototype.on = function(events, callback) {
          if (typeof callback === 'function') {
              call[events] ? call[events].push(callback) : call[events] = [callback];
          }
          return this;
      };
  
      //打开一个自定义的会话界面
      LAYIM.prototype.chat = function(data) {
          if (!window.JSON || !window.JSON.parse) return;
          return popchat(data, -1), this;
      };
  
      //打开一个自定义面板
      LAYIM.prototype.panel = function(options) {
          return popPanel(options);
      };
  
      //获取所有缓存数据
      LAYIM.prototype.cache = function() {
          return cache;
      };
  
      //接受消息
      LAYIM.prototype.getMessage = function(data) {
          return getMessage(data), this;
      };
  
      //添加好友/群
      LAYIM.prototype.addList = function(data) {
          return addList(data), this;
      };
  
      //删除好友/群
      LAYIM.prototype.removeList = function(data) {
          return removeList(data), this;
      };
  
      //设置好友在线/离线状态
      LAYIM.prototype.setFriendStatus = function(id, type) {
          var list = $('.layim-friend' + id);
          list[type === 'online' ? 'removeClass' : 'addClass']('layim-list-gray');
      };
  
      //设置当前会话状态
      LAYIM.prototype.setChatStatus = function(str) {
          var thatChat = thisChat(),
              status = thatChat.elem.find('.layim-chat-status');
          return status.html(str), this;
      };
  
      //标记新动态
      LAYIM.prototype.showNew = function(alias, show) {
          showNew(alias, show);
      };
  
      //解析聊天内容
      LAYIM.prototype.content = function(content) {
          return layui.data.content(content);
      };
  
      //插入图片
      LAYIM.prototype.insertImg = function(content, cb) {
         
          
          var thatChat = thisChat();
          var To = thatChat.data;
          focusInsert($('.input_div'), 'img[' + (content || '') + ']', true);
          sendMessage(2);
          if (cb) {
              cb(To);
          }
      };
  
      //插入视频
      LAYIM.prototype.insertVideo = function(content, cid, cb) {
        //   debugger
          var thatChat = thisChat();
          var To = thatChat.data;
        //   debugger
          focusInsert($('.input_div'), 'video[' + (content || '') + ']', true);
          sendMessage(3, cid);
          if (cb) {
              cb(To);
          }
      };
  
      //插入商品
      LAYIM.prototype.insertGoods = function(content, cb) {
          var thatChat = thisChat();
          var To = thatChat.data;
          focusInsert(thatChat.textarea[0], JSON.stringify(content), true);
          sendMessage(4);
          if (cb) {
              cb(To);
          }
      };
  
      //插入订单
      LAYIM.prototype.insertOrder = function(content, cb) {
          var thatChat = thisChat();
          var To = thatChat.data;
          focusInsert(thatChat.textarea[0], JSON.stringify(content), true);
          sendMessage(5);
          if (cb) {
              cb(To);
          }
      };
  
      //插入快捷回复
      LAYIM.prototype.insertQuickReply = function(content) {
          var thatChat = thisChat();
          focusInsert(thatChat.textarea[0], content || '', true);
          sendMessage(1);
      };
  
      //从聊天界面返回
      LAYIM.prototype.backToMain = function(othis) {       
          events.back(othis);
      };
      
    //重新渲染聊天面板
    LAYIM.prototype.reRender = function(content) {
        var thatChat = thisChat();
        viewChatlog();
    };
    LAYIM.prototype.chatlog = function(content) {
    };
    //重新渲染聊天面板
    LAYIM.prototype.chattt = function(obj) {
        events.chat(obj);
    };
  
      //列表内容模板
      var listTpl = function(options) {
          var nodata = {
              friend: "该分组下暂无好友",
              group: "暂无群组",
              history: "暂无任何消息"
          };
  
          options = options || {};
  
          //如果是历史记录，则读取排序好的数据
          if (options.type === 'history') {
              options.item = options.item || 'd.sortHistory';
          }
  
          return ['{{# var length = 0; layui.each(' + options.item + ', function(i, data){ length++; }}', '<li layim-event="chat" data-type="' + options.type + '" data-index="' + (options.index ? '{{' + options.index + '}}' : (options.type === 'history' ? '{{data.type}}' : options.type) + '{{data.id}}') + '" class="layim-' + (options.type === 'history' ? '{{data.type}}' : options.type) + '{{data.id}} {{ data.status === "offline" ? "layim-list-gray" : "" }}"><div><img class="emoji" src="{{data.avatar}}"></div><span>{{ data.username||data.groupname||data.name||"佚名" }}</span><p><span class="status"></span><span class="con">{{ data.remark||data.sign||"" }}</span></p><span class="layim-msg-status">new</span></li>', '{{# }); if(length === 0){ }}', '<li class="layim-null">' + (nodata[options.type] || "暂无数据") + '</li>', '{{# } }}'].join('');
      };
  
      //公共面板
      var comTpl = function(tpl, anim, back) {
          return ['<div class="layim-panel' + (anim ? ' layui-m-anim-left' : '') + '">', '<div class="layim-title" style="background-color: {{d.base.chatTitleColor}};">', '<p>', (back ? '<i class="layui-icon layim-chat-back" layim-event="back">&#xe603;</i>' : ''), '<p style="text-align:center;">{{ d.title || d.base.title }}</p><span class="layim-chat-status"></span>', '{{# if(d.data){ }}', '{{# if(d.data.type === "group"){ }}', '<i class="layui-icon layim-chat-detail" layim-event="detail">&#xe613;</i>', '{{# } }}', '{{# } }}', '</p>', '</div>', '<div class="layui-unselect layim-content">', tpl, '</div>', '</div>'].join('');
      };
  
      //主界面模版
      var elemTpl = ['<div class="layui-layim">', '<div class="layim-tab-content layui-show">', '<ul class="layim-list-friend">', '<ul class="layui-layim-list layui-show layim-list-history">', listTpl({
          type: 'history'
      }), '</ul>', '</ul>', '</div>', '<div class="layim-tab-content">', '<ul class="layim-list-top">', '{{# if(d.base.isNewFriend){ }}', '<li layim-event="newFriend"><i class="layui-icon">&#xe654;</i>新的朋友<i class="layim-new" id="LAY_layimNewFriend"></i></li>', '{{# } if(d.base.isgroup){ }}', '<li layim-event="group"><i class="layui-icon">&#xe613;</i>群聊<i class="layim-new" id="LAY_layimNewGroup"></i></li>', '{{# } }}', '</ul>', '<ul class="layim-list-friend">', '{{# layui.each(d.friend, function(index, item){ var spread = d.local["spread"+index]; }}', '<li>', '<h5 layim-event="spread" lay-type="{{ spread }}"><i class="layui-icon">{{# if(spread === "true"){ }}&#xe61a;{{# } else {  }}&#xe602;{{# } }}</i><span>{{ item.groupname||"未命名分组"+index }}</span><em>(<cite class="layim-count"> {{ (item.list||[]).length }}</cite>)</em></h5>', '<ul class="layui-layim-list {{# if(spread === "true"){ }}', ' layui-show', '{{# } }}">', listTpl({
          type: "friend",
          item: "item.list",
          index: "index"
      }), '</ul>', '</li>', '{{# }); if(d.friend.length === 0){ }}', '<li><ul class="layui-layim-list layui-show"><li class="layim-null">暂无联系人</li></ul>', '{{# } }}', '</ul>', '</div>', '<div class="layim-tab-content">', '<ul class="layim-list-top">', '{{# layui.each(d.base.moreList, function(index, item){ }}', '<li layim-event="moreList" lay-filter="{{ item.alias }}">', '<i class="layui-icon {{item.iconClass||\"\"}}">{{item.iconUnicode||""}}</i>{{item.title}}<i class="layim-new" id="LAY_layimNew{{ item.alias }}"></i>', '</li>', '{{# }); if(!d.base.copyright){ }}', '<li layim-event="about"><i class="layui-icon">&#xe60b;</i>关于<i class="layim-new" id="LAY_layimNewAbout"></i></li>', '{{# } }}', '</ul>', '</div>', '</div>', '<ul class="layui-unselect layui-layim-tab">', '<li title="{{ d.base.newslist_name || "消息" }}" layim-event="tab" lay-type="message" class="layim-this"><i class="layui-icon">&#xe611;</i><span>{{ d.base.newslist_name || "消息" }}</span><i class="layim-new" id="LAY_layimNewMsg"></i></li>', '<li title="{{ d.base.historylist_name || "联系人" }}" layim-event="tab" lay-type="friend"><i class="layui-icon">&#xe612;</i><span>{{ d.base.historylist_name || "联系人" }}</span><i class="layim-new" id="LAY_layimNewList"></i></li>', '<li title="更多" layim-event="tab" lay-type="more"><i class="layui-icon">&#xe670;</i><span>更多</span><i class="layim-new" id="LAY_layimNewMore"></i></li>', '</ul>'].join('');
  
      //聊天主模板
      var elemChatTpl = ['<div class="layim-chat layim-chat-{{d.data.type}}">', 
                    '<div class="layim-chat-main">', '<ul></ul>', '</div>', 
                    '<div class="layim-chat-footer">', '<div class="layim-chat-send"><div class="img_wrap"></div><div class="layim-send layui-disabled" layim-event="face"><i class="iconfont icon-yuyin"></i></div><div contenteditable="true" class="input_div" type="text" autocomplete="off"></div><button class="layim-send layui-disabled" layim-event="face"><i class="iconfont icon-biaoqing2 f22"></i></button><button class="layim-send layui-disabled" style="background: green!important;color: #fff" layim-event="send"><i class="f16" style="color: #fff!important">发送</i></button></div>', 
                    '<div class="layim-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">', 
                    '<span class="layui-icon layim-tool-face" title="选择表情" layim-event="face">&#xe60c;</span>', 
                    '{{# if(d.base && d.base.uploadImage){ }}', '<span class="layui-icon layim-tool-image" title="上传图片" layim-event="image">&#xe60d;<input type="file" name="file" accept="image/*"></span>', 
                    '{{# }; }}', '{{# if(d.base && d.base.uploadFile){ }}', '<span class="layui-icon layim-tool-image" title="发送文件" layim-event="image" data-type="file">&#xe61d;<input  type="file" name="file"></span>', 
                    '{{# }; }}', '{{# layui.each(d.base.tool, function(index, item){ }}', '<span class="layui-icon  {{item.iconClass||\"\"}} layim-tool-{{item.alias}}" title="{{item.title}}" layim-event="extend" lay-filter="{{ item.alias }}">{{item.iconUnicode||""}}</span>', '{{# }); }}', '</div>', '</div>', '</div>'].join('');
  
      //补齐数位
      var digit = function(num) {
          return num < 10 ? '0' + (num | 0) : num;
      };
  
      //转换时间
      layui.data.date = function(timestamp) {
          var d = new Date(timestamp || new Date());
          return digit(d.getMonth() + 1) + '-' + digit(d.getDate()) +
              ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes());
      };
  
      //转换内容
      layui.data.content = function(content) {
        // debugger
          //支持的html标签
          var html = function(end) {
              return new RegExp('\\n*\\[' + (end || '') + '(pre|div|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
          };
          content = (content || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
              .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
              .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
  
          .replace(/face\[([^\s\[\]]+?)\]/g, function(face) { //转义表情
                  var alt = face.replace(/^face/g, '');
                  return '<img class="emoji" style="width: auto" alt="' + alt + '" title="' + alt + '" src="' + faces[alt] + '">';
              })
              .replace(/img\[([^\s]+?)\]/g, function(img) { //转义图片
                  return '<img class="layui-layim-photos" layim-event="seeimg" src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
              })
              .replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g, function(str) { //转义文件
                  var href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
                  var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
                  if (!href) return str;
                  return '<a class="layui-layim-file" href="' + href + '" download target="_blank"><i class="layui-icon">&#xe61e;</i><cite>' + (text || href) + '</cite></a>';
              })
              .replace(/audio\[([^\s]+?)\]/g, function(audio) { //转义音频
                  return '<div class="layui-unselect layui-layim-audio" layim-event="playAudio" data-src="' + audio.replace(/(^audio\[)|(\]$)/g, '') + '"><i class="layui-icon">&#xe652;</i><p>音频消息</p></div>';
              })
              .replace(/video\[([^\s]+?)\]/g, function(video) { //转义音频
                // debugger
                  return '<div class="layui-unselect layui-layim-video" layim-event="playVideo" data-src="' + video.replace(/(^video\[)|(\]$)/g, '') + '"><i class="layui-icon">&#xe652;</i></div>';
              })
  
          .replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str) { //转义链接
                  var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
                  var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
                  if (!href) return str;
                  return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
              }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
              .replace(/\n/g, '<br>') //转义换行 
          return content;
      };

      layui.data.goods_content = function(data) {
          // console.log('aaaaa ' + JSON.stringify(data.content))
          var strHTML = '<div class="layim-chat-goodsdetail" data-id="' + data.content.id + '" layim-event="getgoodsdetail"><img class="pull-left" alt="' + data.content.name + '" src="' + data.content.cover + '" ><div class="pull-left"><p><span class="name">' + data.content.name + '</span></p><p><span class="mr10">￥' + toFixedPrice(data.content.skus[0].sale_price) + '</span><span style="display: block;">市场价：¥' + toFixedPrice(data.content.skus[0].market_price) + '</span></p></div></div>';
          return strHTML;
      };
      layui.data.order_content = function(data) {
          var strHTML = '<div class="layim-chat-goodsdetail" data-id="' + data.content.id + '" layim-event="getorderdetail"><img class="pull-left" alt="' + data.content.one_goods.goods_name + '" src="' + data.content.one_goods.goods_cover + '" ><div class="pull-left"><p><span class="name">订单号：' + data.content.order_sn + '</span></p><p><span class="mr10">实付：¥' + toFixedPrice(data.content.actual_price) + '</span><span style="display: block;">总价：¥' + toFixedPrice(data.content.total_price) + '</span></p></div></div>';
          return strHTML;
      };
      var elemChatMMM = ['<li class="layim-chat-li{{ d.mine ? " layim-chat-mine" : "" }}">', '<div class="layim-chat-user"><img {{ d.mine ? "" : "userid="+d.id+" layim-event=memberinfo" }} style="background: url({{ d.avatar }})center center / cover no-repeat"><cite>', '{{ d.username||"佚名" }}', '</cite></div>', '<div class="layim-chat-text" msg-id="{{ d.cid }}">{{ d.content }}</div>', '</li>'].join('');
      var elemChatMain = ['<li class="layim-chat-li{{ d.mine ? " layim-chat-mine" : "" }}">', '<div class="layim-chat-user"><img {{ d.mine ? "" : "userid="+d.id+" layim-event=memberinfo" }} style="background: url({{ d.avatar }})center center / cover no-repeat"><cite>', '{{ d.username||"佚名" }}', '</cite></div>', '<div class="layim-chat-text" msg-id="{{ d.cid }}">{{ layui.data.content(d.content||"&nbsp;") }}</div>', '</li>'].join('');
      var elemChatGoods = ['<li class="layim-chat-li{{ d.mine ? " layim-chat-mine" : "" }}">', '<div class="layim-chat-user"><img {{ d.mine ? "" : "userid="+d.id+" layim-event=memberinfo" }} style="background: url({{ d.avatar }})center center / cover no-repeat"><cite>', '{{ d.username||"佚名" }}', '</cite></div>', '<div class="layim-chat-text">{{ layui.data.goods_content(d) }}</div>', '</li>'].join('');
      var elemChatOrder = ['<li class="layim-chat-li{{ d.mine ? " layim-chat-mine" : "" }}">', '<div class="layim-chat-user"><img {{ d.mine ? "" : "userid="+d.id+" layim-event=memberinfo" }} style="background: url({{ d.avatar }})center center / cover no-repeat"><cite>', '{{ d.username||"佚名" }}', '</cite></div>', '<div class="layim-chat-text">{{ layui.data.order_content(d) }}</div>', '</li>'].join('');
      //处理初始化信息
      var cache = { message: {}, chat: [] },
          init = function(options) {
              var init = options.init || {}
              mine = init.mine || {}, local = layui.data('layim-mobile')[mine.id] || {}, obj = {
                  base: options,
                  local: local,
                  mine: mine,
                  history: local.history || []
              }, create = function(data) {
                  var mine = data.mine || {};
                  var local = layui.data('layim-mobile')[mine.id] || {},
                      obj = {
                          base: options //基础配置信息
                              ,
                          local: local //本地数据
                              ,
                          mine: mine //我的用户信息
                              ,
                          friend: data.friend || [] //联系人信息
                              ,
                          group: data.group || [] //群组信息
                              ,
                          history: local.history || [] //历史会话信息
                      };
                  obj.sortHistory = sort(obj.history, 'historyTime');
                  cache = $.extend(cache, obj);
                  popim(laytpl(comTpl(elemTpl)).render(obj));
                  layui.each(call.ready, function(index, item) {
                      item && item(obj);
                  });
              };
              cache = $.extend(cache, obj);
              if (options.brief) {
                  return layui.each(call.ready, function(index, item) {
                      item && item(obj);
                  });
              };
              create(init)
          };
  
      //显示好友列表面板
      var layimMain, popim = function(content) {
          return layer.open({
              type: 1,
              shade: false,
              shadeClose: false,
              anim: -1,
              content: content,
              success: function(elem) {
                  layimMain = $(elem);
                  fixIosScroll(layimMain.find('.layui-layim'));
                  if (cache.base.tabIndex) {
                      events.tab($('.layui-layim-tab>li').eq(cache.base.tabIndex));
                  }
              }
          });
      };
  
      //弹出公共面板
      var popPanel = function(options, anim) {
          options = options || {};
  
          var data = $.extend({}, cache, {
              title: options.title || '',
              data: options.data
          });
  
          return layer.open({
              type: 1,
              shade: false,
              shadeClose: false,
              anim: -1,
              content: laytpl(comTpl(options.tpl, anim === -1 ? false : true, true)).render(data),
              success: function(elem) {
                  var othis = $(elem);
                  othis.prev().find('.layim-panel').addClass('layui-m-anim-lout');
                  if (data.data && data.data.type == 'kefu') {
                      othis.attr('iskefu', true);
                  }
                  options.success && options.success(elem);
                  options.isChat || fixIosScroll(othis.find('.layim-content'));
              },
              end: options.end
          });
      }
      
      //输入框焦点位置
      var focusPos = 0;
      //显示聊天面板
      var layimChat, layimMin, To = {},
          popchat = function(data, anim, back) {
              data = data || {};
  
            //   if (!data.id) {
            //       return layer.msg('非法用户');
            //   }
  
              layer.close(popchat.index);
  
              return popchat.index = popPanel({
                  tpl: elemChatTpl,
                  data: data,
                  title: data.name,
                  isChat: !0,
                  success: function(elem) {
                      layimChat = $(elem);
  
                      hotkeySend();
                      viewChatlog();
                      delete cache.message[data.type + data.id]; //剔除缓存消息
                      showNew('Msg');
  
                      //聊天窗口的切换监听
                      var thatChat = thisChat(),
                          chatMain = thatChat.elem.find('.layim-chat-main');
                      layui.each(call.chatChange, function(index, item) {
                          item && item(thatChat);
                      });
  
                      fixIosScroll(chatMain);
                      
                      $('.input_div').get(0).addEventListener('focus',function(e){
                          let html = this.innerHTML;
                          console.log($('.input_div').html())
                        //   console.log(e)
                        // console.log('.input_div  focus')
                        var selection = getSelection();
                        focusPos = selection.focusOffset;
                        console.log('.focusPos  ' + focusPos)
                        // console.log(e)
                        // alert('.focusPos  ' + focusPos)
                    });
                    $('.input_div').get(0).addEventListener('keyup',function(e){
                        console.log('.input_div  keyup')
                        var selection = getSelection();
                        focusPos = selection.focusOffset;
                        console.log('.focusPos  ' + focusPos)
                    });
                    $('.input_div').get(0).addEventListener('mouseup',function(e){
                        console.log('.input_div  mouseup')
                        var selection = getSelection();
                        focusPos = selection.focusOffset;
                        console.log('.focusPos  ' + focusPos)
                    });
                      //输入框获取焦点
                      thatChat.textarea.on('focus', function() {
                        //   
                          setTimeout(function() {
                              chatMain.scrollTop(chatMain[0].scrollHeight + 1500);
                          }, 500);
                      });
                  },
                  end: function() {
                      layimChat = null;
                      sendMessage.time = 0;
                  }
              }, anim);
  
          };
  
      //修复IOS设备在边界引发无法滚动的问题
      var fixIosScroll = function(othis) {
          if (device.ios) {
              othis.on('touchmove', function(e) {
                  var top = othis.scrollTop();
                  if (top <= 0) {
                      othis.scrollTop(1);
                      e.preventDefault(e);
                  }
                  if (this.scrollHeight - top - othis.height() <= 0) {
                      othis.scrollTop(othis.scrollTop() - 1);
                      e.preventDefault(e);
                  }
              });
          }
      };
  
  
      //价格转换：分->元
      var toFixedPrice = function(value) {
          return value ? (parseInt(value) / 100).toFixed(2) : '0';
      };
  
      //同步置灰状态
      var syncGray = function(data) {
          $('.layim-' + data.type + data.id).each(function() {
              if ($(this).hasClass('layim-list-gray')) {
                  layui.layim.setFriendStatus(data.id, 'offline');
              }
          });
      };
  
      //获取当前聊天面板
      var thisChat = function() {
          if (!layimChat) return {};
          var cont = layimChat.find('.layim-chat');
          var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
          return {
              elem: cont,
              data: to,
              textarea: cont.find('input')
          };
      };
  
      //将对象按子对象的某个key排序
      var sort = function(data, key, asc) {
          var arr = [],
              compare = function(obj1, obj2) {
                  var value1 = obj1[key];
                  var value2 = obj2[key];
                  if (value2 < value1) {
                      return -1;
                  } else if (value2 > value1) {
                      return 1;
                  } else {
                      return 0;
                  }
              };
          layui.each(data, function(index, item) {
              arr.push(item);
          });
          arr.sort(compare);
          if (asc) arr.reverse();
          return arr;
      };
  
      //记录历史会话
      var setHistory = function(data) {
          var local = layui.data('layim-mobile')[cache.mine.id] || {};
          var obj = {},
              history = local.history || {};
          var is = history[data.type + data.id];
  
          if (!layimMain) return;
  
          var historyElem = layimMain.find('.layim-list-history');
  
          data.historyTime = new Date().getTime();
  
          if (typeof(data.content) == 'object' && data.content.order_sn) {
              data.sign = data.content = '[订单]';
          } else if (data.msg_type == 2) {
              data.sign = data.content = '[图片]';
          } else if (data.msg_type == 3) {
              data.sign = data.content = '[视频]';
          } else if (data.msg_type == 4) {
              data.sign = data.content = '[商品]';
          } else {
              data.sign = data.content;
          }
          history[data.type + data.id] = data;
  
          local.history = history;
  
          layui.data('layim-mobile', {
              key: cache.mine.id,
              value: local
          });
          var msgItem = historyElem.find('.layim-' + data.type + data.id),
              msgNums = (cache.message[data.type + data.id] || []).length //未读消息数
              ,
              showMsg = function() {
                  msgItem = historyElem.find('.layim-' + data.type + data.id);
                  msgItem.find('p').children('.con').html(data.content);
                  if (msgNums > 0) {
                      msgItem.find('.layim-msg-status').html(msgNums).addClass(SHOW);
                  }
              };
  
          if (msgItem.length > 0) {
              showMsg();
              historyElem.prepend(msgItem.clone());
              msgItem.remove();
          } else {
              obj[data.type + data.id] = data;
              var historyList = laytpl(listTpl({
                  type: 'history',
                  item: 'd.data'
              })).render({ data: obj });
              historyElem.prepend(historyList);
              showMsg();
              historyElem.find('.layim-null').remove();
          }
  
          showNew('Msg');
      };
  
      //标注底部导航新动态徽章
      var showNew = function(alias, show) {
          if (!show) {
              var show;
              layui.each(cache.message, function() {
                  show = true;
                  return false;
              });
          }
          $('#LAY_layimNew' + alias)[show ? 'addClass' : 'removeClass'](SHOW);
      };
  
      //发送消息
      var sendMessage = function(msg_type, tmp_id) {
        //   debugger
          msg_type = msg_type || 1;
  
          var data = {
              // username: cache.mine ? cache.mine.username : '访客',
              username: cache.mine ? '我' : '访客',
              avatar: cache.mine ? cache.mine.avatar : (layui.cache.dir + 'css/pc/layim/skin/logo.jpg'),
              id: cache.mine ? cache.mine.id : null,
              mine: true
          };
          if(tmp_id){
              data.cid = tmp_id;
          }
          var thatChat = thisChat(),
              ul = thatChat.elem.find('.layim-chat-main ul');
          var To = thatChat.data,
              maxLength = cache.base.maxLength || 3000;
          var time = new Date().getTime(),
            //   textarea = thatChat.textarea;
            //强行覆盖，最为致命
            textarea = $('.input_div');
          To.msg_type = msg_type;
  
        //   data.content = textarea.val();
          data.content = textarea.html();
  
          if (data.content === '') return;
  
          if (data.content.length > maxLength && msg_type == 1) {
              return layer.msg('内容最长不能超过' + maxLength + '个字符');
          }
          if (time - (sendMessage.time || 0) > 60 * 1000) {
              ul.append('<li class="layim-chat-system"><span>' + layui.data.date() + '</span></li>');
              sendMessage.time = time;
          }
            // 
          if (msg_type == 4) {
              var jsonContent = JSON.parse(textarea.html());
              var filterContent = {
                  cover: '',
                  goods_sn: jsonContent.goods_sn,
                  goods_title: jsonContent.goods_title,
                  id: jsonContent.group_id,
                  name: jsonContent.name,
                  skus: []
              };
              filterContent.skus.push({
                  sale_price: jsonContent.skus[0].sale_price,
                  market_price: jsonContent.skus[0].market_price
              });
              var defaultImg = '';
              for (var i = 0; i < jsonContent.images.length; i++) {
                  if (jsonContent.images[i].is_default) {
                      defaultImg = jsonContent.images[i].path;
                      break;
                  }
              }
              filterContent.cover = defaultImg;
              data.content = filterContent;
              ul.append(laytpl(elemChatGoods).render(data));
          } else if (msg_type == 5) {
              var jsonContent = JSON.parse(textarea.html());
              var filterContent = {
                  actual_price: jsonContent.actual_price,
                  id: jsonContent.id,
                  order_sn: jsonContent.order_sn,
                  total_price: jsonContent.total_price,
                  one_goods: {
                      goods_cover: jsonContent.goods[0].goods_cover,
                      goods_name: jsonContent.goods[0].goods_name
                  }
              };
  
              data.content = filterContent;
              ul.append(laytpl(elemChatOrder).render(data));
          } else if(msg_type == 2){
            //   
            var con = layui.data.content(data.content);
            ul.append(laytpl(elemChatMain).render(data));
          }else {
            // debugger
              // 最终在这里生成消息并发送
            
            //   let reg = /face\[*?\]/ 
            //   if(data.content.indexOf(reg) >-1){
            //       console.log('OK', )
            //   }
            //   console.log(data.content.replace(reg ,''));
            // debugger
            let tag = data.content.match(/<div(([\s\S])*?)<\/div>/) || '';
            // if(tag){
            //     for(let i = 0; i < tag.length; i ++){
            //         data.content = data.content.replace(tag[i], '');
            //     }
            // }
           
            if(msg_type == 1){
                if(data.content.match(/face[\'\"]?([^\'\"]*)[\']?/gi)){
                    let face_ =  data.content.match(/face[\'\"]?([^\'\"]*)[\']?/gi);
                    let ctx = data.content.match(/<img.*?alt.*?(?:>|\/>)/gi);
                    
                    for(let i = 0; i < ctx.length; i ++){
                        data.content = data.content.replace(ctx[i], face_[i]);
                        data.content = data.content.replace(tag[i], '');
                    }
                }
            }

              var con = layui.data.content(data.content.replace(/<div(([\s\S])*?)<\/div>/, ''));
            //   console.log(con, 'data.content')
              ul.append(laytpl(elemChatMain).render(data));
              textarea.html('');
          }
  
          var param = {
                  mine: data,
                  to: To
              },
              message = {
                  username: param.mine.username,
                  avatar: param.mine.avatar,
                  id: To.id,
                  type: To.type,
                  content: param.mine.content,
                  timestamp: time,
                  mine: true
              };
          pushChatlog(message);
          if (msg_type) {
              param.msg_type = msg_type;
          }
  
          layui.each(call.sendMessage, function(index, item) {
              item && item(param);
          });
  
          To.content = data.content;
          setHistory(To);
          chatListMore();
        //   textarea.val('');
          
          textarea.html('');
          textarea.next().addClass('layui-disabled');
      };
  
      //消息声音提醒
      var voice = function() {
          var audio = document.createElement("audio");
          audio.src = layui.cache.dir + 'css/modules/layim/voice/' + cache.base.voice;
        //   audio.play();
      };
  
      //接受消息
      var messageNew = {},
          getMessage = function(data) {
              data = data || {};
  
              var group = {},
                  thatChat = thisChat(),
                  thisData = thatChat.data || {},
                  isThisData = thisData.id == data.id && thisData.type == data.type; //是否当前打开联系人的消息
  
              data.timestamp = data.timestamp || new Date().getTime();
              // data.system || pushChatlog(data);
              if (!data.is_noread) {
                  pushChatlog(data);
              }
              messageNew = JSON.parse(JSON.stringify(data));
  
              if (cache.base.voice && !data.is_noread) {
                  voice();
              }
  
              if ((!layimChat && data.content) || !isThisData) {
                  if (cache.message[data.type + data.id]) {
                      cache.message[data.type + data.id].push(data)
                  } else {
                      cache.message[data.type + data.id] = [data];
                  }
              }
  
              //记录聊天面板队列
              var group = {};
              if (data.type === 'friend') {
                  var friend;
                  layui.each(cache.friend, function(index1, item1) {
                      layui.each(item1.list, function(index, item) {
                          if (item.id == data.id) {
                              data.type = 'friend';
                              data.name = item.username;
                              return friend = true;
                          }
                      });
                      if (friend) return true;
                  });
                  if (!friend) {
                      data.temporary = true; //临时会话
                  }
              } else if (data.type === 'group') {
                  layui.each(cache.group, function(index, item) {
                      if (item.id == data.id) {
                          data.type = 'group';
                          data.name = data.groupname = item.groupname;
                          group.avatar = item.avatar;
                          return true;
                      }
                  });
              } else {
                  data.name = data.name || data.username || data.groupname;
              }
              var newData = $.extend({}, data, {
                  avatar: group.avatar || data.avatar
              });
              if (data.type === 'group') {
                  delete newData.username;
              }
              setHistory(newData);
  
              if (!layimChat || !isThisData) return;
  
              var cont = layimChat.find('.layim-chat'),
                  ul = cont.find('.layim-chat-main ul');
  
              //系统消息
              if (data.system) {
                  ul.append('<li class="layim-chat-li layim-chat-system"><span>' + data.content + '</span></li>');
              } else if (data.is_goods) {
                  if (data.timestamp - (sendMessage.time || 0) > 60 * 1000) {
                      ul.append('<li class="layim-chat-system"><span>' + layui.data.date(data.timestamp) + '</span></li>');
                      sendMessage.time = data.timestamp;
                  }
                  ul.append(laytpl(elemChatGoods).render(data));
              } else if (data.is_order) {
                  if (data.timestamp - (sendMessage.time || 0) > 60 * 1000) {
                      ul.append('<li class="layim-chat-system"><span>' + layui.data.date(data.timestamp) + '</span></li>');
                      sendMessage.time = data.timestamp;
                  }
                  ul.append(laytpl(elemChatOrder).render(data));
              } else if (data.content.replace(/\s/g, '') !== '') {
                  if (data.timestamp - (sendMessage.time || 0) > 60 * 1000) {
                      ul.append('<li class="layim-chat-system"><span>' + layui.data.date(data.timestamp) + '</span></li>');
                      sendMessage.time = data.timestamp;
                  }
                  ul.append(laytpl(elemChatMain).render(data));
              }
              chatListMore();
          };
  
      //存储最近MAX_ITEM条聊天记录到本地
      var pushChatlog = function(message) {
          var local = layui.data('layim-mobile')[cache.mine.id] || {};
          var chatlog = local.chatlog || {};
          if (chatlog[message.type + message.id]) {
              chatlog[message.type + message.id].push(message);
              if (chatlog[message.type + message.id].length > MAX_ITEM) {
                  chatlog[message.type + message.id].shift();
              }
          } else {
              chatlog[message.type + message.id] = [message];
          }
          local.chatlog = chatlog;
          layui.data('layim-mobile', {
              key: cache.mine.id,
              value: local
          });
      };
  
      //渲染本地最新聊天记录到相应面板
      var viewChatlog = function() {
        //   debugger
          var local = layui.data('layim-mobile')[cache.mine.id] || {};
          var thatChat = thisChat(),
              chatlog = local.chatlog || {};
          var ul = thatChat.elem.find('.layim-chat-main ul');
        //   var xcvsdf = {
        //     avatar:"http://baseshop.oss-cn-shenzhen.aliyuncs.com/images/headpic/d1963a24350e6a55a9094e3c8262ada7.png",
        //     content:"face[钱] face[睡] face[抓狂] ",
        //     id:11016,
        //     img_path:"",
        //     mine:true,
        //     msg_type:1,
        //     timestamp:1521618229,
        //     username:"凌翔",
        //     video_path:"",
        //   }
          layui.each(chatlog[thatChat.data.type + thatChat.data.id], function(index, item) {
              if (new Date().getTime() > item.timestamp && item.timestamp - (sendMessage.time || 0) > 60 * 1000 && !item.system) {
                  ul.append('<li class="layim-chat-system"><span>' + layui.data.date(item.timestamp) + '</span></li>');
                  sendMessage.time = item.timestamp;
                  if (item.is_goods) {
                      ul.append(laytpl(elemChatGoods).render(item));
                  } else if (item.is_order) {
                      ul.append(laytpl(elemChatOrder).render(item));
                  } else {
                      ul.append(laytpl(elemChatMain).render(item));
                  }
              } else if (!item.system) {
                  sendMessage.time = item.timestamp;
                  if (item.is_goods) {
                      ul.append(laytpl(elemChatGoods).render(item));
                  } else if (item.is_order) {
                      ul.append(laytpl(elemChatOrder).render(item));
                  } else {
                      ul.append(laytpl(elemChatMain).render(item));
                  }
              } else if (item.system) {
                  ul.append('<li class="layim-chat-li layim-chat-system"><span>' + item.content + '</span></li>');
                  sendMessage.time = item.timestamp;
              }
  
          });
          chatListMore();
      };
  
      //添加好友或群
      var addList = function(data) {
          var obj = {},
              has, listElem = layimMain.find('.layim-list-' + data.type);
  
          if (cache[data.type]) {
              if (data.type === 'friend') {
                  layui.each(cache.friend, function(index, item) {
                      if (data.groupid == item.id) {
                          //检查好友是否已经在列表中
                          layui.each(cache.friend[index].list, function(idx, itm) {
                              if (itm.id == data.id) {
                                  return has = true
                              }
                          });
                          if (has) return layer.msg('好友 [' + (data.username || '') + '] 已经存在列表中', { anim: 6 });
                          cache.friend[index].list = cache.friend[index].list || [];
                          obj[cache.friend[index].list.length] = data;
                          data.groupIndex = index;
                          cache.friend[index].list.push(data); //在cache的friend里面也增加好友
                          return true;
                      }
                  });
              } else if (data.type === 'group') {
                  //检查群组是否已经在列表中
                  layui.each(cache.group, function(idx, itm) {
                      if (itm.id == data.id) {
                          return has = true
                      }
                  });
                  if (has) return layer.msg('您已是 [' + (data.groupname || '') + '] 的群成员', { anim: 6 });
                  obj[cache.group.length] = data;
                  cache.group.push(data);
              }
          }
  
          if (has) return;
  
          var list = laytpl(listTpl({
              type: data.type,
              item: 'd.data',
              index: data.type === 'friend' ? 'data.groupIndex' : null
          })).render({ data: obj });
  
          if (data.type === 'friend') {
              var li = listElem.children('li').eq(data.groupIndex);
              li.find('.layui-layim-list').append(list);
              li.find('.layim-count').html(cache.friend[data.groupIndex].list.length); //刷新好友数量
              //如果初始没有好友
              if (li.find('.layim-null')[0]) {
                  li.find('.layim-null').remove();
              }
          } else if (data.type === 'group') {
              listElem.append(list);
              //如果初始没有群组
              if (listElem.find('.layim-null')[0]) {
                  listElem.find('.layim-null').remove();
              }
          }
      };
  
      //移出好友或群
      var removeList = function(data) {
          var listElem = layimMain.find('.layim-list-' + data.type);
          var obj = {};
          if (cache[data.type]) {
              if (data.type === 'friend') {
                  layui.each(cache.friend, function(index1, item1) {
                      layui.each(item1.list, function(index, item) {
                          if (data.id == item.id) {
                              var li = listElem.children('li').eq(index1);
                              var list = li.find('.layui-layim-list').children('li');
                              li.find('.layui-layim-list').children('li').eq(index).remove();
                              cache.friend[index1].list.splice(index, 1); //从cache的friend里面也删除掉好友
                              li.find('.layim-count').html(cache.friend[index1].list.length); //刷新好友数量  
                              //如果一个好友都没了
                              if (cache.friend[index1].list.length === 0) {
                                  li.find('.layui-layim-list').html('<li class="layim-null">该分组下已无好友了</li>');
                              }
                              return true;
                          }
                      });
                  });
              } else if (data.type === 'group') {
                  layui.each(cache.group, function(index, item) {
                      if (data.id == item.id) {
                          listElem.children('li').eq(index).remove();
                          cache.group.splice(index, 1); //从cache的group里面也删除掉数据
                          //如果一个群组都没了
                          if (cache.group.length === 0) {
                              listElem.html('<li class="layim-null">暂无群组</li>');
                          }
                          return true;
                      }
                  });
              }
          }
      };
  
      //查看更多记录
      var chatListMore = function() {
        //   debugger
          var thatChat = thisChat(),
              chatMain = thatChat.elem.find('.layim-chat-main');
          var ul = chatMain.find('ul'),
              li = ul.children('.layim-chat-li');
  
          if (li.length >= MAX_ITEM) {
              var first = li.eq(0);
              first.prev().remove();
              if (!ul.prev().hasClass('layim-chat-system')) {
                  ul.before('<div class="layim-chat-system" layim-event="chatLog"><span >查看更多记录</span></div>');
              }
              first.remove();
          }
          chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
      };
  
      //快捷键发送
      var hotkeySend = function() {
        //   debugger
          var thatChat = thisChat(),
              textarea = $('.input_div');
          var btn = textarea.next();
          textarea.off('keydown').on('keydown', function(e) {
              var keyCode = e.keyCode;
              if (keyCode === 13) {
                  e.preventDefault();
                  if($('.input_div').html().match(/<div(([\s\S])*?)<\/div>/))
                  $('.input_div').replace(/<div(([\s\S])*?)<\/div>/, '')
                //   sendMessage(1);
              }
            //   btn[textarea.html() === '' ? 'addClass' : 'removeClass']('layui-disabled');
          });
          textarea.off('keyup').on('keyup', function(e) {
              var keyCode = e.keyCode;
              if (keyCode === 13) {
                  e.preventDefault();
                  sendMessage(1);
              }
              btn[textarea.html() === '' ? 'addClass' : 'removeClass']('layui-disabled');
          });
      };
      //表情库
      var index__ = 0;
      var faces = function() {
        //   
          var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"],
              arr = {};
          layui.each(alt, function(index, item) {
              
              arr[item] = layui.cache.dir + 'images/emoji/Expression_' + index + '.png';
            //   arr[_index] = index;
          });
          return arr;
      }();
      
      var stope = layui.stope; //组件事件冒泡
      window.inputFocus = function(e){
        // 
      }
      //在焦点处插入内容
      var ht = '';
    //   var insertHtmlAtCaret(html) {
    //     let sel, range;
    //     if (window.getSelection) {
    //         // IE9 and non-IE  
    //         sel = window.getSelection();
    //         if (sel.getRangeAt && sel.rangeCount) {
    //             range = sel.getRangeAt(0);
    //             range.deleteContents();
    //             let el = document.createElement("p");
    //             el.innerHTML = html;
    //             let frag = document.createDocumentFragment(),
    //                 node, lastNode;
    //             while ((node = el.firstChild)) {
    //                 lastNode = frag.appendChild(node);
    //             };
    //             range.insertNode(frag);
    //             if (lastNode) {
    //                 range = range.cloneRange();
    //                 range.setStartAfter(lastNode);
    //                 range.collapse(true);
    //                 sel.removeAllRanges();
    //                 sel.addRange(range);
    //             }
    //         }
    //     } else if (document.selection && document.selection.type != "Control") {
    //         // IE < 9  
    //         document.selection.createRange().pasteHTML(html);
    //     }
    // },
    var facesss = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"];
      var focusInsert = function(obj, str, nofocus) {
        // debugger
        var result, val = str.match(/img[\'\"]?([^\'\"]*)[\']?/gi) ? obj.html() : obj.innerHTML;
        let index = facesss.indexOf(tools.trim(str.replace('face', '')));
        // 
        var content = '',
        thatChat = thisChat(),
        input = $('.input_div');
        console.log(obj, str, nofocus)
        // debugger
          nofocus || obj.focus();
            var jmz = {};
            let url = layui.cache.dir + 'images/emoji/Expression_'+ index +'.png';
            let isIMG = str.match(/img[\'\"]?([^\'\"]*)[\']?/gi);
            let isVIDEO = str.match(/video[\'\"]?([^\'\"]*)[\']?/gi);
            if(isIMG || isVIDEO){
                // ht = '<img src="'+ str.replace('img[', '').replace(']', '') +'">';
                obj.html(str);
            }else{
                 jmz.GetLength = function(str) {
                    return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
                 };  
                // debugger
                ht += '<img src="'+ url +'" alt="'+ str +'">';
                // console.log(obj)
                $('.input_div').append(ht)
                // (ht)
                // val.substring(0, focusPos) + ht + val.substr(focusPos);
            }
            ht = '';
            /* 统计字符串方法 */
           
            // alert(jmz.GetLength(obj.innerHTML))
            // /* 获取单个表情字符串长度 */
            // let one_face_len = obj.innerHTML.match(/<img.*?alt.*?(?:>|\/>)/gi);
            // /* 获取整体字符串的长度 */
            // let all_len = jmz.GetLength(obj.innerHTML);
            // let html_ = '';
            // try{
            //       for(let i = 0; i < one_face_len.length; i ++){
            //         //   console.log(jmz.GetLength(one_face_len[i]))
            //         html_ =  obj.innerHTML.replace(one_face_len[i], '卍');
            //         // console.log(jmz.GetLength(one_face_len[i]));
            //       }
            //       console.log(html_)
            //       console.log()
                 
            // }catch(err){
            //     console.log(err)
            // }
           
            

            
            
          console.log(ht)
         
      };

      //事件
      var anim = 'layui-anim-upbit',
          events = {
              //弹出聊天面板
              chat: function(othis) {
                // debugger
                // debugger
                  var local = layui.data('layim-mobile')[cache.mine.id] || {};
                  var type = othis.data('type'),
                      index = othis.attr('data-index');//othis.data('index');
                  var list = othis.attr('data-list') || othis.index(),
                      data = {};
                     
                  if (type === 'friend') {
                      data = cache[type][index].list[list];
                  } else if (type === 'group') {
                      data = cache[type][list];
                  } else if (type === 'history') {
                      data = (local.history || {})[index] || {};
                  }
                  data.name = data.name || data.username || data.groupname;
                  if (type !== 'history') {
                      data.type = type;
                  }
                  popchat(data, true);
                  $('.layim-' + data.type + data.id).find('.layim-msg-status').removeClass(SHOW);
              }
  
              //展开联系人分组
              ,
              spread: function(othis) {
                  var type = othis.attr('lay-type');
                  var spread = type === 'true' ? 'false' : 'true';
                  var local = layui.data('layim-mobile')[cache.mine.id] || {};
                  othis.next()[type === 'true' ? 'removeClass' : 'addClass'](SHOW);
                  local['spread' + othis.parent().index()] = spread;
                  layui.data('layim-mobile', {
                      key: cache.mine.id,
                      value: local
                  });
                  othis.attr('lay-type', spread);
                  othis.find('.layui-icon').html(spread === 'true' ? '&#xe61a;' : '&#xe602;');
              }
  
              //底部导航切换
              ,
              tab: function(othis) {
                  var index = othis.index(),
                      main = '.layim-tab-content';
                  othis.addClass(THIS).siblings().removeClass(THIS);
                  layimMain.find(main).eq(index).addClass(SHOW).siblings(main).removeClass(SHOW);
              }
  
              //返回到上一个面板
              ,
              back: function(othis) {
                localStorage.to_name = undefined
                  var layero = othis.parents('.layui-m-layer').eq(0),
                      index = layero.attr('index'),
                      PANEL = '.layim-panel';
                  setTimeout(function() {
                      layer.close(index);
                  }, 300);
                  othis.parents(PANEL).eq(0).removeClass('layui-m-anim-left').addClass('layui-m-anim-rout');
                  layero.prev().find(PANEL).eq(0).removeClass('layui-m-anim-lout').addClass('layui-m-anim-right');
                  layui.each(call.back, function(index, item) {
                      setTimeout(function() {
                          item && item();
                      }, 200);
                  });
              }
  
              //发送聊天内容
              ,
              send: function() {
                  sendMessage(1);
              }
  
              //表情
              ,
              face: function(othis, e) {    
                //   
                //   
                  var content = '',
                      thatChat = thisChat(),
                      input = $('.input_div');
                      console.log(input)
                      console.log(layui.faces)
                  layui.each(faces, function(key, item) {
                      
                    // console.log(item)[]
                      content += '<li title="' + key + '"><img class="emoji" src="' + item + '"></li>';
                  });
                  content = '<ul class="layui-layim-face">' + content + '</ul>';
                  setTimeout(function() {
                    // 
                      layer.popBottom({
                          content: content,
                          success: function(elem) {
                              var list = $(elem).find('.layui-layim-face').children('li');
                              $(elem).find('.layui-m-layershade').css('background-color', 'rgba(0,0,0,0)');
                              touch(list, function() {
                                //   
                                  focusInsert(input[0], 'face' + this.title + ' ', true);
                                  
                                  input.next()[input.html() === '' ? 'addClass' : 'removeClass']('layui-disabled');
                                  events.faceHide();
                                  return false;
                              });
                          }
                      });
                      
                  }, 10);
                  // var doc = $(document);
                  // if (isTouch) {
                  //     doc.off('touchend', events.faceHide).on('touchend', events.faceHide);
                  // } else {
                  //     doc.off('click', events.faceHide).on('click', events.faceHide);
                  // }
                  // stope(e);
                    thatChat.face = content;
              },
              faceHide: function() {
                  layer.close(layer.popBottom.index);
                  $(document).off('touchend', events.faceHide)
                      .off('click', events.faceHide);
              }
  
              //图片或一般文件
              ,
              image: function(othis) {
                  var type = othis.data('type') || 'images',
                      api = {
                          images: 'uploadImage',
                          file: 'uploadFile'
                      },
                      thatChat = thisChat(),
                      conf = cache.base[api[type]] || {};
                  upload({
                      url: conf.url || '',
                      method: conf.type,
                      elem: othis.find('input')[0],
                      unwrap: true,
                      type: type,
                      success: function(res) {
                          if (res.code == 0) {
                              res.data = res.data || {};
                              if (type === 'images') {
                                  focusInsert(thatChat.textarea[0], 'img[' + (res.data.src || '') + ']');
                              } else if (type === 'file') {
                                  focusInsert(thatChat.textarea[0], 'file(' + (res.data.src || '') + ')[' + (res.data.name || '下载文件') + ']');
                              }
                              sendMessage();
                          } else {
                              layer.msg(res.msg || '上传失败');
                          }
                      }
                  });
              }
  
              //扩展工具栏
              ,
              extend: function(othis) {
                  var filter = othis.attr('lay-filter'),
                      thatChat = thisChat();
  
                  layui.each(call['tool(' + filter + ')'], function(index, item) {
                      item && item.call(othis, function(content) {
                          focusInsert(thatChat.textarea[0], content);
                      }, sendMessage, thatChat);
                  });
              }
  
              //弹出新的朋友面板
              ,
              newFriend: function() {
                  layui.each(call.newFriend, function(index, item) {
                      item && item();
                  });
              }
  
              //弹出群组面板
              ,
              group: function() {
                  popPanel({
                      title: '群聊',
                      tpl: ['<div class="layui-layim-list layim-list-group">', listTpl({
                          type: 'group',
                          item: 'd.group'
                      }), '</div>'].join(''),
                      data: {}
                  });
              }
  
              //查看群组成员
              ,
              detail: function() {
                  var thatChat = thisChat();
                  layui.each(call.detail, function(index, item) {
                      item && item(thatChat.data);
                  });
              }
              
              //播放音频
              ,
              playAudio: function(othis) {
                  var audioData = othis.data('audio'),
                      audio = audioData || document.createElement('audio'),
                      pause = function() {
                          audio.pause();
                          othis.removeAttr('status');
                          othis.find('i').html('&#xe652;');
                      };
                  if (othis.data('error')) {
                      return layer.msg('播放音频源异常');
                  }
                  if (!audio.play) {
                      return layer.msg('您的浏览器不支持audio');
                  }
                  if (othis.attr('status')) {
                      pause();
                  } else {
                      audioData || (audio.src = othis.data('src'));
                      audio.play();
                      othis.attr('status', 'pause');
                      othis.data('audio', audio);
                      othis.find('i').html('&#xe651;');
                      //播放结束
                      audio.onended = function() {
                          pause();
                      };
                      //播放异常
                      audio.onerror = function() {
                          layer.msg('播放音频源异常');
                          othis.data('error', true);
                          pause();
                      };
                  }
              }
  
              //播放视频
              ,
              playVideo: function(othis) {
                //   debugger
                  var videoData = othis.data('src'),
                      video = document.createElement('video');
                  if (!video.play) {
                      return layer.msg('您的浏览器不支持video');
                  }
                  layer.close(events.playVideo.index);
                  
                  setTimeout(function() {
                      //有路径
                      if(isNaN(Number(videoData))){
                          events.playVideo.index = layer.open({
                              type: 1,
                              anim: false,
                              style: 'width: 100%; height: 50%;',
                              content: '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" poster="'+videoData+'" src="' + videoData + '" autoplay="autoplay"></video></div>',
                              success: function(layero, index) {
                                  $(layero).css('z-index', 19891015);
                              }
                          });
                      }else{// 没路径，要请求
                          layui.each(call.playVideo, function(index, item) {
                              // item && item(index, videoData);
                              if(item){
                                  item(videoData, function(vpath){
                                      events.playVideo.index = layer.open({
                                          type: 1,
                                          anim: false,
                                          style: 'width: 100%; height: 50%;',
                                          content: '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" poster="'+vpath+'" src="' + vpath + '" autoplay="autoplay"></video></div>',
                                          success: function(layero, index) {
                                              $(layero).css('z-index', 19891015);
                                          }
                                      });
                                  });
                              }
                          });
                      }
                      // events.playVideo.index = layer.open({
                      //     type: 1,
                      //     anim: false,
                      //     style: 'width: 100%; height: 50%;',
                      //     content: '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" src="' + videoData + '" autoplay="autoplay"></video></div>',
                      //     success: function(layero, index) {
                      //         $(layero).css('z-index', 19891015);
                      //     }
                      // });
                  }, 0);
              }
  
              //聊天记录
              ,
              chatLog: function(othis) {
                  var thatChat = thisChat();
                  layui.each(call.chatlog, function(index, item) {
                      item && item(thatChat.data, thatChat.elem.find('.layim-chat-main>ul'));
                  });
              }
  
              //更多列表
              ,
              moreList: function(othis) {
                  var filter = othis.attr('lay-filter');
                  layui.each(call.moreList, function(index, item) {
                      item && item({
                          alias: filter
                      });
                  });
              }
  
              //关于
              ,
              about: function() {
                  layer.open({
                      content: '<p style="padding-bottom: 5px;">LayIM属于付费产品，欢迎通过官网获得授权，促进良性发展！</p><p>当前版本：layim mobile v' + v + '</p><p>版权所有：<a href="http://layim.layui.com" target="_blank">layim.layui.com</a></p>',
                      className: 'layim-about',
                      shadeClose: false,
                      btn: '我知道了'
                  });
              }
  
              //查看成员
              ,
              memberinfo: function(othis) {
                  var thatChat = thisChat();
                  var userid = $(othis).attr('userid');
                  layui.each(call.memberinfo, function(index, item) {
                      item && item(thatChat.data);
                  });
              }
  
              //发送商品
              ,
              sendgoods: function(othis) {
                  var thatChat = thisChat();
                  var goods_id = $(othis).attr('data-id');
                  layui.each(call.sendgoods, function(index, item) {
                      item && item(goods_id);
                  });
              }
  
              //发送订单
              ,
              sendorder: function(othis) {
                  var thatChat = thisChat();
                  var order_id = $(othis).attr('data-id');
                  layui.each(call.sendorder, function(index, item) {
                      item && item(order_id);
                  });
              }
  
              //查看商品信息
              ,
              getgoodsdetail: function(othis) {
                  var thatChat = thisChat();
                  var goods_id = $(othis).attr('data-id');
                  layui.each(call.getgoodsdetail, function(index, item) {
                      item && item(goods_id);
                  });
              }
  
              //查看订单信息
              ,
              getorderdetail: function(othis) {
                  var thatChat = thisChat();
                  var order_id = $(othis).attr('data-id');
                  layui.each(call.getorderdetail, function(index, item) {
                      item && item(order_id);
                  });
              }
  
              //预览图片
              ,
              seeimg: function(othis) {
                  var thatChat = thisChat();
                  var src = $(othis).attr('src');
                  layui.each(call.seeimg, function(index, item) {
                      item && item(othis);
                  });
              }
  
          };
  
      //暴露接口
      exports('layim-mobile', new LAYIM());
  
  }).addcss(
      'modules/layim/mobile/layim.css?v=2.10', 'skinlayim-mobilecss'
  );