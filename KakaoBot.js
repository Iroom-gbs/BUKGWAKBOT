importClass(org.jsoup.Jsoup);
const scriptName = "test";
var MealDataDate;
var breakfast_Result = String("");
var lunch_Result = String("");
var dinner_Result = String("");

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
  msg_data = msg.split(' ')
  if(msg_data[0]=='!반장')
  {
    replier.reply("명물");
  }
  else if(msg_data[0]=="!명물")
  {
    replier.reply("반장");
  }
  else if(msg_data[0]=="이뤘다")
  {
    replier.reply("네?");
  }
  else if(msg_data[0]=="!도움말")
  {
    replier.reply("!과제 : 과제를 보여줍니다.\n!급식 [아침/점심/저녁] : 급식을 보여줍니다.")
  }
  else if(msg_data[0]=='!과제')
  {
    replier.reply("\u200b".repeat(500) + "아직 없음");
  }
  else if(msg_data[0]=="!급식")
  {
    let today = new Date();
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜
    let day = today.getDay; //요일

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
    
    if(MealDataDate != year+month+date)
    {
      replier.reply("급식 정보를 받아오는 중입니다.\n시간이 걸릴 수 있습니다.");
      RenewMealData(year, month, date);
    }
    if(msg_data[1] == "아침")
    {
      replier.reply("아침\n--------\n" + "\u200b".repeat(500) + breakfast_Result);
    }
    else if(msg_data[1] == "점심")
    {
      replier.reply("점심\n--------\n" + "\u200b".repeat(500) + lunch_Result);
    }
    else if(msg_data[1] == "저녁")
    {
      replier.reply("저녁\n--------\n" + "\u200b".repeat(500) + dinner_Result);
    }
    else
    {
      replier.reply("오늘의 메뉴\n\n" + "\u200b".repeat(500) + "아침\n--------\n" +  breakfast_Result + "\n\n점심\n--------\n" +  lunch_Result + "\n\n저녁\n--------\n" +  dinner_Result);
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
                                  )

  var breakfast_Data = ((((meal_Data.split("<DDISH_NM>"))[1]
                          .split("</DDISH_NM>"))[0])
                          .replace("<![CDATA[","")
                          .replace("]]>",""))
                          .split("<br\/>");
  for(i=0;i<breakfast_Data.length;i++)
  {
    breakfast_Result+=(breakfast_Data[i].split("*"))[0] + "\n";
  }
  var lunch_Data = ((((meal_Data.split("<DDISH_NM>"))[2]
                                .split("</DDISH_NM>"))[0])
                                .replace("<![CDATA[","")
                                .replace("]]>",""))
                                .split("<br\/>");
  for(i=0;i<lunch_Data.length;i++)
  {
    lunch_Result+=(lunch_Data[i].split("*"))[0] + "\n";
  }

  if(meal_Data.split("<DDISH_NM>").length<=3) dinner_Result+="오늘은 저녁밥이 없습니다.";
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

  MealDataDate = year+month+date;
}

function numberPad(n, width) //숫자 앞을 0으로 채움
{
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
