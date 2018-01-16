
var b64 = require('../../utils/b64.js');

var that;

var timesgo = 3; var timer = null; //倒计时定时器

//获取应用实例  
var app = getApp()
Page({
  data: {
    swiper_current:0, //swiper_kemu1_left: 0, swiper_kemu4_left: 100, swiper_yueche_left: 200,

    pageHeight: 480,
    scrollHeight: 480,
    pageWidth: 320,

    kemu1_linecolor: '#15b600', kemu4_linecolor: '#FFFFFF', kemu3_linecolor: '#FFFFFF',
    kemu1_select: '#15b600', kemu4_select: '#333333', kemu3_select: '#333333', 
    kemu1_bold: 'bold', kemu4_bold: 'normal', kemu3_bold: 'normal',
    kemu1_green: 'checked', kemu4_green: 'uncheck',  kemu3_green: 'uncheck',

    kemu1_display: [],
    kemu4_display: [],

    _zj_kemu1: [], _zj_kemu4: [],

    show_kemu_list: false, show_kemu_bottom: -90,


    button_gotonext: '#E0E0E0', //#50bd24
    xianluming: '', //线路名称
    show_tianjiabobao: false, //显示添加播报框

    show_xianlu_list: 'null',
    xianlu_list: [],

    hints_loading: true, hints_noresult: false,


    duration: 500,  
    userInfo: {}  
  },


 //单击底部工具栏
 toolbar_jump_to: function(e) {
   var _to = e.currentTarget.dataset.to;

   if (_to == 'index') {
     wx.redirectTo({ url: '/pages/index/index' });
   };
   if (_to == 'lianxi') {
     //wx.redirectTo({ url: '/pages/index/lianxi' });
   };
   if (_to == 'jiaolian') {
     wx.redirectTo({ url: '/pages/index/jiaolian' });
   }
 },

 //切换主标题
 click_kemu1: function(e) {
   this.setData({swiper_current: 0}); return(true);
     this.setData({kemu1_linecolor: '#15b600', kemu4_linecolor: '#FFFFFF', kemu3_linecolor: '#FFFFFF', 
                   kemu1_select: '#15b600', kemu4_select: '#333333', kemu3_select: '#333333', 
                   kemu1_bold: 'bold', kemu4_bold: 'normal', kemu3_bold: 'normal', 
                   kemu1_green: 'checked', kemu4_green: 'uncheck', kemu3_green: 'uncheck'}); 
 },
 //切换主标题
 click_kemu4: function(e) {
   this.setData({swiper_current: 1}); return(true);
     this.setData({kemu4_linecolor: '#15b600', kemu1_linecolor: '#FFFFFF', kemu3_linecolor: '#FFFFFF', 
                   kemu4_select: '#15b600', kemu1_select: '#333333', kemu3_select: '#333333', 
                   kemu4_bold: 'bold', kemu1_bold: 'normal', kemu3_bold: 'normal', 
                   kemu4_green: 'checked', kemu1_green: 'uncheck', kemu3_green: 'uncheck'});

 },
 //切换主标题
 click_kemu3: function(e) {
   this.setData({swiper_current: 2}); return(true);
     this.setData({kemu3_linecolor: '#15b600', kemu4_linecolor: '#FFFFFF', kemu1_linecolor: '#FFFFFF',
                   kemu3_select: '#15b600', kemu4_select: '#333333', kemu1_select: '#333333', 
                   kemu3_bold: 'bold', kemu4_bold: 'normal', kemu1_bold: 'normal', 
                   kemu3_green: 'checked', kemu4_green: 'uncheck', kemu1_green: 'uncheck'});

 },






 //顺序练习, 随机练习, 科目一, 四
 click_kemu_lianxi: function(e) {
   wx.navigateTo({
     url: 'exam?kemu=' + e.currentTarget.dataset.kemu
  })
 },

 //科目考试, 科目一, 四
 click_kemu_kaoshi: function(e) {
   wx.navigateTo({
     url: 'ready?kemu=' + e.currentTarget.dataset.kemu
  })
 },

 click_kemu_zhangjie: function(e) {
   wx.navigateTo({
     url: 'exam?kemu=' + e.currentTarget.dataset.kemu
  })
 },

 //滑动切换科目一，科目四
 swiper_change: function(e) {
   var _idx = e.detail.current;
   //var that = this;
   if (_idx == 0) {
     that.setData({kemu1_linecolor: '#15b600', kemu4_linecolor: '#FFFFFF', kemu3_linecolor: '#FFFFFF', 
                   kemu1_select: '#15b600', kemu4_select: '#333333', kemu3_select: '#333333', 
                   kemu1_bold: 'bold', kemu4_bold: 'normal', kemu3_bold: 'normal', 
                   kemu1_green: 'checked', kemu4_green: 'uncheck', kemu3_green: 'uncheck'
     });
   } 
   if (_idx == 1) {
     that.setData({kemu4_linecolor: '#15b600', kemu1_linecolor: '#FFFFFF', kemu3_linecolor: '#FFFFFF', 
                   kemu4_select: '#15b600', kemu1_select: '#333333', kemu3_select: '#333333', 
                   kemu4_bold: 'bold', kemu1_bold: 'normal', kemu3_bold: 'normal', 
                   kemu4_green: 'checked', kemu1_green: 'uncheck', kemu3_green: 'uncheck'
     });
   }
   if (_idx == 2) {
     that.setData({kemu3_linecolor: '#15b600', kemu4_linecolor: '#FFFFFF', kemu1_linecolor: '#FFFFFF',
                   kemu3_select: '#15b600', kemu4_select: '#333333', kemu1_select: '#333333', 
                   kemu3_bold: 'bold', kemu4_bold: 'normal', kemu1_bold: 'normal', 
                   kemu3_green: 'checked', kemu4_green: 'uncheck', kemu1_green: 'uncheck'
     });
     

   }   
 },




 


 kemu_display(data) {
   var _display1 = ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'];
   var _display4 = ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'];

   var _km1 = data.kemu1; var _km4 = data.kemu4;

   for(var _i=0; _i<_km1.length; _i++) {
     _km1[_i].section = b64.base64_decode(_km1[_i].section); _km1[_i].display = 'block'; _display1[_i] = 'block';
   }
   for(var _i=0; _i<_km4.length; _i++) {
     _km4[_i].section = b64.base64_decode(_km4[_i].section); _km4[_i].display = 'block'; _display4[_i] = 'block';
   }
   that.setData({_zj_kemu1: _km1, _zj_kemu4: _km4, kemu1_display: _display1, kemu4_display: _display4 }); 
 },


 //输入事件
 set_ming: function(e) {
   that.setData({ xianluming: e.detail.value });

   if (that.data.xianluming.length >= 1) { 
     that.setData({ button_gotonext: '#50bd24' }); 
   } else {
     that.setData({ button_gotonext: '#E0E0E0' }); 
   }
 },

 //跳转到定义路线页面
 click_goto_setup: function(e) {
   if (that.data.button_gotonext == '#E0E0E0') { return(false); }

   that.setData({ show_xianlu_list: 'show', hints_loading: false, hints_noresult: false, show_tianjiabobao: false });

   wx.navigateTo({
     url: 'yuyindingyi?title=' + b64.base64_encode(that.data.xianluming)
   });

   that.setData({ xianluming: '' }); //清除文本框原值
 },

 //取消路线定义
 click_cancel_setup: function(e) {
   console.log('取消路线定义');
   that.setData({ show_tianjiabobao: false, show_xianlu_list: 'show' }); 
 },

 //打开线路
 button_openxianlu: function(e) {
   var _id = e.currentTarget.dataset.id;
   var _list = that.data.xianlu_list; var _bobaodian = {};
   for(var _i=0; _i<_list.length; _i++) {
     //取出播报点
     if (_list[_i].id == _id) {
       _bobaodian = _list[_i]; break;
     }
   }
   console.log(_bobaodian.title);
   //保存播报点, 打开播报页面
   wx.setStorageSync('YYBOBAO', JSON.stringify(_bobaodian));
   wx.navigateTo({ url: 'yuyinbobao' });
 },

 //删除线路
 button_delxianlu: function(e) {
   var _id = e.currentTarget.dataset.id;
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yuyin/del_yuyin.php',
     data: { userid: wx.getStorageSync('WXOPENID'), "id": _id},
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){
       // success
       that.load_xianlu();
     },
     fail: function() {
       // fail
     },
     complete: function() {
       // complete
     }
   });
 },

 //载入用户的播报线路
 load_xianlu: function(e) {
   console.log(wx.getStorageSync('WXOPENID')); //用户身份

   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yuyin/get_yuyin.php',
     data: { userid: wx.getStorageSync('WXOPENID') },
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){
       // success
       console.log("载入线路列表");
       console.log(res);
       if (res.data.ok != 'y') { console.log('无数据'); 
         that.setData({ show_xianlu_list: 'null', hints_loading: false, hints_noresult: true, xianlu_list: [] });
         return(false);     
       }
       var _list = res.data.list;
       for(var _i=0; _i<_list.length; _i++) {
         _list[_i].title = b64.base64_decode(_list[_i].title);
       }
       that.setData({ show_xianlu_list: 'show', xianlu_list: _list }); console.log('展示列表数据');
     },
     fail: function() {
       // fail
     },
     complete: function() {
       // complete
     }
   })

 },

 //打开播报菜单
 click_tianjiabobao: function(e) {
   that.setData({ show_xianlu_list: 'null', hints_loading: false, hints_noresult: false, show_tianjiabobao: !that.data.show_tianjiabobao });
 },

 onLoad: function (options) {  
   that = this; timesgo = 3; var timer = null;

   console.log("options");
   console.log(options);
   if (options.pageof && options.pageof == 'kemu3') {
     this.setData({swiper_current: 2});
   }

   //页面度宽定义
   //var that = this;
   wx.getSystemInfo({
     success: function(res) { console.log("屏高: " + res.windowHeight);
       that.setData({pageWidth: res.windowWidth, pageHeight: res.windowHeight-90, scrollHeight: res.windowHeight - 90});
     }
   });

   //获取登录信息, openid
   if (wx.getStorageSync('WXOPENID')) {
     //读取我的线路列表
     that.load_xianlu();
   } else { 
     wx.login({
       success: function(res) {
         if (!res.code) { return(false); } 
 
         //发起网络请求
         wx.request({
           url: 'https://www.jyouw.cn/jiayouxueche/io/wxpay.xcx/wxpay.php?type=sessionKey',
           data: { code: res.code },
           header: { 'content-type': 'application/json' },
           success: function(res) { 
             wx.setStorageSync('WXOPENID', res.data.openid);

             //读取我的线路列表
             that.load_xianlu();
           }
         });
       }
     });
   }

   //读取章节并排版
   wx.getStorage({
     key: 'zhangjiemulu_json',
     success: function(res) { //从缓存中读取章节
       console.log("从缓存中读取章节");

       var zhangjiemulu_json = JSON.parse(b64.base64_decode(res.data));
       that.kemu_display(zhangjiemulu_json);
     }, 
     fail: function(res) { //从接口中请求章节
       console.log("从接口中请求章节");
       wx.request({
         url: 'https://www.jyouw.cn/jiayouxueche/io/exam/kaoshi.zjml.php',
         data: { },
         header: { 'content-type': 'application/json' },
         success: function(res) {
           wx.setStorageSync( 'zhangjiemulu_json', b64.base64_encode(JSON.stringify(res.data)) );
           that.kemu_display(res.data); 
         }   
       });
     }
   });
 },

  onShareAppMessage: function () {
    return {
      title: '驾优考驾照™',
      desc: '驾优考驾照 报驾校+练科目+约教练',
      path: '/pages/index/lianxi'
    }
  }
})