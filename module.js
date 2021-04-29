importClass(org.jsoup.Jsoup);
const comci = require('comci.js');
const scriptName = "module";
const FS = FileStream;

var MealDataDate = new Array("-1","-1");
var mealdata = new Array(new Array("\n","\n","\n"), new Array("\n","\n","\n"));

function Timetable_Function(tm)
{
  try{
  let today = new Date();
  let year = String(today.getFullYear()); // 년도
  let month = numberPad(today.getMonth() + 1, 2);  // 월
  let date = numberPad(today.getDate(), 2);  // 날짜
  var day = today.getDay() - 1; //요일
  
  if(tm==true) day+=1;
  if(day==6) day=-1;
  
  var TimeTable = String("");
  
  var TimeTableData = comci.getTimeTable(12045,1,2); //시간표 받아오기
  
  if(day==-1||day==5) TimeTable = "주말 시간표\n학원가셈";
  else
  {
    var i=0;
    for(i=0;i<7;i++)
    {
      //replier.reply(TimeTableData.시간표[day][i]);
      TimeTable+= String(i+1)+"교시 : " + TimeTableData.시간표[day][i] + "\n";  
    }
    return year+"년 "+month+"월 "+date+"일 시간표\n"+TimeTable;
  }
  }catch(e){
    return "에러!\n" + e;
  }
}

function Meal_Function(tm,type,reset) //tm : 오늘(false)/내일(true)
{
  try{
    var Result = new String("");
    let today = new Date();
    var year = String(today.getFullYear()); // 년도
    var month = numberPad(today.getMonth() + 1, 2);  // 월
    var date = numberPad(today.getDate(), 2);  // 날짜
    var day = today.getDay(); //요일
    var time = today.getTime()
    var tommorrow = 0;

    if(tm==true)
    {
      tommorrow = 1;
      tommorrow_time = new Date(time + 86400000);
      year = String(tommorrow_time.getFullYear()); // 년도
      month = numberPad(tommorrow_time.getMonth() + 1, 2);  // 월
      date = numberPad(tommorrow_time.getDate(), 2);  // 날짜
      day = tommorrow_time.getDay(); //요일
      //replier.reply(year + month + date);
    }

    Result = year+"년 "+String(month)+"월 "+String(date)+"일 급식\n"
    if(day==0||day==6)
    {
      random_Num = (Math.floor(Math.random() * 10));
      weekendMeal = new Array("오늘 주말이야","있겠냐","집밥","굶어","편의점","치킨","피자","족발","싸다김밥","우리가 어떤 민족입니까?","궁금하면 500원")
      Result = weekendMeal[random_Num];
    }
    else
    {
      if(MealDataDate[tommorrow] != year+month+date||reset==true) //급식 정보가 최신이 아닐 경우 갱신
      {
        RenewMealData(year, month, date, tommorrow);
      }
      switch(type)
      {
        case 1: 
          Result += "아침\n--------\n" + mealdata[tommorrow][0];
          break;
        case 2:
          Result += "점심\n--------\n" + mealdata[tommorrow][1];
          break;
        case 3:
          Result += "저녁\n--------\n" +mealdata[tommorrow][2];
          break;
        default: Result += (tommorrow == 1? "내일":"오늘")
                    + "의 메뉴\n\n"
                    + "\u200b".repeat(500)
                    + "아침\n--------\n"
                    + mealdata[tommorrow][0]
                    + "\n\n점심\n--------\n"
                    + mealdata[tommorrow][1]
                    + "\n\n저녁\n--------\n"
                    + mealdata[tommorrow][2]
                    ;
      }
    }
    return Result;
  }catch(e){
    return "에러!\n" + e;
  }
}

function RenewMealData(year, month, date, tommorrow)
{
  try{
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
        Log.debug(tempString);
        var tempString2 = eraseNumber(replaceAll((String(temp_meal_data[j+1]).split("*")[0]), ".", ""));
        if(j==0) mealdata[tommorrow][i] = tempString;
        else mealdata[tommorrow][i] += "\n" + tempString;
        if(tempString.substr(0,3)==tempString2.substr(0,3)) j++;
      }
    }

    //갱신일시 저장
    MealDataDate[tommorrow] = year+month+date;
  }catch(e){
    return "에러!\n" + e;
  }
}

function Weather_Function(area)
{
  try{
    area = new String(area);
    var result = new String("- 날씨정보 -\n\n");

    if(area=="") area = "녹양동";

    try
    {
      let path = "#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.today_area._mainTabContent > "
      var url = Jsoup.connect("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" + area + "날씨").ignoreContentType(true).get();
      result += url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.sort_box._areaSelectLayer > div > div > span > em").text()
                + "\n\n" + url.select(path + "div.main_info > div > ul > li:nth-child(1) > p").text()
                + "\n■현재온도" + url.select(path + "div.main_info > div > p > span.todaytemp").text() + "°C"
                + "\n■최저 " + url.select(path + "div.main_info > div > ul > li:nth-child(2) > span.merge > span.min > span").text()
                + "°C 최대"
                + url.select(path + "div.main_info > div > ul > li:nth-child(2) > span.merge > span.max > span").text() + "°C"
                + "\n■체감온도 " + url.select(path + "div.main_info > div > ul > li:nth-child(2) > span.sensible > em > span").text() + "°C"
                + "\n■미세먼지 " + url.select(path + "div.sub_info > div > dl > dd:nth-child(2) > span.num").text()
                + "\n■초미세먼지 " + url.select(path + "div.sub_info > div > dl > dd.lv1 > span.num").text()
      if((url.select(path + "div.sub_info > div > dl > dd.lv1 > span.num").text()).lengh<1) return "지역을 찾을 수 없습니다.";
      return result;
    } catch (e) {
        return "정보 불러오기 오류";
    }
  }catch(e){
    return "에러!\n" + e;
  }
}

function Corona_Function()
{
  var result ="코로나19 현황\n\n";
  try{
    let path = "#content > div > div.caseTable > div:nth-child(1) > ul > li:nth-child"
    var url = Jsoup.connect("http://ncov.mohw.go.kr/bdBoardList_Real.do").get();
    result += "일일 현황" + url.select("#content > div > h5:nth-child(4) > span").text()
            + "\n----------\n확진자 : " + url.select(path+"(1) > dl > dd").text() + " 명"
            + "\n국내 : " +url.select(path+"(2) > dl > dd > ul > li:nth-child(2) > p").text() + " 명"
            + "\n해외 : " +url.select(path+"(2) > dl > dd > ul > li:nth-child(3) > p").text() + " 명"
            + "\n\n누적 현황\n----------\n확진자 : " +url.select(path+"(1) > dl > dd").text() + ""
            + "\n격리해제 : " + url.select("#content > div > div.caseTable > div:nth-child(2) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "(" + url.select("#content > div > div.caseTable > div:nth-child(2) > ul > li:nth-child(2) > dl > dd > span").text() + ")\n"
            + "격리중 : " + url.select("#content > div > div.caseTable > div:nth-child(3) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "(" + url.select("#content > div > div.caseTable > div:nth-child(3) > ul > li:nth-child(2) > dl > dd > span").text() + ")\n"
            + "사망자 : " + url.select("#content > div > div.caseTable > div:nth-child(4) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "(" + url.select("#content > div > div.caseTable > div:nth-child(4) > ul > li:nth-child(2) > dl > dd > span").text() + ")";
    return result;
  }catch(e){return e;}
}
function CodeUPRank_Function(name)
{
  var result = "";
  try{
    var url = Jsoup.connect("https://codeup.kr/userinfo.php?user="+name).get();
    result += url.select("#lv > strong > span").text() + "\n"
            + url.select("body > main > div.container.mt-2 > blockquote > footer").text()
            + "\n전체순위 : " + url.select("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(1) > td.text-center").text()
            + "\n푼 문제 : " + url.select("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(2) > td.text-center > a").text() 
    if((url.select("#lv > strong > span").text()).length<1) result = "그런 사용자는 없습니다.\n아이디를 확인하세요."

  }catch(e){ return e;}
  return result;
}

function PhoneData_Function()
{
  var device_profile_name = android.provider.Settings.Global.getString(Api.getContext().getContentResolver(), "device_name");
  return "북곽봇상태\n\n휴대폰 이름 : "+device_profile_name+"\n안드로이드버전 : "+Device.getAndroidVersionName()+"\n\n배터리 : "+Device.getBatteryLevel()+"%\n온도 : "+Device.getBatteryTemperature()/10+"°c\n충전여부 : "+Device.isCharging()+"\n전압상태 : "+Device.getBatteryVoltage();
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