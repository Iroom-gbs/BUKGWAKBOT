/**
 * 북곽봇(구 이뤘다)
 * 제작자 : HegelTY
 * 1학년 2반을 위해 만들어진 카톡봇입니다.
 * 현재 버전 dev5(20210329)
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

var MealDataDate;
var breakfast_Result = String("");
var lunch_Result = String("");
var dinner_Result = String("");

var hangang_temp, hangang_time, HangangDataDate;

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
  msg_data = msg.split(' ');

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
  else if(msg_data[0]=="!정보") replier.reply("북곽봇\n개발지 : 나태양\n버전 : dev5(20210329)");
  else if(msg_data[0]=="!클래스카드") replier.reply("https://www.classcard.net/set/4720490");
  else if(msg_data[0]=="!도움말")
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
  else if(msg_data[0]=="!공유기"||msg_data[0]=="!핫스팟") replier.reply("박주완의 핫스팟\n이름 : 핫스팟은 못참지 happygbs\n비밀번호 : happygbs");
  else if(msg_data[0]=="!박주완") replier.reply("걸어다니는 공유기(7월까지)");
  else if(msg_data[0]=='!과제')
  {
    replier.reply("\u200b".repeat(500) + "아직 없음");
  }
  else if(msg_data[0]=='!한강수온')
  {
    let today = new Date();
    let time = today.getTime();  // 날짜
    
    if(HangangDataDate + 3 <= time || time<HangangDataDate); //데이터가 최신이 아닐 경우 갱신
    {
      let HangangData = Jsoup.connect("https://api.hangang.msub.kr/").ignoreContentType(true).get().text();           
      hangang_temp = HangangData.split('"')[11];
      HangangDataDate = time;
      hangang_time = HangangData.split('"')[15];
    }

    let temp_C = String(hangang_temp) + "°C";
    let temp_K = String(hangang_temp + 273.15) + "K";
    let temp_F = String(hangang_temp * 1.8 + 32) + "°F";
    let temp_R = String((hangang_temp + 273.15*1.8) + "°R");
    if(msg_data[1] == '화씨') replier.reply("지금 한강의 수온은 " + temp_F +"°F"+ "(" + temp_R +"°R) 입니다.\n("+hangang_time+"기준)");
    else replier.reply("지금 한강의 수온은 " + temp_C +"°C"+ "(" + temp_K +"K) 입니다.\n("+hangang_time+"기준)");
  }
  else if(msg_data[0]=="!시간표")
  {
    let today = new Date();
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
    let today = new Date();
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜
    var day = today.getDay(); //요일
    
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
      if(MealDataDate != year+month+date) //급식 정보가 최신이 아닐 경우 갱신
      {
        replier.reply("급식 정보를 받아오는 중입니다.\n시간이 걸릴 수 있습니다.");
        RenewMealData(year, month, date);
      }
      if(msg_data[1] == "아침")
      {
        replier.reply("아침\n--------\n" + breakfast_Result);
      }
      else if(msg_data[1] == "점심")
      {
        replier.reply("점심\n--------\n" + lunch_Result);
      }
      else if(msg_data[1] == "저녁")
      {
        replier.reply("저녁\n--------\n" + dinner_Result);
      }
      else
      {
        replier.reply("오늘의 메뉴\n\n"
                    + "\u200b".repeat(500)
                    + "아침\n--------\n"
                    + breakfast_Result
                    + "\n\n점심\n--------\n"
                    + lunch_Result
                    + "\n\n저녁\n--------\n"
                    + dinner_Result
                    );
      }
    }
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

function RenewMealData(year, month, date)
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

  //갱신일시 저장
  MealDataDate = year+month+date;
}

function numberPad(n, width) //숫자 앞을 0으로 채움
{
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}