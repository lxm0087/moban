
var b64 = require('../../utils/b64.js');

var that = null;

//获取应用实例  
var app = getApp()
Page({
  data: {
    pageHeight: 480,   scrollHeight: 480, pageWidth: 320,

    show_jishishoufei: false, show_jiaxiaoditu: true,

    jiaxiaodata: {},
    jiaxiaoxiangce: {},
    jiaxiaoxiangqing: {},

    jiaxiaomarkers: [],
    duration: 500,  
    userInfo: {}  
  },

 //驾校地图状态切换
 showjiaxiaoditu: function(e) {
   that.setData({ show_jiaxiaoditu: !that.data.show_jiaxiaoditu });
 },

 //计时收费状态切换
 showjishishoufei: function(e) {
   that.setData({ show_jishishoufei: !that.data.show_jishishoufei });
 },

 //测试video
 test_video: function(e) {
   //wx.redirectTo({ url: '/pages/index/testvideo' });
 },

 //拨打电话
 makecallto: function(e) {
   wx.makePhoneCall({
    phoneNumber: "4009615360"
  });
 },


 onLoad: function () { console.log(' index onload ');
   that = this;
  
   wx.getSystemInfo({
     success: function(res) { console.log("屏高: " + res.windowHeight);
       that.setData({pageWidth: res.windowWidth, pageHeight: res.windowHeight-44, scrollHeight: res.windowHeight - 44});
     }
   });

   //读取缓存中的驾校信息
   var _jxdata = wx.getStorageSync('jiaxiaodata');
   if (_jxdata.length <= 10) { return(true); }
   _jxdata = JSON.parse(b64.base64_decode(_jxdata)); console.log(_jxdata);
   that.setData({ jiaxiaodata: _jxdata });
   var _markers = [{ iconPath: "../../images/icon.jiaxiao.weizhi.png", id: 9, latitude: parseFloat(_jxdata.weidu), longitude: parseFloat(_jxdata.jingdu), width: 32, height: 32 }];
   console.log(_markers);
   that.setData({ jiaxiaomarkers: _markers });

   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/jiaxiao/xiangqing.preg.php',
     data: {jiaxiaoid: _jxdata.itemid},
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){ console.log("扩展信息获取");
       var _jxext = res.data; 
       _jxext = JSON.parse(b64.base64_decode(_jxext)); console.log(_jxext);
       _jxext.xq.address = b64.base64_decode(_jxext.xq.address);
       _jxext.xq.lp_bus = b64.base64_decode(_jxext.xq.lp_bus);
       _jxext.xq.content = b64.base64_decode(_jxext.xq.content);
       
       //分解存储相册, 详情
       that.setData({ jiaxiaoxiangqing: _jxext.xq, jiaxiaoxiangce: _jxext.xc });
     }
   })
 }  
})  