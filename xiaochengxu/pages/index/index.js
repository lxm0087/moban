// pages/doctors/doctors.js
var app = getApp();
var arr3 = app.globalData.navList;
var navrr = [];
Page({
  showSanJiao: function (e) {
    var idx = e.currentTarget.dataset.id;
    for (var i in arr3) {
      arr3[i].navShow = false;
    }
    arr3[idx].navShow = true;
  },
  /**
   * 页面的初始数据
   */
  data: {
    navList: app.globalData.navList,
    imgUrls:[
       'http://www.nclaimei.com/d/file/MobileCom/mnav/ban/2017-11-23/6459d24ccbfef75236afb673e7eef752.jpg',
       'http://www.nclaimei.com/d/file/MobileCom/mnav/ban/2017-08-01/c6d2ae6a295c3c2263fd69b116c69f90.jpg',
       'http://www.nclaimei.com/d/file/MobileCom/mnav/ban/2017-11-29/6fea9f461ebf0fd89b5121ee860c1a31.jpg',
       'http://www.nclaimei.com/d/file/MobileCom/mnav/ban/2017-11-29/db1b1c062ac98332ebf85e5a15bb9768.jpg',
       'http://www.nclaimei.com/d/file/MobileCom/mnav/ban/2017-11-29/9b5dc371fcb04204f2d5c04bb8dfa293.jpg',

    ],
    imgarr:[
      'http://www.nclaimei.com/MobileCom/images/nav1.png',
      'http://www.nclaimei.com/MobileCom/images/nav2.png',
      'http://www.nclaimei.com/MobileCom/images/nav3.png',
      'http://www.nclaimei.com/MobileCom/images/nav4.png',
      
    ],
    xmarr:[
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/83eaee2fd9c101256f4d23292a1f82a6.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/f355a77fa9020cce09400f130333bd0a.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/8926b4c09648a92bea59517d28dd3951.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/40cce7d72a425f700a17ae2fbe42c27d.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/933d7339eacdba5a93f4f8fa39e5f09c.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/6d7e90804bd7e388e343f98235b24be7.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/ff0b1f5be7440471dc7adf1710b9b656.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/6aac7d9920af7971444f2f21cef2e2cd.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/6aac7d9920af7971444f2f21cef2e2cd.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/468e388d1116e48d9ac6daa7d6a3f2ce.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/c059218d9e31c42a496de8672767cb94.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/rmxm/2017-11-29/ff0b1f5be7440471dc7adf1710b9b656.png',

    ],
    anlilist:[
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/algl/2017-11-30/1896ea060fac347fdc7c25a2e5922674.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/algl/2017-11-30/53152c33676703ea6ee984c8a74b9c61.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/algl/2017-11-30/44459fa93953d5c14c079c276a954437.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/algl/2017-11-30/9735ab6a4203ab3736028ace49247fcd.png',
      'http://www.nclaimei.com/d/file/MobileCom/ymgl/algl/2017-11-30/befe17c9a10d260e20646d0c6733abad.png',
    ],
    indicaDots:true,
    autoplay:true,
    interval:5000,
    indicatorColor:'#fff',
    indicatorActiveColor:'#c0025a'
  },
  changeIndicatorDots: function(e) {
      this.setData({
        indicatorDots: !this.data.indicatorDots
      })
    },

  openZoosUrl:function(){
    wx.NavigateTo({
      url:'../aboutus/aboutus'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  
})
