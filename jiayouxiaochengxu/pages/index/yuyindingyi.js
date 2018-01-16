
var b64 = require('../../utils/b64.js');

var that = null;

var mapContext = null; //地图句柄

var test1 = null; var test2 = null; //音频

var SYS_MAP_REFRESH = false; //正在刷新地图
var timer_refresh = null; //刷新地图的定时器

var SYS_DROP_MAP = false; //拖动地图开始

var __OS = "";

var xianlu_title = ""; //路线标题

//获取应用实例
var app = getApp()
Page({
  data: {
    pageHeight: 480,   scrollHeight: 480, pageWidth: 320,

    my_long:0, my_lat: 0,
    map_controls: [], map_markers: [], map_polylines: [],

    map_center_longlat: '', label_map_center_longlat: '',

    yuyin_mulu: 'https://www.jyouw.cn/jiayouxueche/io/yuyin/kemu3yuyin/',
    yuyin_baitian: [], //语音素材列表
    yuyin_yejian: [], //语音素材列表
    yuyin_zong: [], //语音素材合并后

    xianlu_list: [], //用户定义的线路


    mode_list: 'yuyin', //yuyin语音模式显示语音, liebiao列表模式显示已定义的播报点

    duration: 500,
    userInfo: {}  
  },

 //弹出当前播报的语音列表
 button_qiehuanmoshi: function(e) {
   if (that.data.mode_list == 'yuyin') { 
     that.setData({ mode_list: 'liebiao' }); 
   } else {
     that.setData({ mode_list: 'yuyin' }); 
   }
 },

 //保存路线按钮
 button_baocunxianlu: function(e) {
   if (that.data.xianlu_list.length <= 0) { return(false); }

   var _list = that.data.xianlu_list;
   var _content = b64.base64_encode(JSON.stringify(_list));
   console.log(_content);

   var _data = {userid: wx.getStorageSync('WXOPENID'), title: b64.base64_decode(xianlu_title), plong: _list[0].plong, plat: _list[0].plat, content: _content};
   console.log(_data);
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yuyin/set_yuyin.php',
     data: _data,
     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
     success: function(res){
       //返回主页面
       wx.navigateBack({ delta: 2 });    //wx.redirectTo({ url: 'lianxi?pageof=kemu3'});
     },
     fail: function() {
       // fail
     },
     complete: function() {
       // complete
     }
   })

 },

 //线路点击, 删除, 上移, 下移移
 click_liebiao: function(e) { console.log(e.currentTarget.dataset);
   var _do = e.currentTarget.dataset.do;
   var _id = e.currentTarget.dataset.id;
   var _sx = e.currentTarget.dataset.sx;

   var _list = that.data.xianlu_list; //旧的播报列表
   var _list_new = []; //新的播报列表
   var _bobaodian = {}; //播报点对象

    //执行删除
   if (_do == 'del') {

     var _j = 0; //顺序号
     for(var _i=0; _i<_list.length; _i++) { //循环旧的播报列表
       if (_list[_i].shunxu == _sx) {  console.log(_i + " 跳过 id = " + _list[_i].id); continue; } //当前删除点, 跳过
       _bobaodian = _list[_i]; _bobaodian.shunxu = _j; //复制当前播报点
       _list_new.push(_bobaodian); //加入到新的播报列表中
       _j++; //顺序号加1
     }
   }
   //执行下移
   if (_do == 'down') {  console.log(" down = " + _id);
     var _j = 0; //顺序号
     for(var _i=0; _i<_list.length; _i++) { //循环旧的播报列表
       if (_list[_i].shunxu == _sx) { _j = _i; console.log(_i + " 要下移的是 " + _list[_i].id); break; } //当前删除点, 跳过
     }
     if (_j >= _list.length - 1) {
       return(false); //最后一条了, 不能下移
     } else {
       //对调, 并修改顺序号
       _bobaodian = _list[_j + 1];
       _list[_j + 1] = _list[_j]; _list[_j + 1].shunxu = _list[_j + 1].shunxu + 1;
       _list[_j] = _bobaodian; _list[_j].shunxu = _list[_j].shunxu - 1;
     }
     _list_new = _list; 
   }
   //执行上移
   if (_do == 'up') {
     var _j = 0; //顺序号
     for(var _i=0; _i<_list.length; _i++) { //循环旧的播报列表
       if (_list[_i].shunxu == _sx) { _j = _i; console.log(_i + " 要下移的是 " + _list[_i].id); break; } //当前删除点, 跳过
     }
     if (_j <= 0) {
       return(false); //第一条了, 不能上移
     } else {
       //对调, 并修改顺序号
       _bobaodian = _list[_j - 1];
       _list[_j - 1] = _list[_j]; _list[_j - 1].shunxu = _list[_j - 1].shunxu - 1;
       _list[_j] = _bobaodian; _list[_j].shunxu = _list[_j].shunxu + 1;
     }
     _list_new = _list; 
   }

   //更新界面
   that.setData({ xianlu_list: _list_new });
   that.refresh_map_markers();
 },

 //刷新地图上的中心点
 refresh_map_controls: function(e) { console.log("刷新地图上的中心点");
   var _control = {
      id: 999,
      iconPath: '../../images/icon.center.png',
      position: {
        left: that.data.pageWidth / 2 - 8,
        top: (that.data.scrollHeight + 44 - 240) / 2 - 24,
        width: 16,
        height: 32
      },
      clickable: false
    };
    that.setData({ map_controls: [_control] });
 },

 //刷新地图上的覆盖物
 refresh_map_markers: function(e) {
   //图钉地图中心点
   var _map_center = { iconPath: "../../images/icon.center.png", id: 99, latitude: parseFloat(that.data.my_lat), longitude: parseFloat(that.data.my_long), width: 17, height: 32 };
   //覆盖物
   var _markers = []; 
   //多条连线
   var _polylines = [];

   var _markerpng = "";
   var _list = that.data.xianlu_list;
   for(var _i=0; _i<_list.length; _i++) {
     if (_i <= 34) { _markerpng = _i + 1; } else { _markerpng = "0"; }
     //添加当前点
     _markers.push({ iconPath: "../../images/map.markers." + _markerpng + ".png", id: _i + 1, latitude: parseFloat(_list[_i].plat), longitude: parseFloat(_list[_i].plong), width: 32, height: 32 });

     //添加连线, 当前点到下一点
     if (_i < _list.length - 1) {
       var _lines = {
         points: [{ longitude: parseFloat(_list[_i].plong), latitude: parseFloat(_list[_i].plat) }, { longitude: parseFloat(_list[_i + 1].plong), latitude: parseFloat(_list[_i + 1].plat) }],
         color: "#FF0000DD", width: 2, dottedLine: true
       }
       _polylines.push(_lines);
     }
   }

   

   that.setData({ map_markers: _markers, map_polylines: _polylines});

   setTimeout(function() { 
     SYS_MAP_REFRESH = false; 
   }, 100);
 },

 //点击语音
 click_yuyin: function(e) {
   var myDate = new Date();

   mapContext.getCenterLocation({
     success: function(res){
       //保存我当前的经纬度
       that.setData({ my_long: res.longitude, my_lat: res.latitude });

   var _id = parseInt(e.currentTarget.dataset.id); //从接口读取的数据是从1开始
   var _list = that.data.xianlu_list;
   var _xianlu = {"shunxu": _list.length, "id": _id, 
                  "plong": res.longitude, "plat": res.latitude, 
                  "title": that.data.yuyin_zong[_id - 1].title};

   //提示信息
   that.setData({ label_map_center_longlat: '添加 ' + _id + '. ' + that.data.yuyin_zong[_id - 1].title});
   setTimeout(function() { that.setData({ label_map_center_longlat: '请拖动地图添加播报点' }); }, 2000);


   //添加一个节点到数组中
   _list.push(_xianlu);
   that.setData({ xianlu_list: _list });

   //在地图上刷新输出数组
   if (SYS_MAP_REFRESH) {
     setTimeout(function() { SYS_MAP_REFRESH = true; that.refresh_map_markers(); }, 100);
    } else { SYS_MAP_REFRESH = true; that.refresh_map_markers(); }



       //在地图上刷新中心点
       //if (SYS_MAP_REFRESH) {
       //  setTimeout(function() { SYS_MAP_REFRESH = true; that.refresh_map_markers(); }, 500);
       //} else { SYS_MAP_REFRESH = true; that.refresh_map_markers(); }

       //移动地图后的中心点
       //console.log("移动后地图的中心点 " + res.longitude + " # " + res.latitude); 
     }
   })



 },

 //拖动了地图, 重置中心点
 reset_markers: function(e) { return(false);
   //忽略掉第一次点击
   if (__OS == 'android') {
     if (!SYS_DROP_MAP) { SYS_DROP_MAP = true; return(false); }
     SYS_DROP_MAP = false;
   }

   //移了地图
   var myDate = new Date();
   that.setData({ label_map_center_longlat: " 09:46 地图, " + myDate.getMilliseconds() });
   mapContext.getCenterLocation({
     success: function(res){
       //保存我当前的经纬度
       that.setData({ my_long: res.longitude, my_lat: res.latitude });

       //在地图上刷新中心点
       //if (SYS_MAP_REFRESH) {
       //  setTimeout(function() { SYS_MAP_REFRESH = true; that.refresh_map_markers(); }, 500);
       //} else { SYS_MAP_REFRESH = true; that.refresh_map_markers(); }

       //移动地图后的中心点
       //console.log("移动后地图的中心点 " + res.longitude + " # " + res.latitude); 
     }
   })

 },

 //调取定位回到中心点
 getCenterLocation: function () {
   mapContext.getCenterLocation({
     success: function(res){
       that.setData({ map_center_longlat: (Math.floor(res.longitude * 100000) / 100000) + " , " + (Math.floor(res.latitude * 100000) / 100000)});
     }
   })
 },

 //移动回到中心点
 moveToLocation: function () {
   mapContext.moveToLocation();
 },

 onLoad: function (options) { //console.log(' index onload ');
   that = this;
   
   xianlu_title = options.title; console.log("参数啦 " + xianlu_title);

   wx.getSystemInfo({
     success: function(res) { //console.log("屏高: " + res.windowHeight);

       that.setData({ pageWidth: res.windowWidth, pageHeight: res.windowHeight-44, scrollHeight: res.windowHeight - 44});

       //操作系统判断
       __OS = "_" + res.system + "_"; __OS = __OS.toLowerCase();
       if (__OS.indexOf("ios") > 0) { __OS = 'ios'; } else {
         if (__OS.indexOf("ios") > 0) { __OS = 'android'; } else { __OS = 'android'; }
       }

       that.setData({ label_map_center_longlat: "准备就绪" });
       setTimeout(function() { that.setData({ label_map_center_longlat: '请拖动地图添加播报点' }); }, 2000);

     }
   });

   wx.getLocation({
     type: 'gcj02',
     success: function(res) {
       //console.log( res.latitude + " , " + res.longitude);
       that.setData({ my_long: res.longitude, my_lat: res.latitude }); //保存我当前的经纬度

       //在地图上显示中心点
       setTimeout(function() { that.refresh_map_controls(); }, 1500);
     }
   });

   mapContext = wx.createMapContext('mymap');

   //test1 = wx.createAudioContext('myAudio1');
   //test2 = wx.createAudioContext('myAudio2');

   //setTimeout(function() { test1.play(); }, 2000);

   //setTimeout(function() { test2.play(); }, 5000);

   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/yuyin/show_resource.php',
     data: {},
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){ //console.log("扩展信息获取");
       var _yuyin = res.data; //console.log(_yuyin);

       //分解存储相册, 详情
       that.setData({ yuyin_mulu: _yuyin.qian, yuyin_baitian: _yuyin.list.y, yuyin_yejian: _yuyin.list.n, yuyin_zong: _yuyin.list.y.concat(_yuyin.list.n) });
     }
   });

 }
}) 