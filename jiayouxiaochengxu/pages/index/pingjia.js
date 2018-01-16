
var b64 = require('../../utils/b64.js');

var goto_star_to = 5;
var goto_star_from = 0;
var star_timer = null;

var _pingjia_json = null;

//获取应用实例
var app = getApp()  
Page({
  data: {
    pageHeight: 480,
    scrollHeight: 480,

    image_star_of: ['star.2.png', 'star.2.png', 'star.2.png', 'star.2.png', 'star.2.png'],

    //标签云 未选中 #CCCCCC 选中 #ffd801
    label_color_list: [],
    label_pingjia_title: '',


    dingdan_zhuangtai: '', jiaolian_pingfen_half: false, //半颗星
    jiaolian_touxiang: '', jiaolian_xingming: '', jiaolian_jibie: '', jiaolian_chepai: '', jiaolian_pingfen: 0,
    dingdan_hujiaohaoma: '',

    userInfo: {}
  },

 click_pingjia_label: function(e) {
   //选中和取消选中
   var _labels = this.data.label_color_list;
   if (_labels[e.currentTarget.dataset.idx].color.toLowerCase() == '#cccccc') {
     //若已选中，则标为未选中
     _labels[e.currentTarget.dataset.idx].color = '#ffd800';
     //点亮手指
     if (_labels[e.currentTarget.dataset.idx].tu == 'pingjia.down.0.png') { _labels[e.currentTarget.dataset.idx].tu = 'pingjia.down.1.png'; }
     if (_labels[e.currentTarget.dataset.idx].tu == 'pingjia.up.0.png') { _labels[e.currentTarget.dataset.idx].tu = 'pingjia.up.1.png'; }

   } else {
     //未选中，则标为已选中
     _labels[e.currentTarget.dataset.idx].color = '#cccccc';
     //点亮手指
     if (_labels[e.currentTarget.dataset.idx].tu == 'pingjia.down.1.png') { _labels[e.currentTarget.dataset.idx].tu = 'pingjia.down.0.png'; }
     if (_labels[e.currentTarget.dataset.idx].tu == 'pingjia.up.1.png') { _labels[e.currentTarget.dataset.idx].tu = 'pingjia.up.0.png'; }
   }
   //更新到界面上
   this.setData({label_color_list: _labels});
 },

 //提交评论
 click_submit_pingjia: function(e) {
   //读取星级


   //读取评论
   var _labels = this.data.label_color_list; var _label_selected = "";
   for(var _i=0; _i<_labels.length; _i++) {
     if (_labels[_i].color.toLowerCase() == '#ffd800') {
       if (_label_selected.length <= 1) { _label_selected = _labels[_i].ping; continue; }
       _label_selected = _label_selected + "," + _labels[_i].ping; 
     }
   }

   console.log(_label_selected);
   //提交
   console.log(goto_star_to);


   //从接口读取评价标签
   wx.request({
         url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/pinglun.php',
         data: {userid: wx.getStorageSync('dhua'), autoid: wx.getStorageSync('dingdanhao'), pingfen: goto_star_to, biaoqian: _label_selected},
         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         // header: {}, // 设置请求的 header
         success: function(res){
           //返回首页
           wx.redirectTo({
             url: 'index'
           });
         },
         fail: function() {
           // fail
         },
         complete: function() {
           // complete
         }
       });

 },

 //点击1-5星
 click_star: function(e) {
   //设置循环终点和起点
   goto_star_to = e.currentTarget.dataset.star;
   goto_star_from = 0;
   //清空原数据
   this.setData({image_star_of: ['star.0.png', 'star.0.png', 'star.0.png', 'star.0.png', 'star.0.png']});

   this.setData({label_color_list: _pingjia_json[goto_star_to - 1].data, label_pingjia_title: _pingjia_json[goto_star_to - 1].title});

   //开启定时器，点亮星星
   var that = this;
   star_timer = setInterval(function() {  
     if (goto_star_from < goto_star_to) {
       //点亮星星加一
       var _star = that.data.image_star_of;
       _star[goto_star_from] = 'star.2.png';
       that.setData({image_star_of: _star}); //更新到界面
       goto_star_from++;
     } else {
       clearInterval(star_timer); //清除定时器
     }
   }, 80);
 },

 //拨打电话
 makecallto: function(e) {
   wx.makePhoneCall({
    phoneNumber: that.data.dingdan_hujiaohaoma  //仅为示例，并非真实的电话号码
  });
 },

 onLoad: function (options) {

   //页面度宽定义
   var that = this;  
   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight, scrollHeight: res.windowHeight});
     }
   });

   //载入评价列表并显示
   var that = this;
   wx.getStorage({
     key: 'pingjia_json',
     success: function(res) {
       console.log("从缓存中读取评价标签");

       _pingjia_json = JSON.parse(b64.base64_decode(res.data));
       //默认5星评价, 默认显示5星标签
       goto_star_to = 5;
       that.setData({label_color_list: _pingjia_json[4].data, label_pingjia_title: _pingjia_json[4].title});
     }
   });


     //读取
     var _order = wx.getStorageSync('yuechedingdan');
     console.log(_order);

     var _pingfen_half = false; //半颗星定义
     if (parseFloat(_order.pingfen) >= 0.4 && parseFloat(_order.pingfen) < 1) { _pingfen_half = true; }
     if (parseFloat(_order.pingfen) >= 1.3 && parseFloat(_order.pingfen) < 2) { _pingfen_half = true; }
     if (parseFloat(_order.pingfen) >= 2.3 && parseFloat(_order.pingfen) < 3) { _pingfen_half = true; }
     if (parseFloat(_order.pingfen) >= 3.3 && parseFloat(_order.pingfen) < 4) { _pingfen_half = true; }
     if (parseFloat(_order.pingfen) >= 4.3 && parseFloat(_order.pingfen) < 5) { _pingfen_half = true; }

     that.setData({ 
       dingdan_zhuangtai: _order.actived, //订单状态
       jiaolian_touxiang: _order.src, jiaolian_pingfen_half: _pingfen_half,
       jiaolian_xingming: b64.base64_decode(_order.xming),
       jiaolian_jibie: '金牌教练',
       jiaolian_chepai: "车牌: " + b64.base64_decode(_order.chepai),
       jiaolian_pingfen: parseFloat(_order.pingfen).toFixed(1),
       dingdan_hujiaohaoma: _order.teachuid
     });

 }  
})