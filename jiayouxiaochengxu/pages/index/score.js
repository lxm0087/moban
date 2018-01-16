
//获取应用实例  
var app = getApp()  
Page({  
  data: {
    pageHeight: 480, pageWidth: 320,
    scrollHeight: 480,

    score_result: 'icon.kaoshi.shashou.png',
    times: '--:--', score: '0',
    userInfo: {}  
  },

 click_to_home: function(e) {
   wx.navigateTo({
     url: 'index'
  })
 },

 onLoad: function (options) { console.log(options.times);
   var _times = Math.floor(options.times / 60) + ":" + (options.times - Math.floor(options.times / 60) * 60);
   var _score = Math.floor(options.score); var score_result = 'icon.kaoshi.shashou.jpg';
   if (_score < 90) {
     this.setData({score_result: 'icon.kaoshi.shashou.jpg'}); //马路杀手
   } else {
     if (_score >= 98) {
       this.setData({score_result: 'icon.kaoshi.cheshen.jpg'}); //车神
     } else {
       this.setData({score_result: 'icon.kaoshi.bangbangda.jpg'}); //棒棒哒
     }
   }

   this.setData({times: _times, score: options.score});

   var that = this;  
   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight, pageWidth: res.windowWidth, scrollHeight: res.windowHeight});
     }
   });
 }  
})