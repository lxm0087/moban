
var b64 = require('../../utils/b64.js');
var _kemu_select = 'kemu1';

//获取应用实例  
var app = getApp()  
Page({  
  data: {
    pageHeight: 480,
    scrollHeight: 480,

    kemu: '科目一', timushu: '100', shijian: '90',
    userInfo: {}  
  },

 //科目考试, 科目一, 四
 click_to_paper: function(e) {
   wx.navigateTo({
     url: 'paper?kemu=' + _kemu_select
  })
 },

 onLoad: function (options) {
   _kemu_select = options.kemu;

   if (_kemu_select=='kemu1') { 
     this.setData({kemu: '科目一', timushu: '100', shijian: '45'});
   } else {
     this.setData({kemu: '科目四', timushu: '50', shijian: '30'});
   }
   

   var that = this;  
   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight, scrollHeight: res.windowHeight});
     }
   });
 }  
})