var app = getApp();
var datalist = require('../data/data.js');  
var arr3 = app.globalData.navList;
var navrr =[];
Page({
  showSanJiao:function(e){
    var idx = e.currentTarget.dataset.id;
     for( var i  in arr3 ){
        arr3[i].navShow = false;
     }
    arr3[idx].navShow = true;
  },
  data:{    
    
    navList: app.globalData.navList,
    nodes: "<h3 style='color:#c0025a;display:inline;margin-top:20px;text-aligh:center;'>顶级品牌 创医学美容新篇章</h3>",
    nodes1:"<h3 style='color:#c0025a;display:inline;margin-top:20px;text-aligh:center;'>四大科室 只为塑造完美尊贵</h3>",
    nodes2:"<h3 style='color:#c0025a;display:inline;margin-top:20px;text-aligh:center;'>国际医师部 量身定制个性服务</h3>",
  
  },
  onLoad: function (options) {
    this.showSanJiao;
    this.setData({
      arr1: datalist.datalist,
      arr2: datalist.datalist2   
    })
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
 
    wx.setNavigationBarTitle({
      title: '品牌介绍-南昌莱美整形美容医院'
    })
    
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function (options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

});

