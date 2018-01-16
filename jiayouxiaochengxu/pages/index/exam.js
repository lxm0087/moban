//exam.js

var b64 = require('../../utils/b64.js');
var pageSize = 100; //第N批次
var pageNo = 0; //第一页
var _current_index = 0;
var _answerof = ''; //当前题的答案

//获取应用实例  
var app = getApp()  
Page({  
  data: {
    //控制工具栏显示颜色
    showQA: false, showPG: false, Reload: true,
    showQA_image: 'show_false',  showQA_color: '#666666',
    showQA_image: 'show_false',  showQA_color: '#666666',

    answer_color: '#FF0000',
 
    showQA_A_BG: '#FFFFFF', showQA_B_BG: '#FFFFFF', showQA_C_BG: '#FFFFFF', showQA_D_BG: '#FFFFFF',
    swiper_show: true, answer_show: [],
    //
    // 待优化变成数组
    //
    swiper_show_page0: false, swiper_show_page1: false, swiper_show_page2: false,swiper_show_page3: false, swiper_show_page4: false,
    swiper_show_page5: false, swiper_show_page6: false, swiper_show_page7: false,swiper_show_page8: false, swiper_show_page9: false,
    swiper_show_page10: false, swiper_show_page11: false, swiper_show_page12: false,swiper_show_page13: false, swiper_show_page14: false,
    swiper_show_page15: false, swiper_show_page16: false, swiper_show_page17: false,swiper_show_page18: false, swiper_show_page19: false,
    button_load_next0: false, button_load_next1: false, button_load_next2: false,button_load_next3: false, button_load_next4: false,
    button_load_next5: false, button_load_next6: false, button_load_next7: false,button_load_next8: false, button_load_next9: false,
    button_load_next10: false, button_load_next11: false, button_load_next12: false,button_load_next13: false, button_load_next14: false,
    button_load_next15: false, button_load_next16: false, button_load_next17: false,button_load_next18: false, button_load_next19: false,


    pageHeight: 480,
    scrollHeight: 480,
    examList: [ ], examListFull: [], //题目当前分页, 题目所有

    duration: 500,  
    userInfo: {}  
  },


 //单击ID列表
 click_examIDList: function(e){ console.log("展开/收起ID列表"); //return(true); 
   var _show = !this.data.showPG; 
   if (_show) {
     this.setData({showPG: true, showPG_image: 'showPG_true', showPG_color: '#15b600', swiper_show: false});
   } else {
     this.setData({showPG: false, showPG_image: 'showPG_false', showPG_color: '#666666', swiper_show: true});
   }
 },

 swiper_change: function(e) {
   _answerof = '';
   var _idx = e.detail.current; _current_index = e.detail.current;
   if (_idx == this.data.examList.length - 1) { //倒数第1个
     this.setData({swiper_show: false}); //先隐藏起来

     var _exam0 = []; _exam0.push(this.data.examList[0]);
     this.setData({examList: _exam0}); 
   }
 },

 //载入下一批试题
 exam_load_next: function(e) {
   _current_index = 0; //重置为第0题
   var _p = e.currentTarget.dataset.p; pageNo = _p;  console.log("载入题库 " + pageNo);
   var _exam_page = [];
   for(var _i=_p * pageSize, _c=_p * pageSize + pageSize + 1; _i<_c; _i++) {
     if (this.data.examListFull[_i]) { _exam_page.push(this.data.examListFull[_i]); }
   }
   this.setData({examList: _exam_page, showPG: false, Reload: false});
   this.setData({Reload: true});
 },

 //单击显答案
 click_showQA: function(e){
   var _show = !this.data.showQA; 
   if (_show) {
     this.setData({showQA: true, showQA_image: 'show_true', showQA_color: '#15b600'}); //, answer_color: '#666666'
   } else {
     this.setData({showQA: false, showQA_image: 'show_false', showQA_color: '#666666'});
   }
 },

 //单击收藏
 click_favAdd: function(e){
   console.log("收藏ID");
 },

 //单击答题
 click_answer_abcd: function(e, _a){
   _a = _a.toUpperCase();

   if (this.data.examList[_current_index].tp != 2) { //单选
     
     var _answer_show = this.data.answer_show; console.log(_answer_show);
     _answer_show[pageNo * pageSize + _current_index] = true;
     var that = this;
     if (_a == 'A') { 
       this.setData({showQA_A_BG: '#e9fde6', answer_show: _answer_show});
     }
     if (_a == 'B') { 
       this.setData({showQA_B_BG: '#e9fde6', answer_show: _answer_show});
     }
     if (_a == 'C') { 
       this.setData({showQA_C_BG: '#e9fde6', answer_show: _answer_show});
     }
     if (_a == 'D') { 
       this.setData({showQA_D_BG: '#e9fde6', answer_show: _answer_show});
     }
     setTimeout(function(){ that.setData({showQA_A_BG: '#FFFFFF', showQA_B_BG: '#FFFFFF', showQA_C_BG: '#FFFFFF', showQA_D_BG: '#FFFFFF'}); }, 150); 

   _answerof = _a; console.log('单选 ' + _answerof); 

     console.log("选择答案" + _a);
   } else { //多选
     //如果已选, 则取消选择
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

     //this.setData({answer_show: _answer_show});
   }

 },
 //单击答题
 click_answer_a: function(e){
   this.click_answer_abcd(e, 'a');
 },
 click_answer_b: function(e){
   this.click_answer_abcd(e, 'b');
 },
 click_answer_c: function(e){
   this.click_answer_abcd(e, 'c');
 },
 click_answer_d: function(e){
   this.click_answer_abcd(e, 'd');
 },

 //提交复选
 click_submit_duoxuan: function(e){
   var _answer_show = this.data.answer_show; 
   _answer_show[pageNo * pageSize + _current_index] = true;
   this.setData({answer_show: _answer_show});

   _answerof = ''; //清除旧值
   var that = this;
   setTimeout(function(){ that.setData({showQA_A_BG: '#FFFFFF', showQA_B_BG: '#FFFFFF', showQA_C_BG: '#FFFFFF', showQA_D_BG: '#FFFFFF'}); }, 150); 

   console.log("提交复选 " + _answerof);
 },

 onLoad: function (options) { console.log(' exam onload ');

   pageSize = 100; //第N批次
   pageNo = 0; //第一页
   _current_index = 0;
   _answerof = ''; //当前题的答案

   var that = this;  
   wx.getSystemInfo({
     success: function(res) { 
       that.setData({pageHeight: res.windowHeight-44, scrollHeight: res.windowHeight - 44});
     }
   });

   var _km = options.kemu.substr(0, 5);
   if (_km == 'kemu1') { _km = 1; } else { _km = 4; }

   var _zj = options.kemu.substr(6, 3);

   var _url = 'https://www.jyouw.cn/jiayouxueche/io/exam/kaoshi.zj.php';
   if (_zj == 'sx') { //顺序
     _zj = '';
   } else if (_zj == 'sj') { //随机
     _url = 'https://www.jyouw.cn/jiayouxueche/io/exam/kaoshi.sj.php';
   } else { //章节

   }

   var that = this;
   wx.request({
     url: _url,
     data: { km: _km, zj: _zj },
     header: { 'content-type': 'text/html' },
     fail: function(res) { console.log(res); },
     success: function(res) {
       var timestamp=new Date().getTime(); //请求到了数据
       var _list = res.data;  
       var _examlist = []; var _exam_page = []; var _exam = {}; var _answer_show = [];
       for(var _i=0, _c=_list.length; _i<_c; _i++) { _answer_show.push(false);
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
         _exam.idx = _i + 1 + ".";
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

         _exam.tp = _list[_i].qtype;
         _exam.a = b64.base64_decode(_list[_i].qanswer);
         _exam.qa = b64.base64_decode(_list[_i].qdescribe);
         _examlist.push(_exam); //加一行数据
         if (_i <= pageSize) { _exam_page.push(_exam); } //载入100条
       }

       //最后再追加一行数据
       var _exam_last = {}; 
       _exam_last.idx = ""; _exam_last.id = ""; _exam_last.t = ""; _exam_last.tp = "";
       _examlist.push(_exam_last); 

       //存储所有题目, 及当前分页
       that.setData({examListFull: _examlist}); console.log("答案长度: " + _answer_show.length);
       that.setData({examList: _exam_page, answer_show: _answer_show}); 

       //总长度减一是因为最后再追加了一行数据
       //
       // 待优化变成数组
       //
       if (_examlist.length > 0) {
         that.setData({swiper_show_page0: true, button_load_next0: "载入试题 1 " + " - " + Math.min(100, _examlist.length - 1) });
       } 
       if (_examlist.length > 100) {
         that.setData({swiper_show_page1: true, button_load_next1: "载入试题 101 " + " - " + Math.min(200, _examlist.length - 1) });
       } 
       if (_examlist.length > 200) {
         that.setData({swiper_show_page2: true, button_load_next2: "载入试题 201 " + " - " + Math.min(300, _examlist.length - 1) });
       } 
       if (_examlist.length > 300) {
         that.setData({swiper_show_page3: true, button_load_next3: "载入试题 301 " + " - " + Math.min(400, _examlist.length - 1) });
       } 
       if (_examlist.length > 400) {
         that.setData({swiper_show_page4: true, button_load_next4: "载入试题 401 " + " - " + Math.min(500, _examlist.length - 1) });
       } 
       if (_examlist.length > 500) {
         that.setData({swiper_show_page5: true, button_load_next5: "载入试题 501 " + " - " + Math.min(600, _examlist.length - 1) });
       } 
       if (_examlist.length > 600) {
         that.setData({swiper_show_page6: true, button_load_next6: "载入试题 601 " + " - " + Math.min(700, _examlist.length - 1) });
       } 
       if (_examlist.length > 700) {
         that.setData({swiper_show_page7: true, button_load_next7: "载入试题 701 " + " - " + Math.min(800, _examlist.length - 1) });
       } 
       if (_examlist.length > 800) {
         that.setData({swiper_show_page8: true, button_load_next8: "载入试题 801 " + " - " + Math.min(900, _examlist.length - 1) });
       } 
       if (_examlist.length > 900) {
         that.setData({swiper_show_page9: true, button_load_next9: "载入试题 901 " + " - " + Math.min(1000, _examlist.length - 1) });
       } 
       if (_examlist.length > 1000) {
         that.setData({swiper_show_page10: true, button_load_next10: "载入试题 1001 " + " - " + Math.min(1100, _examlist.length - 1) });
       } 
       if (_examlist.length > 1100) {
         that.setData({swiper_show_page11: true, button_load_next11: "载入试题 1101 " + " - " + Math.min(1200, _examlist.length - 1) });
       } 
       if (_examlist.length > 1200) {
         that.setData({swiper_show_page12: true, button_load_next12: "载入试题 1201 " + " - " + Math.min(1300, _examlist.length - 1) });
       } 
       if (_examlist.length > 1300) {
         that.setData({swiper_show_page13: true, button_load_next13: "载入试题 1301 " + " - " + Math.min(1400, _examlist.length - 1) });
       } 
       if (_examlist.length > 1400) {
         that.setData({swiper_show_page14: true, button_load_next14: "载入试题 1401 " + " - " + Math.min(1500, _examlist.length - 1) });
       } 
       if (_examlist.length > 1500) {
         that.setData({swiper_show_page15: true, button_load_next15: "载入试题 1501 " + " - " + Math.min(1600, _examlist.length - 1) });
       } 
       if (_examlist.length > 1600) {
         that.setData({swiper_show_page16: true, button_load_next16: "载入试题 1601 " + " - " + Math.min(1700, _examlist.length - 1) });
       } 
       if (_examlist.length > 1700) {
         that.setData({swiper_show_page17: true, button_load_next17: "载入试题 1701 " + " - " + Math.min(1800, _examlist.length - 1) });
       } 
       if (_examlist.length > 1800) {
         that.setData({swiper_show_page18: true, button_load_next18: "载入试题 1801 " + " - " + Math.min(1900, _examlist.length - 1) });
       } 
       if (_examlist.length > 1900) {
         that.setData({swiper_show_page19: true, button_load_next19: "载入试题 1901 " + " - " + Math.min(2000, _examlist.length - 1) });
       } 

     }
   })
 }  
})