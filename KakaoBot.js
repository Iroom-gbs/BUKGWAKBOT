/**
 * 북곽봇(구 이뤘다)
 * 제작자 : HegelTY
 * 1학년 2반을 위해 만들어진 카톡봇입니다.
 * 현재 버전 dev10(20210426_2)
 * 
 * 어짜피 이 코드 볼사람 나말고 두명밖에 없을거 같긴 함
 * MIT라이선스니까 너희도 내 코드 가져다쓸거면 출처 표기하셈
 * 
 * © 2021 Hegel, All rights reserved.
 * MIT License

Copyright (c) 2021 HegelTY

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
importClass(org.jsoup.Jsoup);
const scriptName = "test";
const FS = FileStream;

const M = Bridge.getScopeOf("module");
const AS = Bridge.getScopeOf("autoselfcheck")
/*
const kalingModule = require('kaling').Kakao()
const Kakao = new kalingModule;
Kakao.init("d1b87ff979264dd8186e3dda6e5d0524")
Kakao.login('skxodid0305','sunej928200**');
*/
var hangang_temp, hangang_time, HangangDataDate;

let hotspot_file_route = "/sdcard/BUKGWAKBOT/hotspot.json";
var hotspot_readed=false;
var hotspot_data;

let chat_log_route = "/sdcard/BUKGWAKBOT/chat_log.txt";

//let chat_log_route = "/sdcard/BUKGWAKBOT/todolist.txt";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room[0]!=".")
  {
  msg_data = msg.split(' ');
  let today = new Date();

  //핫스팟 데이터 로드
  if(hotspot_readed == false) ReadHotspot();

  //여기부터 응답
  if(msg_data[0]=='!반장')
  {
    replier.reply("명물");
  }
  else if(msg_data[0]=="!명물")
  {
    replier.reply("반장");
  }
  /*
  else if(msg_data[0]=="!카링")
  {
    Kakao.send(room,{
      "link_ver" : "4.0",
      "template_id" : 52513,
      "template_args" : {
      }
      }, "custom");
      }
  }
  */
  else if(msg_data[0]=="북곽봇")
  {
    replier.reply("네?");
  }
  else if(msg_data[0]=="!정보") replier.reply("북곽봇\n개발자 : 나태양\n버전 : dev10(20210426_2)");

  else if(msg_data[0]=="!도움말"||msg_data[0]=="!명령어")
  {
    replier.reply("도움말\n"
                + "!과제 : 과제를 보여줍니다.\n"
                + "!급식 (아침/점심/저녁) : 급식을 보여줍니다.\n"
                + "!시간표 (내일) : 시간표를 보여줍니다.\n"
                + "!한강수온 (화씨) : 오늘 한강의 온도를 알려줍니다.\n"
                + "!클래스카드 : 클래스카드 링크를 보여줍니다.\n"
                + "!정보 : 북곽봇 정보를 알려줍니다."
                );
  }
  else if(msg_data[0]=="!자가진단"&&sender=="나태양")
  {
    replier.reply(AS.Autoselfcheck_Function());;
  }
  else if(msg_data[0]=="!로그초기화"&&sender=="나태양")
  {
    FS.remove(chat_log_route);
    replier.reply("로그 데이터가 초기화되었습니다.")
  }
  //핫스팟 관련
  else if(msg_data[0]=="!공유기"||msg_data[0]=="!핫스팟")
  {
    if(msg_data[1]=="이름변경"&&msg_data[2]=="-"&&(sender=="나태양"||sender=="박주완"))
    {
      hotspot_data.이름 = msg.split("-")[1];
      FS.write(hotspot_file_route,JSON.stringify(hotspot_data));
      replier.reply("핫스팟의 이름이 " + hotspot_data.이름 + "로 변경되었습니다.");
    }
    else if(msg_data[1]=="비밀번호변경"&&msg_data[2]=="-"&&(sender=="나태양"||sender=="박주완"))
    {
      hotspot_data.비밀번호 = msg.split("-")[1];
      FS.write(hotspot_file_route,JSON.stringify(hotspot_data));
      replier.reply("핫스팟의 비밀번호가 " + hotspot_data.비밀번호 + "로 변경되었습니다.");
    }
    else replier.reply("박주완의 핫스팟\n이름 : " + hotspot_data.이름 + "\n비밀번호 : " + hotspot_data.비밀번호);
  }
  else if(msg_data[0]=="!박주완") replier.reply("걸어다니는 공유기(7월까지)\n과학고 락커 과락\nhttps://youtube.com/channel/UC7c6gBzola8zsfq4qshphjw");
  else if(msg_data[0]=="!짜릿짜릿해") replier.reply("1.\nsoundcloud.com/seob88861/mp3\n2.\nyoutu.be/oq0VGRQ9J-0");

  else if(msg_data[0]=="!날씨")
  {
    if(msg_data.length>1) area = msg_data[1];
    else area = "";
    replier.reply(M.Weather_Function(area));
  }

  else if(msg_data[0]=='!한강수온')
  {
    let today = new Date();
    let hour = today.getHours();  // 시간
    if(HangangDataDate + 3 <= hour || hour<HangangDataDate); //데이터가 최신이 아닐 경우 갱신
    {
      let HangangData = JSON.parse(Jsoup.connect("http://openapi.seoul.go.kr:8088/5577427a6d736b783130377644627364/json/WPOSInformationTime/4/4/").ignoreContentType(true).get().text().split('[')[1].split(']')[0]);
      hangang_temp = Number(HangangData.W_TEMP);
      hangang_site = HangangData.SITE_ID;
      HangangDataDate = hour;
      hangang_time = HangangData.MSR_DATE;
    }

    let temp_C = String(hangang_temp) + "°C"; //섭씨
    let temp_K = String((hangang_temp + 273.15).toFixed(2))+ "K"; //절대온도
    let temp_F = String((hangang_temp * 1.8 + 32).toFixed(2))+ "°F";  //화씨
    let temp_R = String(((hangang_temp + 273.15)*1.8).toFixed(2))+ "°R";  //란씨
    if(msg_data[1] == '화씨') replier.reply("지금 한강의 수온은 " + temp_F + "(" + temp_R +") 입니다.\n("+hangang_time+hangang_site+"기준)\n\n당신은 소중한 사람입니다.\n자살예방상담전화 1393\n청소년전화 1388");
    else replier.reply("지금 한강의 수온은 " + temp_C + "(" + temp_K +") 입니다.\n("+hangang_time+" "+hangang_site+"기준)\n\n당신은 소중한 사람입니다.\n자살예방상담전화 1393\n청소년전화 1388");
  }
   
  else if(msg_data[0]=="!시간표")
  {
    var tm;
    if(msg_data[1]=="내일") tm=1;
    replier.reply(M.Timetable_Function(tm));
  }

  else if(msg_data[0]=="!급식")
  {
    var tm=0,type=0,reset=false;
    if(msg_data[1]=="내일") tm=1;

    if(msg_data[tm+1]=="아침") type=1;
    else if(msg_data[tm+1]=="점심") type=2;
    else if(msg_data[tm+1]=="저녁") type=3;

    if(msg_data[1]=="리로드") reset=true;

    replier.reply(M.Meal_Function(tm,type,reset))
  }

  FS.append(chat_log_route, today.toLocaleString() + " " +room + " " + sender + ":" + msg +"\n\n");
}
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {
}
function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

//핫스팟 데이터 읽기
function ReadHotspot()
{
  hotspot_data = JSON.parse(FS.read(hotspot_file_route));
  hotspot_readed = true;
}