/**
 * 북곽봇(구 이뤘다)
 * 제작자 : HegelTY
 * 1학년 2반을 위해 만들어진 카톡봇입니다.
 * 현재 버전 dev15(20210508)
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

const M = Bridge.getScopeOf("module");;
const AS = Bridge.getScopeOf("autoselfcheck");
const G = Bridge.getScopeOf("gamemodule");
/*
const kalingModule = require('kaling').Kakao()
const Kakao = new kalingModule;
Kakao.init("d1b87ff979264dd8186e3dda6e5d0524")
Kakao.login('skxodid0305','sunej928200**');
*/

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

  if(msg[0]=="!"){
    switch(msg_data[0].replace("!","")){
      //도움말
      case "도움말":
      case "명령어": replier.reply(
                                  "도움말\n"
                                + "\u200b".repeat(500)
                                + "() : 선택  [] : 필수\n\n"
                                + "!급식 (아침/점심/저녁) : 급식을 보여줍니다.\n"
                                + "!시간표 (내일) : 시간표를 보여줍니다.\n"
                                + "!자가진단 확인 : 자가진단 참여 여부를 알려줍니다.\n"
                                + "!책 [제목] : 도서관에서 책을 검색합니다.\n\n"

                                + "!정보 : 북곽봇 정보를 알려줍니다.\n"
                                + "!상태 : 북곽봇 휴대폰 상태를 알려줍니다.\n\n"

                                + "!한강수온 (화씨) : 오늘 한강의 온도를 알려줍니다.\n"
                                + "!날씨 (위치) : 날씨를 알려줍니다.\n"
                                + "!코로나 : 코로나 확진자 정보를 알려줍니다.\n\n"

                                + "!랜덤숫자 [시작숫자] [끝숫자] : 시작숫자에서 끝 숫자 사이 랜덤 숫자가 나옵니다.\n"
                                + "!랜덤목록 [개수] : 1에서 개수까지의 수를 랜덤순서로 출력합니다.\n\n"

                                + "!산화수 [화학식](이온가수) : 산화수를 알려줍니다.\n"
                                + "!유효숫자 [수] : 유효숫자 자릿수를 알려줍니다.\n\n"

                                + "#개발예정# !과제 : 과제를 보여줍니다.\n"
                                );
        break;
      //정보
      case "정보": replier.reply("북곽봇\n"
                                  + "개발자 : 나태양\n"
                                  + "버전 : dev 15(20210508)\n"
                                  + "소스 : https://github.com/hegelty/BUKGWAKBOT\n"
                                  + "\u200b".repeat(500)
                                  + "라이선스\n\n"
                                  + " ▣comcigan\nhttps://github.com/darkapplepower/comcigan\n"
                                  + 'MIT License\n\nCopyright (c) 2020 darkapplepower\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.'
                                  );
        break;
      //상태
      case "상태": replier.reply(M.PhoneData_Function()); break;

      //단순응답
      case "반장": replier.reply("명물"); break;
      case "명물": replier.reply("반장"); break;
      case "박주완": replier.reply("걸어다니는 공유기(7월까지)\n과학고 락커 과락\nhttps://youtube.com/channel/UC7c6gBzola8zsfq4qshphjw"); break;
      case "짜릿짜릿해": replier.reply("1.\nsoundcloud.com/seob88861/mp3\n2.\nyoutu.be/oq0VGRQ9J-0"); break;

      //자가진단
      case "자가진단":
        if(msg_data[1]=="확인") replier.reply(AS.Check_SelfCheck());
        else if(sender=="나태양")replier.reply(AS.Autoselfcheck_Function());
        break;
      
      //핫스팟
      case "공유기":
      case "핫스팟":
        if(msg_data[1]=="이름변경"&&msg_data[2]=="-"&&(sender=="나태양"||sender=="박주완")){
          hotspot_data.이름 = msg.split("-")[1];
          FS.write(hotspot_file_route,JSON.stringify(hotspot_data));
          replier.reply("핫스팟의 이름이 " + hotspot_data.이름 + "로 변경되었습니다.");
        }
        else if(msg_data[1]=="비밀번호변경"&&msg_data[2]=="-"&&(sender=="나태양"||sender=="박주완")){
          hotspot_data.비밀번호 = msg.split("-")[1];
          FS.write(hotspot_file_route,JSON.stringify(hotspot_data));
          replier.reply("핫스팟의 비밀번호가 " + hotspot_data.비밀번호 + "로 변경되었습니다.");
        }
        else replier.reply("박주완의 핫스팟\n이름 : " + hotspot_data.이름 + "\n비밀번호 : " + hotspot_data.비밀번호);
        break;

      //급식
      case "급식":
        var tm=0,type=0,reset=false;
        if(msg_data[1]=="내일") tm=1;
    
        if(msg_data[tm+1]=="아침") type=1;
        else if(msg_data[tm+1]=="점심") type=2;
        else if(msg_data[tm+1]=="저녁") type=3;
    
        if(msg_data[1]=="리로드") reset=true;
    
        replier.reply(M.Meal_Function(tm,type,reset));
        break;
      
      //시간표
      case "시간표":
        var tm;
        if(msg_data[1]=="내일") tm=1;
        replier.reply(M.Timetable_Function(tm));
        break;

      //도서검색
      case "책": replier.reply(M.Library_Search(msg.substr(2))); break;
      
      //코로나 현황
      case "코로나": replier.reply(M.Corona_Function()); break;

      //코드업 정보
      case "코드업":
        if(msg_data.length<2) replier.reply("찾으려는 아이디를 입력하세요.\n(!코드업 [아이디])");
        else replier.reply(M.CodeUPRank_Function(msg_data[1]));
        break;

      //유효숫자 구하기
      case "유효숫자": replier.reply(M.Significant_figures(msg_data[1])); break;

      //산화수 구하기
      case "산화수": replier.reply(M.Oxidation_Number(msg_data[1])); break;

      //가위바위보
      case "가위바위보": replier.reply(G.RSP(msg_data[1])); break;

      //날씨
      case "날씨" : 
        if(msg_data.length<2||msg_data[1]=="내일"||msg_data[1]=="모레") area = "";
        else area = msg_data[1];
    
        if(msg_data[1]=="내일"||msg_data[2]=="내일") day=1;
        else if(msg_data[1]=="모레"||msg_data[2]=="모레") day=2;
        else day=0;
        replier.reply(M.Weather_Function(area,day)); 

        break;
      
      //한강 수온
      case "한강수온": replier.reply(M.Hangang_Function(msg_data[1])); break;
      //랜덤숫자 뽑기
      case "랜덤숫자": replier.reply(G.RandNum(msg_data[1],msg_data[2])); break;

      //랜덤목록 뽑기
      case "랜덤목록": replier.reply(G.RandList(msg_data[1])); break;

      //로그 초기화
      case "로그초기화":
        if(sender=="나태양"){
          FS.remove(chat_log_route);
          replier.reply("로그 데이터가 초기화되었습니다.")
      }
  FS.append(chat_log_route, today.toLocaleString() + " " +room + " " + sender + ":" + msg +"\n\n");
}}}}

//핫스팟 데이터 읽기
function ReadHotspot()
{
  hotspot_data = JSON.parse(FS.read(hotspot_file_route));
  hotspot_readed = true;
}