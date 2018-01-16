
var b64 = require('../../utils/b64.js');

var that = null;

//获取应用实例  
var app = getApp()
Page({
  data: {
    pageHeight: 480,
    scrollHeight: 480,

    history_list: [],

    noresult: false, //约车无数据

    userInfo: {}
  },


  load_order_history: function () {
    var _userid = wx.getStorageSync('dhua'); console.log("用户ID: "); console.log(_userid);
    if (!_userid) {
      that.setData({ noresult: true });
      return (true);
    };

    //发起网络请求
    wx.request({
      url: 'https://www.jyouw.cn/jiayouxueche/io/yueche/lishi.php',
      data: { userid: _userid },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data);

        var _history = []; var _one = {};
        if (res.data.jinxing) { //进行中的
          if (res.data.jinxing.actived == 's') { //客户预约中
            _one.actived = '';
            _one.addressof = "*";
            _one.autoid = '';
            _one.kemu = "*";
            _one.teachuid = "*";
            _one.xming = "客服审核中";
            _one.ytime = "*";
            _one.zhuangtai = '审核中';
            //未完成订单
            _one.showtitle = true; _one.finishtitle = '未完成订单'; _one.titlecolor = '#50bd24';

          } else {
            _one.actived = '';
            _one.addressof = b64.base64_decode(res.data.jinxing.addressof);
            _one.autoid = '';
            _one.kemu = "科目" + b64.base64_decode(res.data.jinxing.kemu);
            _one.teachuid = res.data.jinxing.teachuid;
            _one.xming = b64.base64_decode(res.data.jinxing.xming);
            _one.ytime = res.data.jinxing.ytime;
            _one.zhuangtai = '进行中';
            //未完成订单
            _one.showtitle = true; _one.finishtitle = '未完成订单'; _one.titlecolor = '#50bd24';
          }
          _history.push(_one);
        }

        var _actived = { s: '客服预约中', y: '等待接送上车', w: '前往驾校途中', l: '正在练车', p: '未评论', n: '已完成' };
        if (res.data.wancheng) {
          for (var _i = 0; _i < res.data.wancheng.length; _i++) { //已完成的
            _one = {};
            _one.actived = res.data.wancheng[_i].actived;
            _one.addressof = b64.base64_decode(res.data.wancheng[_i].addressof);
            _one.autoid = res.data.wancheng[_i].autoid;
            _one.kemu = "科目" + b64.base64_decode(res.data.wancheng[_i].kemu);
            _one.teachuid = res.data.wancheng[_i].teachuid;
            _one.xming = b64.base64_decode(res.data.wancheng[_i].xming);
            _one.ytime = res.data.wancheng[_i].ytime;
            if (res.data.wancheng[_i].actived) {
              _one.zhuangtai = _actived[res.data.wancheng[_i].actived];
            } else { _one.zhuangtai = '异常状态'; }
            //完成订单
            _one.finishtitle = '已完成订单'; _one.titlecolor = '#666666';
            if (_i == 0) { _one.showtitle = true; } else { _one.showtitle = false; }

            _history.push(_one);
          }
        }

        //console.log(_history);
        //console.log(that);

        if (_history.length <= 0) { that.setData({ noresult: true }); } //无数据

        that.setData({ history_list: _history });
      }
    });
  },

  onLoad: function (options) {
    that = this;
    that.load_order_history();

    wx.getSystemInfo({
      success: function (res) {
        that.setData({ pageHeight: res.windowHeight, scrollHeight: res.windowHeight });
      }
    });
  }
})