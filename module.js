importClass(org.jsoup.Jsoup);
const comci = require('comci.js');
const scriptName = "module";
const FS = FileStream;

const K = Bridge.getScopeOf("KakaoLink");
const Kakao = K.Kakao

let homework_route = "/sdcard/BUKGWAKBOT/homework.json";

const Lw = "\u200b".repeat(500);

//급식에 필요한 변수들
var MealDataDate = new Array("-1","-1","-1");
var mealdata = new Array(new Array("","",""), new Array("\n","\n","\n"));

//시간표에 필요한 변수들
var TimeTableMap = {
  "수1(조아)":"수학(조아름)",
  "수1(박현)":"수학(박현종)",
  "물1(김형)":"물리(김형준)",
  "화1(이은)":"화학(이은실)",
  "생1(김지)":"생물(김지수)",
  "지1(오상)":"지구과학(오상림)",
  "물1(박규)":"물리(박규)",
  "화1(김재)":"화학(김재균)",
  "지1(오중)":"지구과학(오중렬)",
  "생1(김보)":"생물(김보선)",
  "정1(김현)":"정보(김현철)",
  "국어(전은)":"국어(전은선)",
  "사회(이은)":"통합사회(이은영)",
  "영1(이지)":"영어(이지현)",
  "영1(서원)":"영어(서원화)",
  "체1(이기)":"체육(이기성)",
  "융합(박규)":"융합과학탐구(박규)"
}

///////////////시간표///////////////
function Timetable_Function(tm) { //tm : 오늘(false)/내일(true)
  try {
    let today = new Date();
    if(tm==true) today = new Date(today.valueOf() + 86400000);
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜
    var day = today.getDay() - 1; //요일

    var dateString = year + "년 " + month + "월 " + date+ "일 ";

    switch(day){
      case 0: dateString+="월요일"; break;
      case 1: dateString+="화요일"; break;
      case 2: dateString+="수요일"; break;
      case 3: dateString+="목요일"; break;
      case 4: dateString+="금요일"; break;
      default: return (tm=0?"오늘":"내일") + "은 수업이 없습니다." + day;
    }
    
    var TimeTable = dateString;
    
    var TimeTableData = comci.getTimeTable(12045,1,2); //시간표 받아오기
    
    for(i=0;i<7;i++) {
      t = TimeTableData.시간표[day][i];
      TimeTable += "\n" + String(i+1) + "교시 : "
      try {
        TimeTable += TimeTableMap[t];
      }
      catch(e) {
        TimeTable += "없음";
      }
    }
    return TimeTable;
  }catch(e) {
    return "에러! : " + e;
  }
}

///////////////급식///////////////
function Meal_Function(tm,type,reset) { //tm : 오늘(false)/내일(true)
  try{
    var Result = new String("");
    let today = new Date();
    var year = String(today.getFullYear()); // 년도
    var month = numberPad(today.getMonth() + 1, 2);  // 월
    var date = numberPad(today.getDate(), 2);  // 날짜
    var day = today.getDay(); //요일
    var time = today.getTime();
    var tommorrow = 0;

    if(tm==true) {
      tommorrow = 1;
      tommorrow_time = new Date(time + 86400000);
      year = String(tommorrow_time.getFullYear()); // 년도
      month = numberPad(tommorrow_time.getMonth() + 1, 2);  // 월
      date = numberPad(tommorrow_time.getDate(), 2);  // 날짜
      day = tommorrow_time.getDay(); //요일
    }

    Result = year+"년 "+String(month)+"월 "+String(date)+"일 급식\n"
    if(day==0||day==6) {
      weekendMeal = new Array("오늘 주말이야","있겠냐","집밥","굶어","편의점","치킨","피자","족발","우리가 어떤 민족입니까?","궁금하면 500원")
      Result = weekendMeal[(Math.floor(Math.random() * 10))];
    }
    else
    {
      if(MealDataDate[tommorrow] != year+month+date||reset==true) { //급식 정보가 최신이 아닐 경우 갱신
        cr = RenewMealData(year, month, date, tommorrow);
        if(cr!=0) return cr;
      }

      if(type==1||type==2||type==3) {
        return mealdata[tommorrow][type-1];
      }
      else {
        return  (tommorrow == 1? "내일":"오늘")
                + "의 메뉴\n\n"
                + "\u200b".repeat(500)
                + mealdata[tommorrow][0] + "\n\n"
                + mealdata[tommorrow][1] + "\n\n"
                + mealdata[tommorrow][2] + "\n\n";
      }
    }
  }catch(e) {
    return "에러!\n" + e;
  }
}
function RenewMealData(year, month, date, tommorrow) {
  try{
      let ATPT_OFCDC_SC_CODE = "J10"; //시도교육청코드
      let SD_SCHUL_CODE = "7530851"; //학교 코드
      var meal_Data = JSON.parse(Jsoup.connect("http://121.168.91.34:8000/schoolmeal")
                                              .data("ATPT_OFCDC_SC_CODE",ATPT_OFCDC_SC_CODE)
                                              .data("SD_SCHUL_CODE", SD_SCHUL_CODE)
                                              .data("date", year+month+date)
                                              .ignoreContentType(true).get().text());
      try{
        for(i=0;i<meal_Data.result.length;i++) {
          mealdata[tommorrow][meal_Data.result[i].meal_code-1]  = meal_Data.result[i].meal_name + "\n"
                                    + "----------\n"
                                    + meal_Data.result[i].menu
                                    + "\n"+ meal_Data.result[i].cal;
        }
      }catch(e) {
        for(i=0;i<3;i++) mealdata[tommorrow][i] = "급식이 없습니다.";
      }
    //갱신일시 저장
    MealDataDate[tommorrow] = year+month+date;
    return 0;
  }catch(e) {
    Log.error("에러!\n" + e);
    return e;
  }
}

///////////////날씨///////////////
function Weather_Function(area, day) {
  day=Number(day);
  area = new String(area);
  var result = new String("");
  let date1 = new Date();
  var time = date1.getTime();

  let today = new Date(time+86400000*day); //날짜 맞추기
  var year = String(today.getFullYear()); // 년도
  var month = numberPad(today.getMonth() + 1, 2);  // 월
  var date = numberPad(today.getDate(), 2);  // 날짜

  if(area=="") area = "녹양동"; //기본장소(학교)
  try{
    result = "-" +year+"년"+month+"월"+date+"일 날씨정보 -\n\n";
    var url = Jsoup.connect("https://search.naver.com/search.naver?query="+area + "날씨 " + month+"월 "+date+"일").ignoreContentType(true).get();
    if(day==0){ //오늘
      try {
        result += url.select("div.title_area._area_panel > h2.title").text()
                  + "\n\n ■" + url.select("div:nth-child(1) > div > div.weather_info > div > div.weather_graphic > div.temperature_text > strong").text()
                  + "\n ■" + url.select("li:nth-child(1) > div > div.cell_temperature > span > span.lowest").text()+ "/"+ url.select("div.list_box > ul > li:nth-child(1) > div > div.cell_temperature > span > span.highest").text()
                  + "\n ■강수확률 " + url.select("div:nth-child(1) > div > div.weather_info > div > div.temperature_info > dl > dd:nth-child(2)").text()
                  + "\n ■습도 " + url.select("div:nth-child(1) > div > div.weather_info > div > div.temperature_info > dl > dd:nth-child(4)").text()
                  + "\n ■미세먼지 " + url.select("div:nth-child(1) > div > div.weather_info > div > div.report_card_wrap > ul > li:nth-child(1) > a > span").text() + " / 초미세먼지 "+ url.select("div:nth-child(1) > div > div.weather_info > div > div.report_card_wrap > ul > li:nth-child(2) > a > span").text()
                  + "\n\n자료 : 네이버";
        if((url.select("div.title_area._area_panel > h2.title").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      } catch (e) {Log.error(e);return "정보 불러오기 오류";}
    }

    else { //내일||모레
      try {
        result += url.select("div.sort_box._areaSelectLayer > div > div > span > em").text()
                + "\n◈오전\n  "+ url.select("div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(1) > div > div.temperature_info > p").text()
                + "\n ■" + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(1) > div > div.weather_graphic > div.temperature_text > strong").text()+ "C"
                + "\n ■" + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(1) > div > div.report_card_wrap > ul > li:nth-child(1) > a").text()+" / "+url.select("#main_pack > section.sc_new.cs_weather_new._cs_weather > div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(1) > div > div.report_card_wrap > ul > li:nth-child(2) > a").text()
                + "\n ■" + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(1) > div > div.temperature_info > dl").text()
                + "\n\n◈오후\n " + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(2) > div > div.temperature_info > p").text()
                + "\n ■" + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(2) > div > div.weather_graphic > div.temperature_text > strong").text()+ "C"
                + "\n ■" + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(2) > div > div.temperature_info > dl").text()
                + "\n ■" + url.select("div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(2) > div > div.report_card_wrap > ul > li:nth-child(1) > a").text() + " / " + url.select("#main_pack > section.sc_new.cs_weather_new._cs_weather > div._tab_flicking > div.content_wrap > div.open > div:nth-child(1) > div > div.weather_info.type_tomorrow > div > ul > li:nth-child(2) > div > div.report_card_wrap > ul > li:nth-child(2) > a").text()
                + "\n\n자료 : 네이버";  
        if((url.select("div.title_area._area_panel > h2.title").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      }catch(e){Log.error(e); return "정보 불러오기 오류";}
    }
  }catch(e){
    return "에러!\n" + e;
  }
}

///////////////코로나///////////////
function Corona_Function() {
  var result ="코로나19 현황\n\n";
  try {
    var url = Jsoup.connect("http://ncov.mohw.go.kr/bdBoardList_Real.do").get();
    result += "일일 현황" + url.select("#content > div > h5:nth-child(4) > span").text()
            + "\n----------\n확진자 : " + url.select("div:nth-child(1) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "\n국내 : " +url.select("div:nth-child(1) > ul > li:nth-child(2) > dl > dd > ul > li:nth-child(2) > p").text() + " 명"
            + "\n해외 : " +url.select("div:nth-child(1) > ul > li:nth-child(2) > dl > dd > ul > li:nth-child(3) > p").text() + " 명"
            + "\n\n누적 현황\n----------\n확진자 : " +url.select("div:nth-child(1) > ul > li:nth-child(1) > dl > dd").text() + ""
            + "\n격리해제 : " + url.select("div:nth-child(2) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "(" + url.select("div:nth-child(2) > ul > li:nth-child(2) > dl > dd > span").text() + ")\n"
            + "격리중 : " + url.select("div:nth-child(3) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "(" + url.select("div:nth-child(3) > ul > li:nth-child(2) > dl > dd > span").text() + ")\n"
            + "사망자 : " + url.select("div:nth-child(4) > ul > li:nth-child(1) > dl > dd").text() + " 명"
            + "(" + url.select("div:nth-child(4) > ul > li:nth-child(2) > dl > dd > span").text() + ")"
            + "\n\n자료 : 보건복지부";  
    return result;
  }catch(e){return e;}
}

///////////////한강수온///////////////
function Hangang_Function(type) {
  try {
    today = new Date();
    hour = today.getHours();  // 시간
     
 ​    ​HangangData​ ​=​ ​JSON​.​parse​(​Jsoup​.​connect​(​"http://openapi.seoul.go.kr:8088/5577427a6d736b783130377644627364/json/WPOSInformationTime/4/4/"​)​.​ignoreContentType​(​true​)​.​get​(​)​.​text​(​)​.​split​(​'['​)​[​1​]​.​split​(​']'​)​[​0​]​)​;
    hangang_temp = Number(HangangData.W_TEMP); //수온
    hangang_site = HangangData.SITE_ID; //위치
    hangang_time = HangangData.MSR_DATE; 

    let temp_C = String(hangang_temp) + "°C"; //섭씨
    let temp_K = String((hangang_temp + 273.15).toFixed(2))+ "K"; //절대온도
    let temp_F = String((hangang_temp * 1.8 + 32).toFixed(2))+ "°F";  //화씨
    let temp_R = String(((hangang_temp + 273.15)*1.8).toFixed(2))+ "°R";  //란씨
    if(type == '화씨') return("지금 한강의 수온은 " + temp_F + "(" + temp_R +") 입니다.\n("+hangang_time+hangang_site+"기준)\n\n하드디스크는 로우포맷 해야 복구가 불가능합니다.\n자살예방상담전화 1393\n청소년전화 1388\n라이선스 : CC-BY 서울특별시");
    else return("지금 한강의 수온은 " + temp_C + "(" + temp_K +") 입니다.\n("+hangang_time+" "+hangang_site+"기준)\n\n지금 죽으면 장례식에 49명만 옴\n자살예방상담전화 1393\n청소년전화 1388\n라이선스 : CC-BY 서울특별시");
  }catch(e){
    return("에러!\n" + e);
  }
}

///////////////코드업///////////////
function CodeUPRank_Function(name) {
  var result = "";
  try {
    var url = Jsoup.connect("https://codeup.kr/userinfo.php?user="+name).get();
    result += url.select("#lv > strong > span").text() + "\n"
            + url.select("body > main > div.container.mt-2 > blockquote > footer").text()
            + "\n전체순위 : " + url.select("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(1) > td.text-center").text()
            + "\n푼 문제 : " + url.select("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(2) > td.text-center > a").text();
    if((url.select("#lv > strong > span").text()).length<1) result = "그런 사용자는 없습니다.\n아이디를 확인하세요.";

  }catch(e){ return e;}
  return result;
}

///////////////도서검색///////////////
function Library_Search(book_name) {
  var result = "";
  try {
    var url = JSON.parse(Jsoup.connect("https://api.book.msub.kr/?book="+book_name+"&school=경기북과학고&local=경기").ignoreContentType(true).get().text());
    if(url.status!="normal") throw("검색 결과가 없습니다."); //실패시 throw
    result += "도서검색결과\n"
            + "검색된 책 : " + url.result.length + "권\n"
            + "----------\n";
    
    for(i=0;i<url.result.length;i++) { //목록출력
      bookInfo = url.result[i];
      result += (i+1) + ". " + bookInfo.title + "\n"
              + "  ◈저자 : " + bookInfo.writer.replace(";","\n") + "\n"
              + "  ◈출판사 : " + bookInfo.company + "\n"
              + "  ◈청구기호 : " + bookInfo.number + "\n"
              + "  ◈대출 가능 여부 : " + bookInfo.canRental;
      if(i==0) result += "\n더보기를 눌러주세요" + "\u200b".repeat(500); //2번째부터는 더보기로
      result += "\n\n";
    }

    return result;
  }catch(e){return e;}
}

///////////////숙제///////////////
function Homework_Add_Function(s,sender) {
  if(!s) return "내용을 입력하세요";
  try {
    let today = new Date();
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜

    homeworkFile = JSON.parse(FS.read(homework_route));
    homeworkFile.homework.push(s + "\n\t등록 : " + today.toLocaleDateString() + "\n\t등록자 : " + sender);
    FS.write(homework_route, JSON.stringify(homeworkFile));
    return "등록되었습니다." + Lw + "\n" + s;
  } catch(e) {
    Log.error(e);
    return "에러";
  }
} 

function Homework_Show_Function() {
  try {
    homeworkFile = JSON.parse(FS.read(homework_route));
    result = "현재 등록된 과제 : "+homeworkFile.homework.length+"개\n"+Lw;
    for(i=0;i<homeworkFile.homework.length;i++) {
      result += "["+(i+1) + "] " + homeworkFile.homework[i] + "\n\n";
    }
    return result;
  } catch(e) {
    Log.error(e);
    return "에러";
  }
}

function Homework_Remove_Function(n) {
  if(n.isNaN) return "숫자를 입력하세요.";
  if(n<1||n>homeworkFile.homework.length) return "잘못된 숫자입니다.";
  try {
    homeworkFile = JSON.parse(FS.read(homework_route));
    homeworkFile.homework.splice(n-1,1);
    FS.write(homework_route, JSON.stringify(homeworkFile));
    return "삭제되었습니다.";
  } catch(e) {
    Log.error(e);
    return "에러";
  }
}

function Homework_Change_Function(n, s) {
  if(n.isNaN) return "숫자를 입력하세요.";
  if(n<1||n>homeworkFile.homework.length) return "잘못된 숫자입니다.";
  if(!s) return "내용을 입력하세요.";
  try {
    homeworkFile = JSON.parse(FS.read(homework_route));
    homeworkFile.homework[n-1] = s;
    FS.write(homework_route, JSON.stringify(homeworkFile));
    return "변경되었습니다." + Lw + "\n" + s;
  } catch(e) {
    Log.error(e);
    return "에러";
  }
}


///////////////폰 상태///////////////
function PhoneData_Function() {
  var device_profile_name = android.provider.Settings.Global.getString(Api.getContext().getContentResolver(), "device_name");
  return  "북곽봇상태\n"
        + "\n안드로이드버전 : " + Device.getAndroidVersionName()
        + "\n\n배터리 : " + Device.getBatteryLevel()
        + "%\n온도 : " + Device.getBatteryTemperature()/10
        + "°c\n충전여부 : "+Device.isCharging()
        + "\n전압상태 : " + Device.getBatteryVoltage();
}

///////////////음악검색///////////////
function MusicSearch(title, room){
  var MusicData = JSON.parse(Jsoup.connect("https://api.music.msub.kr/?song=" + title).ignoreContentType(true).get().text());
  if(MusicData.song.length==0) return "검색 결과가 없습니다."; //실패시 throw
  MusicData = MusicData.song[0];
  MusicThumbnail = MusicData.albumimg;
  MusicTitle = MusicData.name;
  MusicAlbum = MusicData.album;
  MusicLink = MusicData.melonlink;
  MusicArtist = MusicData.artist;

  Kakao.send(room,{
    "link_ver" : "4.0",
    "template_id" : 55964,
    "template_args" : {
      "title": MusicTitle,
      "image" : MusicThumbnail,
      "des" : MusicArtist + " [" + MusicAlbum + "]",
      "link" : MusicLink.replace("http://m.app.melon.com/","")
    }
    }, "custom");
}

///////////////가사///////////////
function Lyrics(title) {
  var MusicData = JSON.parse(Jsoup.connect("https://api.music.msub.kr/?song=" + title).ignoreContentType(true).get().text());
  if(MusicData.song.length==0) return "검색 결과가 없습니다."; //실패시 throw

  MusicData = MusicData.song[0];
  MusicLyrics = MusicData.lyrics;
  MusicTitle = MusicData.name;
  MusicArtist = MusicData.artist;

  return MusicTitle + "\n" + MusicArtist + "\n▣가사\n" + Lw + MusicLyrics;
}


/*
* 이 소스는 조유리즈님이 만드신 번역 소스입니다.
* 상업적 이용 불가, 배포 불가 
* 라이선스 : MIT
*/

///////////////번역///////////////
const getTranslate = (resultLanguage, q) => {
  try{
  const language = getLanguage(resultLanguage);
  const parse = Jsoup.connect('https://translate.kakao.com/translator/translate.json')
      .header('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Referer', 'https://translate.kakao.com/m')
      .data('queryLanguage', 'auto')
      .data('resultLanguage', language)
      .data('q', q)
      .ignoreContentType(true)
      .ignoreHttpErrors(true)
      .post()
  const json = JSON.parse(parse.text());
  const result = json.result.output;
  return result;
  }catch(e){return "!번역 [언어] [내용]"}
}
const getLanguage = (a) => {
  const language = {
      '영어': 'en',
      '일본어': 'jp',
      '중국어': 'cn',
      '네덜란드어': 'nl',
      '독일어': 'de',
      '러시아어': 'ru',
      '말레이시아어': 'ms',
      '벵골어': 'bn', 
      '베트남어': 'vi',
      '스페인어': 'es',
      '아랍어': 'ar',
      '이탈리아어': 'it',
      '인도네시아어': 'id',
      '태국어': 'th',
      '터키어': 'tr',
      '포르투갈어': 'pt',
      '프랑스어': 'fr',
      '힌디어': 'hi'
  };
  return language[a];
}

///////////////링크 단축///////////////
function shorten(url) {
  result = Jsoup.connect("http://di.do/index.php").data("u", url).post().select("input[name^=n]").attr("value");
  if(!result.split("do/")[1]=="EU") return "URL이 올바르지 않습니다.";
  return result;
}

///////////////핑퐁///////////////
function PingPong(str, room) {
  try{
    result = JSON.parse(Jsoup.connect("http://121.168.91.34:8000/pingpong?query=" + str + "&sessionId=" + room).ignoreContentType(true).get().text())
    text = result.text;
    if(text == "급식") return "오늘 급식이에요!\n"+Meal_Function(0,0,false);
    else if(text == "시간표") return "시간표를 알려드릴게요.\n"+Timetable_Function(0);
    return text;
  }catch(e){ return e;}
}

///////////////시험까지 남은 시간///////////////
function LeftTimeToExam()
{
  var examTime = new Date(2021,12-1,9,11,30,0);
  var nowTime = new Date();
  var timeGap = examTime-nowTime;

  let gapSec = parseInt(timeGap/1000);
  let gapMin = parseInt(gapSec / 60);
  gapSec = gapSec % 60;
  let gapHour = parseInt(gapMin / 60);
  gapMin = gapMin % 60;
  let gapDay = parseInt(gapHour / 24);
  gapHour = gapHour % 24;

  return gapDay + "일 " + gapHour + "시간 " + gapMin + "분 " + gapSec + "초(" + parseInt(timeGap/1000) +"초)";
}

///////////////주식///////////////
function Stock(name) {
  var url = "https://search.naver.com/search.naver?query=주식 " + name;
  var data = Jsoup.connect(url).get();
  var name = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.stk_nm").text();
  var code = data.select("#_cs_root > div.ar_spot > div > h3 > a > em").text();
  var price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > strong").text();
  if(!price) {
    var price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.dw > strong").text();
    var price_change = "-"+data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.dw > span.n_ch > em:nth-child(3)").text();
    var change_percent = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.dw > span.n_ch > em:nth-child(4)").text();
  }
  else {
    var price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > strong").text();
    var price_change = "+"+data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > span.n_ch > em:nth-child(3)").text();
    var change_percent = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > span.n_ch > em:nth-child(4)").text();
  } 
  if(!price) {
    var price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.eq > strong").text();
    var price_change = "보합";
    var change_percent = "";
  }

  return "[주식정보]\n" + name + "(" + code + ")\n현재 주가 : " + price + "\n주가 변동 : " + price_change + change_percent;
}

///////////////기프티콘 낚시////////////////
function Giftcon(room, type){
  var image ="";
  switch(type)
  {
    case "3090" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/3090.png"; break;
    case "3990X" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/3990X.png"; break;
    case "기프트카드10" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/기프트카드10000.png"; break;
    case "기프트카드5" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/기프트카드5000.png"; break;
    case "롤" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/롤RP.png"; break;
    case "싸이버거" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/싸이버거.png"; break;
    case "아메리카노" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/아메리카노.png"; break;
    case "아이스크림케이크" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/아메리카노.png"; break;
    case "아이폰12" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/아이폰12.png"; break;
    case "아이폰미니" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/아이폰미니.png"; break;
    case "에어팟" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/에어팟.png"; break;
    case "조기졸업권" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/조기졸업권.png"; break;
    case "처갓집" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/처갓집.png"; break;
    case "컵밥" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/컵밥.png"; break;
    case "페레레로쉐" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/페레레로쉐.png"; break;
    case "홍삼" : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/홍삼.png"; break;
    default : image = "https://raw.githubusercontent.com/hegelty/BUKGWAKBOT/master/Gifticon/3090.png";
  }
  Kakao.send(room,{
      link_ver : "4.0",
      template_id : 53767,
      template_args : {
      title : "선물과 메시지가 도착하였습니다.",
      des : "",
      image : image
      }
    }, "custom");
}

///////////////현재 TV////////////////
//[출처] TV 지상파 방송 편성표 파싱 (카카오톡 봇 커뮤니티) | 작성자 에케
function TV_Now() {
  data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=%ED%8E%B8%EC%84%B1%ED%91%9C").get().select("li.program_item.on");
  k1 = data.get(0).select(".pr_name").text();
  k2 = data.get(1).select(".pr_name").text();
  m = data.get(2).select(".pr_name").text();
  s = data.get(3).select(".pr_name").text();
  e1 = data.get(4).select(".pr_name").text();
  e2 = data.get(5).select(".pr_name").text();
  return("현재 방송중인 프로그램입니다.\nKBS1 " + k1 + "\nKBS2 " + k2 + "\nMBC " + m + "\nSBS " + s + "\nEBS1 " + e1 + "\nEBS2 " + e2 + "\n@sh4cker");
}

//[출처] 게이지 함수 (카카오톡 봇 커뮤니티) | 작성자 뀨야
function Creat_Bar(num, max, p, n){
  let bar = ['▏', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];
  let per = 100/(max/num)/10;
  let gauge = [];

  for(let i=0; i<parseInt(per); i++) gauge.push('█');

  if(per != parseInt(per))
      gauge.push(bar[parseInt((per-gauge.length)*10/1.25)]);

  for(let i=gauge.length; i<10; i++) gauge.push(' ');

  if(p == undefined || p == null) p = 0; if(n == undefined) n = 0;

  return gauge.join('')+
      (!p?'':' ('+(per*10).toFixed(1)+'%)')+
      (!n?'':' ('+num+'/'+max+')');
}

//숫자 앞을 0으로 채움
function numberPad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function replaceAll(str, searchStr, replaceStr) {

  return str.split(searchStr).join(replaceStr);
}
