
var b64 = require('../../utils/b64.js');

var _timerin = null; var _timerout = null;

var zhuangtai = ""; //订单状态 s审核中, y等待上车, w接送中, l正在练车, p已完成练车, n已评论 
var zhuanttai_biaoti = {"s": "审核中", "y": "等待上车", "w": "开始练车", "l": "完成练习", "p": "正在评论", "n": "订单结束"};
var that = null;


//获取应用实例
var app = getApp()  
Page({  
  data: {
    pageHeight: 480,
    scrollHeight: 480,

    order_step: '',
    order_step_shenheing: false, order_step_waitting: false, order_step_clocking: false, order_step_doing: false, 

    show_shenheing_top: 70,
    show_waitting_top: 70, //animation_waitting: {}, //动画
    show_clocking_top: 70, //animation_clocking: {}, //动画
    show_doing_top: 70, //animation_doing: {}, //动画
    button_shangche: '',
    _times: 100, //用于透明度变换的计时器

    dingdan_zhuangtai: '', jiaolian_pingfen_half: false, //半颗星
    jiaolian_touxiang: '', jiaolian_xingming: '', jiaolian_jibie: '', jiaolian_chepai: '', jiaolian_pingfen: 5,
    dingdan_hujiaohaoma: '',
    userInfo: {}  
  },

 click_goto_shenheing: function(e) {
   that.setData({order_step_shenheing: false, order_step_waitting: false, order_step_clocking: false, order_step_doing: false, order_step: "审核中" });
 },

/*
 click_goto_waitting: function(e) {
   //淡入
   _timerin = setInterval(function() { console.log("click_goto_clocking 透明度: " + that.data._times);
     if (that.data._times <= 0) { 
       that.data._times = 0; 
       clearInterval(_timerin); 

   setTimeout(function() { 
     that.setData({show_waitting_top: -500}); //隐藏确认上车栏
     that.setData({order_step_waitting: false, order_step_clocking: true, order_step_doing: false, order_step: "开始练车" });
     //淡出
     _timerout = setInterval(function() { console.log("透明度: " + that.data._times);
       if (that.data._times >= 100) { that.data._times = 100; clearInterval(_timerout); return(false); }
       that.setData({_times: that.data._times + 10});   
     }, 50);
   }, 100);

       return(false); 
     }
     that.setData({_times: that.data._times - 10});
   }, 50);
   return(true); //跳过动画效果
 },
*/

 order_zhuangtai_gaibian(_to) { console.log(_to + " 状态改变 " + wx.getStorageSync('dhua'));
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/' + _to + '.php',
     data: {userid: wx.getStorageSync('dhua')},
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){ console.log(res.data);
       if (res.data.autoid) { //存储约车订单号, 用于评论
         wx.setStorageSync('dingdanhao', res.data.autoid);
       }
     },
     fail: function() {
       // fail
     },
     complete: function() {
       // complete
     }
   });
 },

 click_goto_clocking: function(e) {
   //确认上车按钮点击
   console.log("【确认上车】按钮点击, 提交状态更改");   
   that.order_zhuangtai_gaibian("shangche");
   //淡入
   _timerin = setInterval(function() { console.log("click_goto_clocking 透明度: " + that.data._times);
     if (that.data._times <= 0) { 
       that.data._times = 0; 
       clearInterval(_timerin); 

   setTimeout(function() { 
     that.setData({show_waitting_top: -500}); //隐藏确认上车栏
     that.setData({order_step_waitting: false, order_step_clocking: true, order_step_doing: false, order_step: "开始练车" });
     //淡出
     _timerout = setInterval(function() { console.log("透明度: " + that.data._times);
       if (that.data._times >= 100) { that.data._times = 100; clearInterval(_timerout); return(false); }
       that.setData({_times: that.data._times + 10});   
     }, 50);
   }, 100);

       return(false); 
     }
     that.setData({_times: that.data._times - 10});
   }, 50);
   return(true); //跳过动画效果


/*
   //收起接送菜单
   this.setData({order_step_waitting: true, show_clocking_top: this.data.scrollHeight});   

   var animation = wx.createAnimation({
     duration: 600,
     timingFunction: "ease",
     delay: 50
   });
   animation.top(-500).step();
   this.setData({animation_waitting: animation.export()});
 
   //弹出下一步菜单
   var that = this;
   setTimeout(function() { 
     that.setData({order_step_waitting: false, order_step_clocking: true, order_step_doing: false, order_step: "开始练车" });

     var animation = wx.createAnimation({
       duration: 600,
       timingFunction: "ease",
       delay: 50
     });
     animation.top(70).step();
     that.setData({animation_clocking: animation.export()}); 

   }, 550);
*/
 },

 click_goto_doing: function(e) {
   console.log("【开始练习】按钮点击, 提交状态更改");   
   that.order_zhuangtai_gaibian("lianche");
   //淡入
   _timerin = setInterval(function() { console.log("click_goto_doing 透明度: " + that.data._times);
     if (that.data._times <= 0) { 
       that.data._times = 0; 
       clearInterval(_timerin); 

       setTimeout(function() { 
         that.setData({order_step_clocking: -500}); //隐藏确认上车栏
         that.setData({order_step_waitting: false, order_step_clocking: false, order_step_doing: true, order_step: "完成练习" });
         //淡出
         _timerout = setInterval(function() { console.log("透明度: " + that.data._times);
           if (that.data._times >= 100) { that.data._times = 100; clearInterval(_timerout); return(true); }
           that.setData({_times: that.data._times + 10});   
         }, 50);
       }, 100);

       return(true); 
     }
     that.setData({_times: that.data._times - 10});
   }, 50);
   return(true); //跳过动画效果

/*
   this.setData({order_step_clocking: -500});   
   this.setData({order_step_waitting: false, order_step_clocking: false, order_step_doing: true, order_step: "完成练习" });
   return(true); //跳过动画效果

   //收起开始菜单
   this.setData({order_step_clocking: true});   

   var animation = wx.createAnimation({
     duration: 600,
     timingFunction: "ease",
     delay: 50
   });
   animation.top(-500).step();
   this.setData({animation_clocking: animation.export()});

   var that = this;
   setTimeout(function() { 
     that.setData({order_step_waitting: false, order_step_clocking: false, order_step_doing: true, order_step: "完成练习"  });
   }, 550);
*/
 },

 click_goto_pingjia: function(e) {   //收起完成菜单
   console.log("【完成练习】按钮点击, 提交状态更改");   
   that.order_zhuangtai_gaibian("xiache");
   //淡入
   _timerin = setInterval(function() { console.log("click_goto_pingjia 透明度: " + that.data._times);
     if (that.data._times <= 0) { 
       that.data._times = 0; 
       clearInterval(_timerin); 

       setTimeout(function() { //跳转到评价页面
         wx.redirectTo({
           url: 'pingjia'
         });
       }, 100);

       return(false); 
     }
     that.setData({_times: that.data._times - 10});
   }, 50);
 },

 //拨打电话
 makecallto: function(e) {
   wx.makePhoneCall({
    phoneNumber: that.data.dingdan_hujiaohaoma  //仅为示例，并非真实的电话号码
  });
 },

 //载入已有订单
 order_loadby(_zt) {
   //根据订单状态, 打开相应的显示
   if (_zt == 's') { 
     that.setData({
       order_step_shenheing: true, order_step_waitting: false, order_step_clocking: false, order_step_doing: false, 
       order_step: '审核中',
       dingdan_zhuangtai: 's', jiaolian_pingfen_half: false,
       jiaolian_touxiang: '../../images/user.kefu.png',
       jiaolian_xingming: '驾优学车客服',
       jiaolian_jibie: '',
       jiaolian_chepai: '我们将会全心全意为您提供满意周到的咨询服务！',
       jiaolian_pingfen: 0,
       dingdan_hujiaohaoma: '4009615360'
     });

     //开启定时器, 监测状态改变
   } else {
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
       order_step: zhuanttai_biaoti[_order.actived], 
       dingdan_zhuangtai: _order.actived, //订单状态
       jiaolian_touxiang: _order.src, jiaolian_pingfen_half: _pingfen_half,
       jiaolian_xingming: b64.base64_decode(_order.xming),
       jiaolian_jibie: '金牌教练',
       jiaolian_chepai: "车牌: " + b64.base64_decode(_order.chepai),
       jiaolian_pingfen: parseFloat(_order.pingfen).toFixed(1),
       dingdan_hujiaohaoma: _order.teachuid
     });

     if (_zt == 'y') {
       that.setData({ 
         order_step_shenheing: false, order_step_waitting: true, order_step_clocking: false, order_step_doing: false,
       });
     } else if (_zt == 'w') {
       that.setData({ 
         order_step_shenheing: false, order_step_waitting: false, order_step_clocking: true, order_step_doing: false,
       });
     } else if (_zt == 'l') {
       that.setData({ 
         order_step_shenheing: false, order_step_waitting: false, order_step_clocking: false, order_step_doing: true,
       });
     } else if (_zt == 'p') {
       that.setData({ 
         order_step_shenheing: false, order_step_waitting: false, order_step_clocking: false, order_step_doing: false,
       });
     }
   }
 },

 onLoad: function (options) {
   //页面度宽定义
   that = this;

   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight, scrollHeight: res.windowHeight});
     }
   });

   zhuangtai = options.zhuangtai; 
   console.log("订单状态 " + zhuangtai);
   that.order_loadby(zhuangtai);

   wx.getStorage({
     key: 'pingjia_json',
     success: function(res) {
       console.log("评价标签缓存，检查成功");
     },
     fail: function(res) {
       console.log("从接口读取评价标签");
       //从接口读取评价标签
       wx.request({
         url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/get_biaoqian.php',
         data: {},
         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         // header: {}, // 设置请求的 header
         success: function(res){
           var _pingjia_json = b64.base64_encode(JSON.stringify(res.data.list));
           console.log("存储到storage中");
           wx.setStorage({
             key:"pingjia_json",
             data:_pingjia_json
           });
         },
         fail: function() {
           // fail
         },
         complete: function() {
           // complete
         }
       })
     }
   });

 }
})