// pages/luxian/luxian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      //定位类型 wgs84, gcj02
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        wx.openLocation({
          //当前经纬度
          latitude: 28.651024,
          longitude: 115.908513,
          //缩放级别默认28
          scale: 28,
          //位置名
          name: '测试地址',
          //详细地址
          address: '火星路24号',
          //成功打印信息
          success: function (res) {
            console.log(res)
          },
          //失败打印信息
          fail: function (err) {
            console.log(err)
          },
          //完成打印信息
          complete: function (info) {
            console.log(info)
          },
        })

      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (info) {
        console.log(info)
      },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '来院路线-南昌莱美整形美容医院'
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