// pages/shebei/shebei.js
var app = getApp();
var datalist = require('../data/data.js');
var arr3 = app.globalData.navList;
Page({
  showSanJiao: function (e) {
    var idx = e.currentTarget.dataset.id;
    for (var i in arr3) {
      arr3[i].navShow = false;
    }
    arr3[idx].navShow = true;
  },
  showShebei:function(){
    this.setData({
      listShow: false,
    })
  }, 
  closeDetail:function(){
    this.setData({
      listShow: true,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    navList: app.globalData.navList,
    listShow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '尖端设备-南昌莱美整形美容医院'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
