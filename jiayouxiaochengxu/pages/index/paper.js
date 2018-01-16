
var b64 = require('../../utils/b64.js');

var _timenow = null; //当前时间
var _timeremain = 0; //剩余时间
var _timer = null;
var _kemu_select = 'kemu1';
var _answerof = ''; //当前题的答案
var _current_index = 0; //当前滑块swiper

//获取应用实例  
var app = getApp()
Page({  
  data: {
    dacolor: [], idcolor: [], idanswer: [], //0-100, 题目颜色, 题目答案
    showID: false, button_idlist: "paper.idlist.png", color_idlist: "#666666",
    doPause: false, button_pause: "paper.doing.png", color_pause: "#666666", text_pause: "暂停",

    swiper_current: 0, //当前滑块页

    //控制工具栏显示颜色
    showUA: false, showQA: false, showPG: false,
    showQA_image: 'show_false',  showQA_color: '#666666',
    showQA_image: 'show_false',  showQA_color: '#666666',

    showQA_A_BG: '#FFFFFF', showQA_B_BG: '#FFFFFF', showQA_C_BG: '#FFFFFF', showQA_D_BG: '#FFFFFF',
    swiper_show: true,

    pageHeight: 480,
    scrollHeight: 480,
    examList: [],  

    timelimit: '--:--',
    duration: 500,  
    userInfo: {}  
  },

 //交卷
 click_submit: function(){
   //计算得分
   var _sum = 0; var _answer = this.data.examList; var _answeruser = this.data.idanswer; 
   for(var _i=0; _i<this.data.examList.length; _i++) {
     if (_answer[_i].a == _answeruser[_i]) {
       if (_kemu_select == 'kemu1') { _sum = _sum + 1; } else { _sum = _sum + 2; }
     }

   }
   var _timemax = 0;
   if (_kemu_select == 'kemu1') { _timemax = 45 * 60; } else { _timemax = 30 * 60; } //总时间
   wx.redirectTo({
     url: 'score?score=' + _sum + "&times=" + (_timemax-_timeremain)
  })

  console.log("成绩为 " + _sum);
 },

 //单击ID列表, 跳转试题
 click_paper_no: function(e){
   console.log(e.currentTarget.dataset.idx);
   //this.setData({swiper_current: e.currentTarget.dataset.idx});
   this.setData({swiper_current: e.currentTarget.dataset.idx - 1, color_idlist: "#666666", button_idlist: "paper.idlist.png", showID: !this.data.showID});
 },

 swiper_change: function(e) {
   var _idx = e.detail.current; _current_index = e.detail.current;

 if (this.data.idanswer[_idx].toLowerCase() == this.data.examList[_idx].a.toLowerCase()) {
   this.setData({showUA: true});
 } else { this.setData({showUA: false}); }

 },

 //单击显答案
 click_pause: function(e){ 
   if (this.data.doPause) {
       var thatt = this;
       //开始倒计时
       _timer = setInterval(function(){
         _timeremain--; var _t = _timeremain;
         var _time = Math.floor(_t / 60) + ":" + (_t - Math.floor(_t / 60) * 60);
         thatt.setData({timelimit: _time});
         if (_timeremain <= 0) { thatt.click_submit(); clearInterval(_timer); } //强制交卷, 并清除定时器
       }, 1000);
     this.setData({color_pause: "#666666", button_pause: "paper.doing.png", doPause: !this.data.doPause, text_pause: "暂停"});
   } else {
     clearInterval(_timer);
     this.setData({color_pause: "#48c23d", button_pause: "paper.pause.png", doPause: !this.data.doPause, text_pause: "继续"});
   }
 },
 
 //单击弹出题目列表
 click_idlist: function(e){ 
   if (this.data.showID) {
     this.setData({color_idlist: "#666666", button_idlist: "paper.idlist.png", showID: !this.data.showID});
   } else {
     this.setData({color_idlist: "#48c23d", button_idlist: "paper.idlist.select.png", showID: !this.data.showID});
   }
 },

 click_answer_of: function(_index, _answer) {
   //如果已答题, 跳过
   if (this.data.idanswer[_index].length >= 1) {
     return(false);
   } 
   //console.log(this.data.examList[_index]); console.log("vs");
   //console.log(this.data.examList[_current_index]); 
   if (this.data.examList[_current_index].tp != 2) { //单选
     //答案加一, 颜色变一
     var _answer_new = this.data.idanswer;
     _answer_new[_index] = _answer.toUpperCase();

     var _idcolor_new = this.data.idcolor; var _dacolor_new = this.data.dacolor;
     //答案对错判断, 和我的答案
     if (_answer.toUpperCase() == this.data.examList[_index].a.toUpperCase()) {
       _idcolor_new[_current_index] = "#d7f7d5"; //正确, 绿色
       _dacolor_new[_current_index] = "#94f18e"; //正确, 绿色
     } else {
       _idcolor_new[_current_index] = '#fce8e8'; //错误, 红色
       _dacolor_new[_current_index] = "#f69797"; //错误, 红色
     }
     this.setData({idanswer: _answer_new, idcolor: _idcolor_new, dacolor: _dacolor_new});

     //变色特效
     var that = this;
     if (_answer == 'a') { 
       this.setData({showQA_A_BG: '#e9fde6'});
       setTimeout(function(){ that.setData({showQA_A_BG: '#FFFFFF'}); }, 150);
     } else if (_answer == 'b') { 
       this.setData({showQA_B_BG: '#e9fde6'});
       setTimeout(function(){ that.setData({showQA_B_BG: '#FFFFFF'}); }, 150);
     } else if (_answer == 'c') { 
       this.setData({showQA_C_BG: '#e9fde6'});
       setTimeout(function(){ that.setData({showQA_C_BG: '#FFFFFF'}); }, 150);
     } else if (_answer == 'd') { 
       this.setData({showQA_D_BG: '#e9fde6'});
       setTimeout(function(){ that.setData({showQA_D_BG: '#FFFFFF'}); }, 150);
     }

     //自动翻页
     console.log(_current_index + " 当前, 总 " + that.data.idanswer.length);
     if (_current_index <= that.data.idanswer.length - 2) {
       setTimeout(function(){ that.setData({swiper_current: _current_index + 1}); }, 400);
     }
   } else { //多选
     //如果已选, 则取消选择
     var _a = _answer.toUpperCase();
     if (_answerof.indexOf(_a) >= 0) {
       _answerof = _answerof.replace(_a, '').replace(_a, '');
     } else {
       _answerof = _answerof + _a;
     }

     //重新排序
     var _new = '';
     if (_answerof.indexOf('A') >= 0) {
       _new = _new + 'A'; this.setData({showQA_A_BG: '#e9fde6'}); //如果有, 标亮答案 
     } else { this.setData({showQA_A_BG: '#FFFFFF'}); } //取消标亮答案
     if (_answerof.indexOf('B') >= 0) {
       _new = _new + 'B'; this.setData({showQA_B_BG: '#e9fde6'}); 
     } else { this.setData({showQA_B_BG: '#FFFFFF'}); }
     if (_answerof.indexOf('C') >= 0) {
       _new = _new + 'C'; this.setData({showQA_C_BG: '#e9fde6'}); 
     } else { this.setData({showQA_C_BG: '#FFFFFF'}); }
     if (_answerof.indexOf('D') >= 0) {
       _new = _new + 'D'; this.setData({showQA_D_BG: '#e9fde6'}); 
     } else { this.setData({showQA_D_BG: '#FFFFFF'}); }

     _answerof = _new;  console.log('多选处理后 ' + _answerof); 
     console.log("点击答案" + _a);
   }

 },

//提交复选
 click_submit_duoxuan: function(e){ console.log(_current_index);
   //如果已答题, 跳过
   if (this.data.idanswer[_current_index].length >= 1) {
     return(false);
   } 

     //答案加一, 颜色变一
     var _answer_new = this.data.idanswer;
     _answer_new[_current_index] = _answerof.toUpperCase();

     var _idcolor_new = this.data.idcolor; var _dacolor_new = this.data.dacolor;
     //答案对错判断, 和我的答案
     if (_answerof.toUpperCase() == this.data.examList[_current_index].a.toUpperCase()) {
       _idcolor_new[_current_index] = "#d7f7d5"; //正确, 绿色
       _dacolor_new[_current_index] = "#94f18e"; //正确, 绿色
     } else {
       _idcolor_new[_current_index] = '#fce8e8'; //错误, 红色
       _dacolor_new[_current_index] = "#f69797"; //错误, 红色
     }
     this.setData({idanswer: _answer_new, idcolor: _idcolor_new, dacolor: _dacolor_new});

     //this.setData({answer_show: _answer_show});

   _answerof = ''; //清除旧值
   var that = this;
   setTimeout(function(){ that.setData({showQA_A_BG: '#FFFFFF', showQA_B_BG: '#FFFFFF', showQA_C_BG: '#FFFFFF', showQA_D_BG: '#FFFFFF'}); }, 150); 

     //自动翻页
     console.log(_current_index + " 当前, 总 " + that.data.idanswer.length);
     if (_current_index <= that.data.idanswer.length - 2) {
       setTimeout(function(){ that.setData({swiper_current: _current_index + 1}); }, 400);
     }

   console.log("提交复选 " + _answerof);
 },

 //单击答题
 click_answer_a: function(e){
   this.click_answer_of(e.currentTarget.dataset.idx-1, 'a');
 },
 click_answer_b: function(e){ 
   this.click_answer_of(e.currentTarget.dataset.idx-1, 'b');
 },
 click_answer_c: function(e){
   this.click_answer_of(e.currentTarget.dataset.idx-1, 'c');
 },
 click_answer_d: function(e){
   this.click_answer_of(e.currentTarget.dataset.idx-1, 'd');
 },

 onLoad: function (options) {
   _timenow = null; //当前时间
   _timeremain = 0; //剩余时间
   _timer = null;
   _kemu_select = 'kemu1';
   _answerof = ''; //当前题的答案

   _current_index = 0;
   _kemu_select = options.kemu;
   var _km = '';
   if (_kemu_select == 'kemu1') { _km = 1; } else { _km = 4; }
   console.log('科目: ' + _kemu_select);

   //页面度宽定义
   var that = this;  
   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight, scrollHeight: res.windowHeight - 44 - 1});
     }
   });

   //请求模拟考试题库
   wx.request({
     url: 'https://www.jyouw.cn/jiayouxueche/io/exam/kaoshi.mn.php',
     data: {km: _km},
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function(res){
       var _list = res.data;  

       _timenow = new Date().getTime(); 
       if (_kemu_select == 'kemu1') { _timeremain = 45 * 60; } else { _timeremain = 30 * 60; } //总时间

       var thatt = that;
       //开始倒计时
       _timer = setInterval(function(){
         _timeremain--; var _t = _timeremain;
         var _time = Math.floor(_t / 60) + ":" + (_t - Math.floor(_t / 60) * 60);
         thatt.setData({timelimit: _time});
         if (_timeremain <= 0) { thatt.click_submit(); clearInterval(_timer); } //强制交卷, 并清除定时器
       }, 1000);

       var _examlist = []; var _exam_page = []; var _exam = {};
       for(var _i=0, _c=_list.length; _i<_c; _i++) {
         _exam = {};  var _select = []; var _qscr = '';
         //分解答案
         _select = _list[_i].qselect;
         if (_select[0] && _select[0].length >= 1) { _select[0] = b64.base64_decode(_select[0]); }
         if (_select[1] && _select[1].length >= 1) { _select[1] = b64.base64_decode(_select[1]); }
         if (_select[2] && _select[2].length >= 1) { _select[2] = b64.base64_decode(_select[2]); }
         if (_select[3] && _select[3].length >= 1) { _select[3] = b64.base64_decode(_select[3]); }
         if (_select[4] && _select[4].length >= 1) { _select[4] = b64.base64_decode(_select[4]); }
         if (_select[5] && _select[5].length >= 1) { _select[5] = b64.base64_decode(_select[5]); }

         //转换数据结构
         _exam.idx = _i + 1;
         _exam.id = _list[_i].qid;
         //智能添加空行
         if (_list[_i].qsrc && _list[_i].qsrc.length) { _exam.t = b64.base64_decode(_list[_i].qques); } else { _exam.t = b64.base64_decode(_list[_i].qques) + '\n\n\n'; }
         _exam.q = _select;
         //图片, 视频适配
         if (_list[_i].qsrc.indexOf("mp4") >= 1) {
           _exam.vsrc = _list[_i].qsrc;
         }
         if (_list[_i].qsrc.indexOf("png") >= 1 || _list[_i].qsrc.indexOf("jpg") >= 1 || _list[_i].qsrc.indexOf("gif") >= 1 || _list[_i].qsrc.indexOf("jpeg") >= 1) {
           _exam.isrc = _list[_i].qsrc;
         }

         _exam.tp = _list[_i].qtype; console.log(_list[_i].qtype);
         _exam.a = b64.base64_decode(_list[_i].qanswer).toUpperCase();
         _exam.qa = b64.base64_decode(_list[_i].qdescribe);
         _exam.ua = ''; //用户的答案
         _examlist.push(_exam); //加一行数据
       }

       //存储所有题目, 及当前分页
       that.setData({examList: _examlist}); 
       console.log("题目总数" + _examlist.length);

       //初始化颜色, 已作答案
       var _idcolor = []; var _dacolor = []; var _idanswer = []; 
       for(var _i=0; _i<_examlist.length; _i++) { 
         _dacolor.push('#ededed'); _idcolor.push('#FFFFFF'); _idanswer.push('');
       } console.log(_idanswer);
       that.setData({dacolor: _dacolor, idcolor: _idcolor, idanswer: _idanswer});

     },
     fail: function() {
       // fail
     },
     complete: function() {
       // complete
     }
   });
 }  
})