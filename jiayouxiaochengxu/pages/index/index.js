
var b64 = require('../../utils/b64.js');

var that = null;

var MyLong = 0; var MyLat = 0;

//获取应用实例  
var app = getApp()
Page({
  data: {
    pageHeight: 480,  scrollHeight: 480,  pageWidth: 320,

    refeshing: false, //下拉刷新状态
    loading: false, //载入更多状态
    loadinghints: '载入更多 ...', 
    jiaxiao: [],
    my_long: 0, my_lat: 0, //我的经纬度
    JXPage: 1, //驾校分页, 默认第1页

    duration: 500,  
    userInfo: {}  
  },

 //重新载入驾校
 jiaxiao_reload: function() {
   console.log("滚动到顶部");

 },

 //载入更多驾校
 jiaxiao_more: function() {
   console.log("滚动到底部，载入更多驾校");
   that.setData({ loading: true });
   that.LoadJiaXiao(that.data.my_long, that.data.my_lat, that.data.JXPage + 1, false);
 },

// onReachBottom: function() {
    // Do something when page reach bottom.
//     console.log('circle 下一页');
 //},
 onPullDownRefresh: function() {
   wx.stopPullDownRefresh();

   // Do something when pull down.
   console.log('顶部下拉刷新');
   that.setData({refeshing: true});

   wx.getLocation({
     type: 'gcj02',
     success: function(res) {
       MyLong = res.longitude; MyLat: res.latitude;
       console.log( res.latitude + " , " + res.longitude);
       that.setData({ my_long: MyLong, my_lat: MyLat }); //保存我当前的经纬度
       that.LoadJiaXiao(MyLong, MyLat, 1, false); //载入第1页
     }
   });
 },

 //获取驾校部分资料
 get_jiaxiao_data: function(_id) {
   var _jx = that.data.jiaxiao; //console.log(_jx);
   for(var _i=0; _i<_jx.length; _i++) {
     if (_jx[_i].itemid == _id) {
       //存入缓存
       wx.setStorageSync('jiaxiaodata', b64.base64_encode(JSON.stringify(_jx[_i])));
       //跳转页面
       wx.navigateTo({ url: 'jiaxiaoxinxi' });
       break;
     }
   }

 },

 //单击驾校列表的一项
 click_jiaxiao: function(e) {
   var _to = e.currentTarget.dataset.itemid;
   that.get_jiaxiao_data(_to);
 },

 //单击驾校列表的计时收费
 click_jiaxiao_jishishoufei: function(e) {
   var _to = e.currentTarget.dataset.itemid;
   that.get_jiaxiao_data(_to);
 },

 //单击底部工具栏
 toolbar_jump_to: function(e) {
   var _to = e.currentTarget.dataset.to;

   if (_to == 'index') {
     //wx.redirectTo({ url: '/pages/index/index' });
   };
   if (_to == 'lianxi') {
     wx.redirectTo({ url: '/pages/index/lianxi' });
   };
   if (_to == 'jiaolian') {
     wx.redirectTo({ url: '/pages/index/jiaolian' });
   }
 },

 //输出驾校列表
 pressJiaXiao: function(_list) {
   var _one = null; var _list_new = []; var _title = "";
   if (that.data.JXPage > 1) { _list_new = that.data.jiaxiao; } //如果不是第一页, 则累加驾校数组
   for(var _i=0; _i<_list.length; _i++) {
     _one = _list[_i];
     _one.title = b64.base64_decode(_one.title); _one.titleshort = _one.title.substr(0, 6);
     _one.tedian = b64.base64_decode(_one.tedian);
     _one.thumb = _one.thumb.replace("http://", "https://");
     //_one.tedian = b64.base64_decode(_one.tedian);
     _list_new.push(_one); //console.log(_one);
   }

   that.setData({ jiaxiao: _list_new });
 },

 //载入驾校列表
 LoadJiaXiao: function(_long, _lat, _page, _cache) {
   that.setData({ JXPage : _page });

   if (!_cache && (_page == 1)) { //非强制缓存, 第一页
     console.log("从缓存读取驾校列表"); //从缓存读取
     
     var _list = wx.getStorageSync('JIAXIAOLIEBIAO');
     if (_list) { 
       console.log("从缓存读取驾校列表 ok");   
       setTimeout(function(){ that.setData({refeshing: false}); }, 500);  
       that.pressJiaXiao(_list); 
       return(true); 
     }
   } 

   console.log("从网络读取驾校列表"); //从网络读取取

   var _data = {page: _page, jd: _long, wd: _lat, fs: "zonghe"}; console.log(_data);
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/jiaxiao/jiaxiao.list.new.php',
     data: _data,
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){ console.log(res.data);
       setTimeout(function(){ that.setData({refeshing: false}); }, 500); 
       if (res.data.ok != 'y' || !res.data.list || res.data.list.length <= 0) { that.setData({ loadinghints: "没有驾校数据了" }); return(false); }

       var _list = res.data.list;
       console.log("从网络读取驾校列表 ok"); //从网络读取取

       wx.setStorageSync('JIAXIAOLIEBIAO', _list);
       that.pressJiaXiao(_list);
     },
     fail: function() {
       // fail
       console.log("从网络读取驾校列表 fail"); //从网络读取取
     }, 
   });
 },

 onLoad: function () { console.log(' index onload ');
   that = this;

   wx.getSystemInfo({
     success: function(res) { console.log("屏宽: " + res.windowWidth + " , 屏高: " + res.windowHeight);
       that.setData({pageWidth: res.windowWidth, pageHeight: res.windowHeight-44, scrollHeight: res.windowHeight - 44});
     }
   });

   if (MyLong == 0 && MyLat == 0) {
     console.log("定位经纬度");
     wx.getLocation({
       type: 'gcj02',
       success: function(res) {
         MyLong = res.longitude; MyLat = res.latitude;
         console.log( res.latitude + " , " + res.longitude);
         that.setData({ my_long: MyLong, my_lat: MyLat }); //保存我当前的经纬度
         that.LoadJiaXiao(MyLong, MyLat, 1, false); //载入第1页
       }
     });
   } else {
     console.log("缓存的经纬度");
     that.setData({ my_long: MyLong, my_lat: MyLat }); //保存我当前的经纬度
     that.LoadJiaXiao(MyLong, MyLat, 1, false); //载入第1页
   }
 },

  onShareAppMessage: function () {
    return {
      title: '驾优考驾照™',
      desc: '驾优考驾照 报驾校+练科目+约教练',
      path: '/pages/index/index'
    }
  }
})  