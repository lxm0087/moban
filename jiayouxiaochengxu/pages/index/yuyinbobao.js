
var b64 = require('../../utils/b64.js');

var that = null;

var mapContext = null; //地图句柄

var mapDistStep = 200; //地图播报触发距离
var timerStep = 1500; //定位触发时间

var myBobaoYuYin = null; //音频对象

var SYS_MAP_REFRESH = false; //正在刷新地图
var timer_refresh = null; //刷新地图的定时器
var timer_checkpos = null; //刷新地理位置的定时器

var SYS_BOBAO_DANGQIAN = 0; //当前播报ID
var SYS_BOBAO_PLAYING = false; //正在播报

//获取应用实例
var app = getApp()
Page({
  data: {
    pageHeight: 480,   scrollHeight: 480, pageWidth: 320,

    my_long:0, my_lat: 0,
    map_markers: [], map_polylines: [],

    label_map_center_longlat: '', 

    yuyin_mulu: 'https://www.jyouw.cn/jiayouxueche/io/yuyin/kemu3yuyin/',
    yuyin_baitian: [], //语音素材列表
    yuyin_yejian: [], //语音素材列表
    yuyin_zong: [], //语音素材合并后

    xianlu_list: [], //用户定义的线路

    yyBobao_play: false, //是否开启播放
    audio_src: '', //语音播报的音频文件路径

    mode_list: 'yuyin', //yuyin语音模式显示语音, liebiao列表模式显示已定义的播报点

    duration: 500,
    userInfo: {}  
  },
 
 //返回我的位置
 button_wodeweizhi: function(e) {
   mapContext.moveToLocation();
 },
 
 //播放下一个
 button_bofangxiayige: function(e) {
   if (SYS_BOBAO_PLAYING) {
     //that.setData({ label_map_center_longlat: '前一播报未完成' }); 
     return(false); 
   }

   console.log(SYS_BOBAO_DANGQIAN + " of " + (that.data.xianlu_list.length - 1));

   if (SYS_BOBAO_DANGQIAN > that.data.xianlu_list.length - 1) {
     that.setData({ label_map_center_longlat: '已播放至最后一条' });
     return(false);
   }

   that.play_audio_by(SYS_BOBAO_DANGQIAN);

   SYS_BOBAO_DANGQIAN = SYS_BOBAO_DANGQIAN + 1; //当前加1

 },

 //刷新地图上的覆盖物
 refresh_map_markers: function(e) {
   //图钉地图中心点
   //var _map_center = { iconPath: "../../images/icon.center.png", id: 99, 
   //                    latitude: parseFloat(that.data.my_lat), longitude: parseFloat(that.data.my_long), width: 17, height: 32 };

   //覆盖物
   var _markers = []; 
   //多条连线
   var _polylines = [];
   //图标数字
   var _markerpng = "";
   var _list = that.data.xianlu_list;
   for(var _i=0; _i<_list.length; _i++) {
     if (_i <= 34) { _markerpng = _i + 1; } else { _markerpng = "0"; }
     console.log("播报到: " + SYS_BOBAO_DANGQIAN);
     //播放过头
     if (_i < SYS_BOBAO_DANGQIAN) { _markerpng = 'over'; }
     //全部播完, 点亮图标 
     if (_i >= SYS_BOBAO_DANGQIAN) { if (_i <= 34) { _markerpng = _i + 1; } else { _markerpng = "0"; } }

     //添加当前点
     _markers.push({ iconPath: "../../images/map.markers." + _markerpng + ".png", id: _i + 1,
                     latitude: parseFloat(_list[_i].plat), longitude: parseFloat(_list[_i].plong), width: 32, height: 32 });

     //添加连线, 当前点到下一点
     if (_i < _list.length - 1) {
       var _lines = {
         points: [{ longitude: parseFloat(_list[_i].plong), latitude: parseFloat(_list[_i].plat) }, 
                  { longitude: parseFloat(_list[_i + 1].plong), latitude: parseFloat(_list[_i + 1].plat) }],
         color: "#FF0000DD", width: 2, dottedLine: true
       }
       _polylines.push(_lines);
     }
   }

   //赋值, 显示在地图上
   that.setData({ map_markers: _markers, map_polylines: _polylines});
   setTimeout(function() { SYS_MAP_REFRESH = false; }, 100);
 },

 onUnload: function(options) {
   clearInterval(timer_checkpos);

 },

 onLoad: function (options) { //console.log(' index onload ');
   that = this;

   SYS_BOBAO_DANGQIAN = 0; //当前播报ID
   SYS_BOBAO_PLAYING = false; //正在播报

   wx.getSystemInfo({
     success: function(res) { //console.log("屏高: " + res.windowHeight);
       that.setData({ pageWidth: res.windowWidth, pageHeight: res.windowHeight-44, scrollHeight: res.windowHeight - 44});
     }
   });

   //从缓存读取播报列表
   var __YYBOBAO = JSON.parse(wx.getStorageSync('YYBOBAO'));
   that.setData({ xianlu_list: JSON.parse(b64.base64_decode(b64.base64_decode(__YYBOBAO.content))), my_long: __YYBOBAO.plong, my_lat: __YYBOBAO.plat });
   that.refresh_map_markers();

   console.log("播报节点列表数据");
   console.log(that.data.xianlu_list);

   mapContext = wx.createMapContext('mymap'); 
 
   that.setData({ label_map_center_longlat: '准备就绪' });
    
   //定时刷新当前位置
   timer_checkpos = setInterval(function(){ that.timer_checkpos(); }, timerStep);
 },

 //内部函数
 _Rad: function(d){
       return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
 
 },
 //计算距离函数
 GetDistance: function (lat1,lng1,lat2,lng2) {
   var radLat1 = that._Rad(lat1);
   var radLat2 = that._Rad(lat2);
   var a = radLat1 - radLat2;
   var  b = that._Rad(lng1) - that._Rad(lng2);
   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
   Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
   s = s *6378.137 ;// EARTH_RADIUS;
   s = Math.round(s * 10000) / 10000; //输出为公里
   s = Math.round(s * 1000); //输出为米
   return s;
 },

 //语音播报播放音频结束
 yyBobao_playend: function(e) {
   console.log("播报结束");
   SYS_BOBAO_PLAYING = false;
   //that.setData({ label_map_center_longlat: '' }); 
   //myBobaoYuYin = null;
 },

 //播放指定的语音文件
 play_audio_by: function(_file) {
   if (SYS_BOBAO_PLAYING) {
     //that.setData({ label_map_center_longlat: '前一播报未完成' }); 
     return(false); 
   }
   if (_file > that.data.xianlu_list.length - 1) {
     console.log("超出长度啦");
     return(false);      
   }

   console.log(_file + " 播报开始 " + that.data.xianlu_list[_file].id);
   SYS_BOBAO_PLAYING = true;
   that.setData({ //label_map_center_longlat: (_file + 1) + '. ' + that.data.xianlu_list[_file].title, 
                  audio_src: that.data.xianlu_list[_file].id, 
                  yyBobao_play: true });

   //播报
   myBobaoYuYin = wx.createAudioContext('yyBobao'); console.log(myBobaoYuYin); console.log("运行play");
   setTimeout(function () { myBobaoYuYin.play(); }, 200);


   setTimeout(function() { that.refresh_map_markers(); }, 1000);   
 },

 //检测节点
 timer_checkpos: function(e) {
   if (SYS_BOBAO_PLAYING) {
     //that.setData({ label_map_center_longlat: '前一播报未完成' }); 
     return(false); 
   }

   //that.setData({ label_map_center_longlat: '正在定位 ...' });
   wx.getLocation({
     type: 'gcj02', //wgs84
     success: function(res) {
       //获取当前播报点的资料料
       if (SYS_BOBAO_DANGQIAN <= that.data.xianlu_list.length - 1) { 
         //距离计算
         var _d = that.GetDistance(parseFloat(res.latitude), parseFloat(res.longitude), 
                                   parseFloat(that.data.xianlu_list[SYS_BOBAO_DANGQIAN].plat), parseFloat(that.data.xianlu_list[SYS_BOBAO_DANGQIAN].plong));
 
         var _s = parseFloat(res.latitude).toFixed(4) + ' , ' + parseFloat(res.longitude).toFixed(4) + ' to ' + 
                  parseFloat(that.data.xianlu_list[SYS_BOBAO_DANGQIAN].plat).toFixed(4) + ' , ' + parseFloat(that.data.xianlu_list[SYS_BOBAO_DANGQIAN].plong).toFixed(4);
         console.log('位置: ' + _s + ' , 距离: ' + _d);

         that.setData({ label_map_center_longlat: (SYS_BOBAO_DANGQIAN + 1) +  '. ' + that.data.xianlu_list[SYS_BOBAO_DANGQIAN].title });

         that.setData({ my_long: res.longitude, my_lat: res.latitude }); //保存我当前的经纬度
 
         //如果接近播报点点, 距离小于于 xxx, 则播报一下
         if (_d <= mapDistStep) { that.button_bofangxiayige(e); }

       } else {
         that.setData({ label_map_center_longlat: '播报完毕' });
         that.refresh_map_markers();
         setTimeout( function() { clearInterval(timer_checkpos); }, 2000);
       }
       //重新对齐显示当前位置
       mapContext.moveToLocation();
     }
   });

 },
}) 