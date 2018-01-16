
var session_key = {}; //存储微信支付的ID

var that;
var wxpay_doing = false;

//获取应用实例  
var app = getApp()  
Page({  
  data: {
    pageHeight: 480,
    scrollHeight: 480,
    
    button_wxpay: '#E0E0E0', //#50bd24
    button_color_txyzma: '#E0E0E0', 

    dhua: '', xming: '', txyzma: '', dxyzma: '',

    paymount: 0, //支付金额
    paykind: 'wxpay', //wxpay, alipay, typay
    button_send_image_code: '发送验证码', button_wxpay_title: '微信支付',

    verifycode: {cad: '', img: ''},

    userInfo: {}
  },

 isPhone: function(_s) {
   var partten = /^1[3,5,7,8]\d{9}$/;
   var fl = false;
   if (partten.test(_s)) { return true; } else { return false; }
 },

 //输入图形验证码
 set_imgcode: function(e) {
   this.setData({ txyzma: e.detail.value });

   if (this.isPhone(this.data.dhua) && this.data.xming.length > 1 && this.data.txyzma.length >= 4) { 
     this.setData({ button_color_txyzma: '#59be30' }); 
   } else {
     this.setData({ button_color_txyzma: '#E0E0E0' }); 
   }
 },

 //输入短信验证码
 set_smscode: function(e) {
   this.setData({ dxyzma: e.detail.value });

   if (this.isPhone(this.data.dhua) && this.data.xming.length > 1 && this.data.dxyzma.length >= 4) { 
     this.setData({ button_wxpay: '#59be30' }); 
   } else {
     this.setData({ button_wxpay: '#E0E0E0' }); 
   }

 },

 //输入电话
 set_dhua: function(e) {
   this.setData({ dhua: e.detail.value });

   if (this.isPhone(this.data.dhua) && this.data.xming.length > 1 && this.data.dxyzma.length >= 4) { 
     this.setData({ button_wxpay: '#50bd24' }); 
   } else {
     this.setData({ button_wxpay: '#E0E0E0' }); 
   }
  },

 //输入姓名
 set_xming: function(e) {
   this.setData({ xming: e.detail.value });

   if (this.isPhone(this.data.dhua) && this.data.xming.length > 1 && this.data.dxyzma.length >= 4) { 
     this.setData({ button_wxpay: '#50bd24' }); 
   } else {
     this.setData({ button_wxpay: '#E0E0E0' }); 
   }
  },

 //请求验证码
 get_verifycode: function(e) {
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/user/make_code.php',
     data: { },
     header: { 'content-type': 'application/json' },
     success: function(res) { 
       var _vcode = res.data;
       that.setData({ verifycode: _vcode });
       console.log(res.data);
     }
   });
 },

 //请求短信验证码
 send_sms_code: function(e) {
   console.log("点击发送验证码");

   if (this.isPhone(this.data.dhua) && this.data.xming.length > 1 && this.data.txyzma.length >= 4) { 
     this.setData({ button_color_txyzma: '#E0E0E0', button_send_image_code: '　已发送　' }); //59be30 
   } else {
     console.log("因不合格，取消发送验证码");
     return(false);
   }

   console.log("发出验证码请求");

   console.log( that.data.dhua + ' ' + that.data.txyzma + ' ' + that.data.verifycode.cad);

   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/user/xcx_send_sms.php',
     data: { phone: that.data.dhua, icode: that.data.txyzma, cad: that.data.verifycode.cad },
     header: { 'content-type': 'application/json' },
     success: function(res) { 
       //var _vcode = res.data;
       //that.setData({ verifycode: _vcode });
       console.log(res.data);
     }
   });
 },

 start_wxpay: function(e) {
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
                 that.setData({ button_wxpay_title: '正在提交支付LOG', paykind: 'wxpay', paymount: 10000 }); //微信支付或体验支付, 1分钱测试
                 console.log(that.data.paykind + '####' + that.data.paymount);
                 that.call_io_pay(that);
/*
       wx.request({
         url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/pay.php',
         data: __data,
         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         // header: {}, // 设置请求的 header
         success: function(res){
           console.log(res.data);
           if (res.data.ok != 'y') { return(false); }

that.setData({ button_wxpay_title: '跳转到ORDER页面' });

                 //跳转到下一个页面
                 wx.redirectTo({
                   url: 'order'
                 });

           //存储分配的教练信息


           //跳转到下一个页面
           //   wx.redirectTo({
           //     url: 'order'
           //  });
         },
         fail: function() {
           // fail
         },
         complete: function() {
           // complete
         }
       });
*/
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

 //支付后提交日志的接口
 call_io_pay: function(e) {
   that.setData({ paykind: 'wxpay', paymount: 10000 }); //微信支付或体验支付, 1分钱测试

   //约车后提交的数据结构
   var __data = {
     "userid": that.data.dhua,
     "paykind": that.data.paykind, //微信支付或体验支付
     "paymount": 10000, //that.data.paymount,
     "paylog": "5p2l6Ieq5b6u5L+h5bCP56iL5bqP5pSv5LuY"
   };
   console.log(that.data.paykind + '##' + that.data.paymount);

   console.log('调用 pay.php 参数'); console.log(__data);
   //支付后日志
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/pay.php',
     data: __data,
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){
       console.log(res.data);
       if (res.data.ok != 'y') { return(false); }

       //跳转到下一个页面
       wx.redirectTo({
         url: 'order?zhuangtai=s'
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

 //提交订单并跳转支付
 click_goto_order: function(e) {
   //支付点击时, 不得重复点击
   if (wxpay_doing) { return(false); }
   wxpay_doing = true;

   if (!that.isPhone(that.data.dhua)) { console.log("电话号码检测不通过"); return(false); }
   if (that.data.xming.length <= 1) { console.log("姓名检测不通过"); return(false); }

   //存储手机号和姓名, 下次直接载入
   wx.setStorageSync('dhua', that.data.dhua);
   wx.setStorageSync('xming', that.data.xming);


   //约车前提交的数据结构
   var _data = {
     "userid": that.data.dhua,
     "xming": that.data.xming,
     "kemu": "", 
     "poslong": 0,
     "poslat": 0,
     "addressof": ""
   };

   console.log("从缓存中读取订单详情");
   var _json = JSON.parse(wx.getStorageSync('yueche_data'));
   if (_json.kemu == '科目二') { _data.kemu = '二'; } else { _data.kemu = '三'; }
   _data.addressof = _json.address; _data.phone = that.data.dhua;
   _data.poslong = _json.poslong; _data.poslat = _json.poslat;
   _data.smscode = that.data.dxyzma;

   console.log(_data);

   //跳转到下一个页面
   //   wx.redirectTo({
   //     url: 'order'
   //  });
   //return(true); 

   console.log("调用xcx_yueche.php");
   //检验约车订单数据
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/xcx_yueche.php',
     data: _data,
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){  console.log(res.data);
       if (res.data.ok != 'y') { return(false); }

       if (res.data.ok == 'y' && res.data.tiyan == 'y') {
         //有体验资格, 跳过支付, 直接调用pay.php
         console.log("有体验资格, 直接调用pay.php");

         that.setData({ paymount: 0, paykind: 'typay' });
         that.call_io_pay(that);

         return(true);
       }

       that.setData({ button_wxpay_title: '正在发起微信支付' });

       //开启支付
       that.start_wxpay(this);

     },
     fail: function() {
       // fail
     },
     complete: function() {
       // complete
     }
   });
 },

 onLoad: function (options) {
   that = this;

   wxpay_doing = false;

   //页面度宽定义
   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight, scrollHeight: res.windowHeight});
     }
   });

   //获取登录信息, openid
   wx.login({
     success: function(res) {
       console.log(res);
       if (res.code) {
         //发起网络请求
         wx.request({
           url: 'https://www.jyouw.cn/jiayouxueche/io/wxpay.xcx/wxpay.php?type=sessionKey',
           data: { code: res.code },
           header: { 'content-type': 'application/json' },
           success: function(res) { 
             session_key = res.data;
             console.log('获取用户登录状态！'); console.log(res.data);
           }
         });
       } else {
         console.log('获取用户登录状态失败！' + res.errMsg);
       }
     }
   });

   //读取约车定义
   var _data = JSON.parse(wx.getStorageSync('yueche_data'));
   that.setData({selected_kemu_name: that.kemu, selected_address_name: that.address});

   //存储手机号和姓名, 下次直接载入
   var _dhua = wx.getStorageSync('dhua');
   var _xming = wx.getStorageSync('xming');

   console.log(_dhua + " # " + _xming);

   that.setData({ button_wxpay: '#E0E0E0', dhua: _dhua, xming: _xming  }); 

   //请求验证码
   that.get_verifycode(_data);
 }  
})