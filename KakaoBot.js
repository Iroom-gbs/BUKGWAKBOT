/**
 * 북곽봇(구 이뤘다)
 * 제작자 : HegelTY
 * 1학년 2반을 위해 만들어진 카톡봇입니다.
 * 현재 버전 dev7(20210331)
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
const comci = require('comci.js');
const FS = FileStream;

var MealDataDate = new Array("-1","-1");
var mealdata = new Array(new Array("\n","\n","\n"), new Array("\n","\n","\n"));
/*
var breakfast_Result = String("");
var lunch_Result = String("");
var dinner_Result = String("");
*/

var hangang_temp, hangang_time, HangangDataDate;

let hotspot_file_route = "/sdcard/BUKGWAKBOT/hotspot.json";
var hotspot_readed=false;
var hotspot_data;

let chat_log_route = "/sdcard/BUKGWAKBOT/chat_log.txt";

let chat_log_route = "/sdcard/BUKGWAKBOT/todolist.txt";

let today = new Date();

/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room[0]!=".")
  {
  msg_data = msg.split(' ');

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
  else if(msg_data[0]=="북곽봇")
  {
    replier.reply("네?");
  }
  else if(msg_data[0]=="!정보") replier.reply("북곽봇\n개발자 : 나태양\n버전 : de7(20210331)");
  else if(msg_data[0]=="!클래스카드") replier.reply("https://www.classcard.net/set/4720490");
  else if(msg_data[0]=="!도움말"||msg_data[0]=="!명령어")
  {
    replier.reply("도움말\n"
                + "!과제 : 과제를 보여줍니다.\n"
                + "!급식 (아침/점심/저녁) : 급식을 보여줍니다.\n"
                + "!시간표 (내일) : 시간표를 보여줍니다.\n"
                + "!한강수온 (화씨) : 오늘 한강의 온도를 알려줍니다.\n"
                + "!클래스카드 : 영어 수행 클래스카드 링크를 보여줍니다.\n"
                + "!정보 : 북곽봇 정보를 알려줍니다."
                );
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
  else if(msg_data[0]=="!박주완") replier.reply("걸어다니는 공유기(7월까지)");

  else if(msg_data[0]=='!과제')
  {
    //과제 등록
    //문법 : !과제 등록 (월) (일) (과목) -(내용)
    /*
    if(msg_data[1] == "등록")
    {
      let deadline = msg_dat
    }
    */
    replier.reply("\u200b".repeat(500) + "아직 없음");
  }

  else if(msg_data[0]=='!한강수온')
  {
    let today = new Date();
    let hour = today.getHours();  // 시간
    
    if(HangangDataDate + 3 <= hour || hour<HangangDataDate); //데이터가 최신이 아닐 경우 갱신
    {
      let HangangData = Jsoup.connect("https://api.hangang.msub.kr/").ignoreContentType(true).get().text();           
      hangang_temp = Number(HangangData.split('"')[11]); //온도
      HangangDataDate = hour;
      hangang_time = HangangData.split('"')[15]; //측정시간
    }

    let temp_C = String(hangang_temp) + "°C"; //섭씨
    let temp_K = String((hangang_temp + 273.15).toFixed(2))+ "K"; //절대온도
    let temp_F = String((hangang_temp * 1.8 + 32).toFixed(2))+ "°F";  //화씨
    let temp_R = String(((hangang_temp + 273.15)*1.8).toFixed(2))+ "°R";  //란씨
    if(msg_data[1] == '화씨') replier.reply("지금 한강의 수온은 " + temp_F + "(" + temp_R +") 입니다.\n("+hangang_time+"기준)");
    else replier.reply("지금 한강의 수온은 " + temp_C + "(" + temp_K +") 입니다.\n("+hangang_time+"기준)");
  }
  else if(msg_data[0]=="!시간표")
  {
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜
    var day = today.getDay() - 1; //요일
    
    if(msg_data[1]=="내일") day+=1;
    if(day==6) day=-1;
    
    var TimeTable = String("");
    
    var TimeTableData = comci.getTimeTable(12045,1,2); //시간표 받아오기
    
    if(day==-1||day==5) replier.reply("주말 시간표\n학원가셈");
    else
    {
      var i=0;
      var TimeTable = String("");
      for(i=0;i<7;i++)
      {
        //replier.reply(TimeTableData.시간표[day][i]);
        TimeTable+= String(i+1)+"교시 : " + TimeTableData.시간표[day][i] + "\n";  
      }
      replier.reply(year+"년 "+month+"월 "+date+"일 시간표\n"+TimeTable);
    }
  }
  else if(msg_data[0]=="!급식")
  {
    replier.reply("오늘의 메뉴\n"
    + "\u200b".repeat(500)
    + "아침\n--------\n"
    + "콘푸레이크\n"
    + "콘푸라이크\n"
    + "첵스초코\n"
    + "첵스초코 파맛\n"
    + "오레오 오즈\n"
    + "코코볼\n"
    + "우유"
    + "\n점심\n--------\n"
    + "애슐리 출장뷔페\n"
    + "아웃백 스테이크 출장요리\n"
    + "드마리스 출장뷔페\n"
    + "수제맥주\n"
    + "\n저냑\n--------\n"
    + "뿌링클\n"
    + "허니콤보\n"
    + "황금올리브\n"
    + "고추바사삭\n"
    + "치킨무\n"
    + "맥주\n"
    )
    /*
    var year = String(today.getFullYear()); // 년도
    var month = numberPad(today.getMonth() + 1, 2);  // 월
    var date = numberPad(today.getDate(), 2);  // 날짜
    var day = today.getDay(); //요일
    var time = today.getTime()
    var tommorrow = 0;
    if(msg_data[1]=="내일")
    {
      tommorrow = 1;
      tommorrow_time = new Date(time + 86400000);
      year = String(tommorrow_time.getFullYear()); // 년도
      month = numberPad(tommorrow_time.getMonth() + 1, 2);  // 월
      date = numberPad(tommorrow_time.getDate(), 2);  // 날짜
      day = tommorrow_time.getDay(); //요일
      replier.reply(year + month + date);
    }
    if(day==0||day==6)
    {
      random_Num = Math.random() * 10;
      if(random_Num <= 1) replier.reply("집밥");
      else if(random_Num <= 2) replier.reply("오늘 저녁은 치킨이닭!");
      else if(random_Num <= 3) replier.reply("족발");
      else if(random_Num <= 4) replier.reply("편의점");
      else if(random_Num <= 5) replier.reply("싸다김밥");
      else if(random_Num <= 6) replier.reply("주말에 왜 물어보는거야");
      else if(random_Num <= 7) replier.reply("급식이 있을거라 생각했어?");
      else if(random_Num <= 8) replier.reply("다이어트");
      else if(random_Num <= 9) replier.reply("안알려줌");
      else if(random_Num <= 10) replier.reply("우리가 어떤민족입니까!");
    }
    else
    {
      if(MealDataDate[tommorrow] != year+month+date||msg_data[1]=="리로드") //급식 정보가 최신이 아닐 경우 갱신
      {
        replier.reply("급식 정보를 받아오는 중입니다.\n시간이 걸릴 수 있습니다.");
        RenewMealData(year, month, date, tommorrow);
      }
      if(msg_data[tommorrow+1] == "아침")
      {
        replier.reply("아침\n--------\n" + mealdata[tommorrow][0]);
      }
      else if(msg_data[tommorrow+1] == "점심")
      {
        replier.reply("점심\n--------\n" + mealdata[tommorrow][1]);
      }
      else if(msg_data[tommorrow+1] == "저녁")
      {
        replier.reply("저녁\n--------\n" +mealdata[tommorrow][2]);
      }
      else
      {
        replier.reply((tommorrow == 1? "내일":"오늘")
                    + "의 메뉴\n\n"
                    + "\u200b".repeat(500)
                    + "아침\n--------\n"
                    + mealdata[tommorrow][0]
                    + "\n\n점심\n--------\n"
                    + mealdata[tommorrow][1]
                    + "\n\n저녁\n--------\n"
                    + mealdata[tommorrow][2]
                    );
      }
    }
    */
  }

  //로깅
    FS.append(chat_log_route, today.toLocaleString() + " " +room + " " + sender + ":" + msg +"\n\n");
  }
  /*
  else if(msg_data[0]=='!급식')
  {
    var meal_reply = String("");
    meal_Data = Jsoup.connect("https://www.gbs.hs.kr/main/main.php?categoryid=05&menuid=04&groupid=02").get().select("#admin_meal2").text();
    meal_Data = meal_Data.split(" ");
    var mealtype=0;
    for(var i=0;i<meal_Data.length;i++)
    {
      if(meal_Data[i]=="조식"||meal_Data[i]=="중식"||meal_Data[i]=="석식")
      {
        mealtype = 1;
        meal_reply+="------------\n";
      }
      if(meal_Data[i]=="*")
      {
        i+=5;
        continue;
      }
      if(mealtype==1)
      {
        meal_Data_result = meal_Data[i].split("(");
        meal_reply+=meal_Data_result[0] + "\n";
      }
    }
    replier.reply("오늘의 급식\n"+"\u200b".repeat(500) + meal_reply);
  }
  */
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

function RenewMealData(year, month, date, tommorrow)
{
  let KEY = "d31921b2d9014e368cd685b00cea66c9"; //인증키
  let ATPT_OFCDC_SC_CODE = "J10"; //시도교육청코드
  let SD_SCHUL_CODE = 7530851; //학교 코드

  var meal_Link = "https://open.neis.go.kr/hub/mealServiceDietInfo?" + "ATPT_OFCDC_SC_CODE=" + ATPT_OFCDC_SC_CODE + "&SD_SCHUL_CODE=" + SD_SCHUL_CODE + "&MLSV_YMD=" + year + month + date + "&KEY=" + KEY + "&TYPE=%E3%85%93%EB%82%B4%E3%85%9C";
  var meal_Data = Utils.getWebText(meal_Link
                                  ,"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
                                  ,false
                                  ,false
                                  );

  for(var i=0;i<3;i++)
  {
    var temp_meal_data=((((meal_Data.split("<DDISH_NM>"))[i+1]
                          .split("</DDISH_NM>"))[0])
                          .replace("<![CDATA[","")
                          .replace("]]>",""))
                          .split("<br\/>");
    for(j=0;j<temp_meal_data.length;j++)
    {
      var tempString = eraseNumber(replaceAll((String(temp_meal_data[j]).split("*")[0]), ".", ""));
      var tempString2 = eraseNumber(replaceAll((String(temp_meal_data[j+1]).split("*")[0]), ".", ""));
      if(j==0) mealdata[tommorrow][i] = tempString;
      else mealdata[tommorrow][i] += "\n" + tempString;
      if(tempString.substr(0,3)==tempString2.substr(0,3)) j++;
    }
  }
  /*
  //아침                
  var breakfast_Data = ((((meal_Data.split("<DDISH_NM>"))[1]
                          .split("</DDISH_NM>"))[0])
                          .replace("<![CDATA[","")
                          .replace("]]>",""))
                          .split("<br\/>");
  for(i=0;i<breakfast_Data.length;i++)
  {
    breakfast_Result+=(breakfast_Data[i].split("*"))[0] + "\n";
  }

  //점심
  var lunch_Data = ((((meal_Data.split("<DDISH_NM>"))[2]
                                .split("</DDISH_NM>"))[0])
                                .replace("<![CDATA[","")
                                .replace("]]>",""))
                                .split("<br\/>");
  for(i=0;i<lunch_Data.length;i++)
  {
    lunch_Result+=(lunch_Data[i].split("*"))[0] + "\n";
  }

  //저녁
  //저녁이 없는 금요일
  if(meal_Data.split("<DDISH_NM>").length<=3) dinner_Result+="오늘은 저녁밥이 없습니다.";
  //저녁이 있는 금요일
  else
  {
    var dinner_Data = ((((meal_Data.split("<DDISH_NM>"))[3]
                                  .split("</DDISH_NM>"))[0])
                                  .replace("<![CDATA[","")
                                  .replace("]]>",""))
                                  .split("<br\/>");
    for(i=0;i<dinner_Data.length;i++)
    {
      dinner_Result+=(dinner_Data[i].split("*"))[0] + "\n";
    }
  }
  */

  //갱신일시 저장
  MealDataDate[tommorrow] = year+month+date;
}

function numberPad(n, width) //숫자 앞을 0으로 채움
{
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function eraseNumber(string)
{
  var str = string;
  for(i=0;i<=9;i++)
  {
    str = replaceAll(str, String(i), "");
  }
  return str;
}

function replaceAll(str, searchStr, replaceStr) {

  return str.split(searchStr).join(replaceStr);
}