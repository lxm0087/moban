
var b64 = require('../../utils/b64.js');

var session_key = {}; //存储微信支付的ID

var that;

var timesgo = 3; var timer = null; //倒计时定时器

//获取应用实例  
var app = getApp()
Page({
  data: {
    pageHeight: 480,   scrollHeight: 480,

    selected_kemu_name: '科目二',

    animation_kemu: {}, //科目弹出菜单动画

    goto_pay_color: '#E0E0E0', //50bd24 //确认订单 
    selectpoint: '选取地图点',
    selectlong: 0, selectlat: 0,

    //picker_kemu: ['科目一', '科目三'], pickerid: 0,

    order_check_hints: '检测是否有未完成订单 ...',

    duration: 500,  
    userInfo: {}  
  },


 //地图选点
 select_map: function(e) {
   var that = this;
   //弹出选择地图功能
   wx.chooseLocation ({
     name: '',
     address: '',
     success: function(res) {
       if(res.name.length <= 2) { return(false); }
       console.log(res);
       that.setData({selectpoint: res.name, selectlong: res.longitude, selectlat: res.latitude, goto_pay_color: '#50bd24'});  //读取地图地点名称 res.latitude, res.longitude
     }
   });
 },

  //底部工具栏跳转控制
  toolbar_jump_to: function(e) {
    var _to = e.currentTarget.dataset.to;

    if (_to == 'index') {
      wx.redirectTo({ url: '/pages/index/index' });
    };
    if (_to == 'lianxi') {
      wx.redirectTo({ url: '/pages/index/lianxi' });
    };
    if (_to == 'jiaolian') {
      //wx.redirectTo({ url: '/pages/index/jiaolian' });
    }
  },

 //取消科目选择
 click_hide_mask: function(e) {
   this.setData({show_kemu_list: false, show_mask: false});   
 },
 
 //弹出科目选择
 select_kemu: function(e) {
   this.setData({show_kemu_list: true, show_mask: true});   
 console.log("弹出科目选择1");
   var animation = wx.createAnimation({
     duration: 400,
     timingFunction: "ease",
     delay: 50
   });
   animation.bottom(0).step();
   this.setData({animation_kemu: animation.export()});
  console.log("弹出科目选择2");
 },

 //选中一个科目
 click_select_kemu: function(e) {
   this.setData({show_mask: false, selected_kemu_name: e.currentTarget.dataset.kemu, show_kemu_list: false, show_kemu_bottom: -90});
 },

 //跳到支付页
 click_goto_pay: function(e) {
   if (this.data.goto_pay_color == '#E0E0E0') { return(false); }

   //结构化存储
   var _data = {"poslong": this.data.selectlong, "poslat": this.data.selectlat, "address": this.data.selectpoint, "kemu": this.data.selected_kemu_name};
   wx.setStorage({ key: "yueche_data", data: JSON.stringify(_data) });

   wx.navigateTo({
     url: 'wxpay'
   });
 },

 //约车历史记录
 click_goto_order_history: function(e) {
   wx.navigateTo({
     url: 'history'
  })
 },

 //发起支付
 weixinPayto: function(e) {
   console.log(session_key);

   console.log("开始请求payOrder");

   //var that = this;

   //统一下单API
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/wxpay.xcx/wxpay.php?type=payOrder',
     data: session_key,
     method: 'GET',
     // header: {}, // 设置请求的 header
     success: function (res) {
       console.log("请求payOrder返回: "); console.log(res.data);
       var prepay_id = res.data.prepay_id;
         if (prepay_id == undefined) { console.log('未获取到prepay_id'); return(false); } 
         //获取paySign
         wx.request({
           url: 'https://www.jyouw.cn/jiayouxueche/io/wxpay.xcx/wxpay.php?type=requestPayment',
           data: { 'prepay_id': prepay_id },
           method: 'GET',
           // header: {}, // 设置请求的 header
           success: function (res) {
             console.log("请求requestPayment返回: "); console.log(res.data);
             var data = res.data;
             var paySign = data.paySign;
             if (paySign == undefined) { console.log('未获取到paySign'); return(false); }
             //微信支付调用
             var payObj = {
               timeStamp: data.timeStamp,
               nonceStr: data.nonceStr,
               package: data.package,
               signType: data.signType,
               paySign: paySign,
               success: function (res) {
                 console.log(res);
               },
               fail: function (e) {
                 console.log(e);
               }
             };
             console.log(payObj);
             console.log("开始requestPayment");
             wx.requestPayment(payObj);
           },
           fail: function (e) {
             console.log("请求requestPayment失败");
           }
         });
     },
     fail: function(e) {
       console.log("请求payOrder失败");
     }
   });

 },


  onLoad: function () { console.log(' index onload ');
    var that = this;  
    wx.getSystemInfo({
      success: function(res) { console.log("屏高: " + res.windowHeight);
        that.setData({pageHeight: res.windowHeight-44, scrollHeight: res.windowHeight - 44});
      }
    });

     //判断是否有订单正在处理中
     console.log("check.php 接口，判断是否有订单正在处理中");
     that.setData({ order_check_hints: '检测是否有未完成订单 ...' });

     //检测是否有未完成订单
     var _data = { userid: wx.getStorageSync('dhua') };
     wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/check.php',
     data: _data,
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       // header: {}, // 设置请求的 header
       success: function(res){
         console.log(res.data);

         if (res.data.ok != 'y') {
           setTimeout(function() { that.setData({ order_check_hints: '' }); }, 500);

           return(false); 
         }

         if (res.data.ok == 'y') {
           //订单信息存储到Storage中
           wx.setStorageSync('yuechedingdan', res.data.list);

           timesgo = 3; timer = null; //倒计时定时器
           
           that.setData({ order_check_hints: '检测到您有订单未完成, 3秒后自动跳转' });

           timer = setInterval(function() {
             if (timesgo > 1) {
               timesgo = timesgo - 1;
               that.setData({ order_check_hints: '检测到您有订单未完成, ' + timesgo + '秒后自动跳转' });
             } else {
               that.setData({ order_check_hints: '' });
               clearInterval(timer); timer = null;
               //跳转到下一个页面
               wx.navigateTo({
                 url: 'order?zhuangtai=' + res.data.list.actived
               });
             }
           }, 1000);
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

  onShareAppMessage: function () {
    return {
      title: '驾优考驾照™',
      desc: '驾优考驾照 报驾校+练科目+约教练',
      path: '/pages/index/jiaolian'
    }
  }
})  