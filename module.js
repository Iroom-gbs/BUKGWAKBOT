importClass(org.jsoup.Jsoup);
const comci = require('comci.js');
const scriptName = "module";
const FS = FileStream;

const K = Bridge.getScopeOf("KakaoLink");
const Kakao = K.Kakao

let homework_route = "/sdcard/BUKGWAKBOT/homework.json";

const Lw = "\u200b".repeat(500);

//급식에 필요한 변수들
var MealDataDate = new Array("-1","-1");
var mealdata = new Array(new Array("","",""), new Array("\n","\n","\n"));

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
      switch (t)
      {
          case "수1(조아)":
              TimeTable += "수학(조아름)\n ▷ZOOM ID : 340 067 2377\n ▷ZOOM PW : 828282"; break;
          case "수1(박현)":
              TimeTable += "수학(박현종)\n ▷ZOOM ID : 905 460 8554\n ▷ZOOM PW : 28173"; break;
          case "물1(김형)":
              TimeTable += "물리(김형준)\n ▷ZOOM ID : 716 9383 0607\n ▷ZOOM PW : 202020"; break;
          case "화1(이은)":
              TimeTable += "화학(이은실)\n ▷ZOOM ID : 216 3672 517\n ▷ZOOM PW : 20211712"; break;
          case "생1(김지)":
              TimeTable += "생물(김지수)\n ▷ZOOM ID : 797 844 9420\n ▷ZOOM PW : 30500"; break;
          case "지1(오상)":
              TimeTable += "지구과학(오상림)\n ▷ZOOM ID : 499 771 6453\n ▷ZOOM PW : a1234"; break;
          case "물1(박규)":
              TimeTable += "물리(박규)\n ▷ZOOM ID : 616 969 5818\n ▷ZOOM PW : 210412"; break;
          case "화1(김재)":
              TimeTable += "화학(김재균)\n ▷ZOOM ID : 967 747 5050\n ▷ZOOM PW : 684413"; break;
          case "지1(오중)":
              TimeTable += "지구과학(오중렬)\n ▷ZOOM ID : 605 412 6695\n ▷ZOOM PW : LOVEGBSHS"; break;
          case "생1(김보)":
              TimeTable += "생물(김보선)\n ▷ZOOM ID : 922 200 0716\n ▷ZOOM PW : 161616"; break;
          case "정1(김현)":
              TimeTable += "정보(김현철)\n ▷ZOOM ID : 444 294 7122\n ▷ZOOM PW : 334082"; break;
          case "국어(전은)":
              TimeTable += "국어(전은선)\n ▷ZOOM ID : 707 862 0937\n ▷ZOOM PW : ApSem0"; break;
          case "사회(이은)":
              TimeTable += "통합사회(이은영)\n ▷ZOOM ID : 260 791 3007\n ▷ZOOM PW : 2021"; break;
          case "영1(이지)":
              TimeTable += "영어(이지현)\n ▷ZOOM ID : 688 651 8204\n ▷ZOOM PW : 12345"; break;
          case "영1(서원)":
              TimeTable += "영어(서원화)\n ▷ZOOM ID : 474 481 9797\n ▷ZOOM PW : 7777"; break;
          case "체1(이기)":
              TimeTable += "체육(이기성)\n ▷ZOOM ID : 699 847 6147\n ▷ZOOM PW : 30001"; break;
          case "융합(박규)":
              TimeTable += "융합과학탐구(박규)\n ▷ZOOM ID : 616 969 5818\n ▷ZOOM PW : 210412"; break;
          default:
              TimeTable += "없음";
              break;
      }
    }
      return TimeTable;
  }catch(e) {
    return "에러! : " + e;
  }
}

function Timetable_to_String(tm, period) {
  let today = new Date();
  if(tm==true) today = new Date(today.valueOf() + 86400000);
  let year = String(today.getFullYear()); // 년도
  let month = numberPad(today.getMonth() + 1, 2);  // 월
  let date = numberPad(today.getDate(), 2);  // 날짜
  var day = today.getDay(); //요일
  var dateString = year + "년 " + month + "월 " + date+ "일 ";

  switch(day){
    case 0: dateString+="월요일"; break;
    case 1: dateString+="화요일"; break;
    case 2: dateString+="수요일"; break;
    case 3: dateString+="목요일"; break;
    case 4: dateString+="금요일"; break;
    default: return (tm=0?"오늘":"내일") + "은 수업이 없습니다." + day;
  }
  
  var TimeTableString = dateString;

  Timetable = Timetable_Function(tm);
  if(period == 0){
    for(i=1;i<=7;i++)
    {
      TimeTableString += "\n" + i + "교시 : " + Timetable_Function(tm, i-1);
    }
    return TimeTableString;
  }
  else return TimeTableString + "\n" + period + "교시 : " + Timetable_Function(tm, period-1);
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
      weekendMeal = new Array("오늘 주말이야","있겠냐","집밥","굶어","편의점","치킨","피자","족발","싸다김밥","우리가 어떤 민족입니까?","궁금하면 500원")
      Result = weekendMeal[(Math.floor(Math.random() * 10))];
    }
    else
    {
      if(MealDataDate[tommorrow] != year+month+date||reset==true) { //급식 정보가 최신이 아닐 경우 갱신
        cr = RenewMealData(year, month, date, tommorrow);
        if(cr!=0) return cr;
      }

      switch(type) {
        case 1: 
          return mealdata[tommorrow][0]; break;
        case 2:
          return mealdata[tommorrow][1]; break;
        case 3:
          return mealdata[tommorrow][2]; break;
        default:
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
      var meal_Data = JSON.parse(Jsoup.connect("http://api.hegelty.me/schoolmeal")
                                              .data("ATPT_OFCDC_SC_CODE",ATPT_OFCDC_SC_CODE)
                                              .data("SD_SCHUL_CODE", SD_SCHUL_CODE)
                                              .data("date", year + month + date)
                                              .ignoreContentType(true).get().text());
      if(meal_Data.success == "실패") return "급식 정보가 없습니다."
      
      for(i=0;i<meal_Data.result.length;i++) {
        mealdata[tommorrow][meal_Data.result[i].meal_code-1]  = meal_Data.result[i].meal_name + "\n"
                                   + "----------\n"
                                   + meal_Data.result[i].menu
                                   + "\n"+ meal_Data.result[i].cal;
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

  if(area=="") area = "녹양동"; //기본장소
  try{
    result = "-" +year+"년"+month+"월"+date+"일 날씨정보 -\n\n";
    var url = Jsoup.connect("https://search.naver.com/search.naver?query="+area + "날씨 " + month+"월 "+date+"일").ignoreContentType(true).get();
    if(day==0){ //오늘
      try {
        result += url.select("div.sort_box._areaSelectLayer > div > div > span > em").text()
                  + "\n\n" + url.select("div.today_area._mainTabContent > div.main_info > div > ul > li:nth-child(1) > p").text()
                  + "\n ■현재온도" + url.select("div.main_info > div > p > span.todaytemp").text() + "°C"
                  + "\n ■최저 " + url.select("span.min > span").text()+ "°C 최고"+ url.select("span.max > span").text() + "°C"
                  + "\n ■체감온도 " + url.select("span.sensible > em > span").text() + "°C"
                  + "\n ■미세먼지 " + url.select("dd:nth-child(2) > span.num").text()
                  + "\n ■초미세먼지 " + url.select("dd:nth-child(4) > span.num").text()
                  + "\n\n자료 : 네이버";
        if((url.select("div.api_title_area > h2").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      } catch (e) {Log.error(e);return "정보 불러오기 오류";}
    }

    else if(day==1){ //내일
      try {
        result += url.select("div.sort_box._areaSelectLayer > div > div > span > em").text()
                + "\n\n◈오전\n  "+ url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div:nth-child(4) > div:nth-child(2) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select("div:nth-child(4) > div:nth-child(2) > p > span.todaytemp").text()+ "°C"
                + "\n\n◈오후  " + url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div:nth-child(4) > div:nth-child(3) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select("div:nth-child(4) > div:nth-child(3) > p > span.todaytemp").text()+ "°C"
                + "\n\n자료 : 네이버";  
        if((url.select("div.api_title_area > h2").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      }catch(e){Log.error(e); return "정보 불러오기 오류";}
    }

    else{ //모레
      try {
        result += url.select("div.sort_box._areaSelectLayer > div > div > span > em").text()
                + "\n\n◈오전\n  "+ url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.tomorrow_area.day_after._mainTabContent > div:nth-child(2) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select("div:nth-child(2) > p > span.todaytemp").text()+ "°C"
                + "\n\n◈오후  " + url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.tomorrow_area.day_after._mainTabContent > div:nth-child(3) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select("div:nth-child(3) > p > span.todaytemp").text()+ "°C"
                + "\n\n자료 : 네이버";  
        if((url.select("div.api_title_area > h2").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      }catch(e){Log.error(e);return "정보 불러오기 오류";}
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
    HangangData = JSON.parse(Jsoup.connect("http://openapi.seoul.go.kr:8088/5577427a6d736b783130377644627364/json/WPOSInformationTime/4/4/").ignoreContentType(true).get().text().split('[')[1].split(']')[0]);
    hangang_temp = Number(HangangData.W_TEMP); //수온
    hangang_site = HangangData.SITE_ID; //위치
    hangang_time = HangangData.MSR_DATE; 

    let temp_C = String(hangang_temp) + "°C"; //섭씨
    let temp_K = String((hangang_temp + 273.15).toFixed(2))+ "K"; //절대온도
    let temp_F = String((hangang_temp * 1.8 + 32).toFixed(2))+ "°F";  //화씨
    let temp_R = String(((hangang_temp + 273.15)*1.8).toFixed(2))+ "°R";  //란씨
    if(type == '화씨') return("지금 한강의 수온은 " + temp_F + "(" + temp_R +") 입니다.\n("+hangang_time+hangang_site+"기준)\n\n하드디스크는 로우포맷 해야 복구가 불가능합니다.\n자살예방상담전화 1393\n청소년전화 1388");
    else return("지금 한강의 수온은 " + temp_C + "(" + temp_K +") 입니다.\n("+hangang_time+" "+hangang_site+"기준)\n\n지금 죽으면 장례식에 49명만 옴\n자살예방상담전화 1393\n청소년전화 1388");
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
function Homework_Add_Function(s) {
  if(!s) return "내용을 입력하세요";
  try {
    homeworkFile = JSON.parse(FS.read(homework_route));
    homeworkFile.homework.push(s);
    FS.write(homework_route, JSON.stringify(homeworkFile));
    return "등록되었습니다."
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


///////////////폰 상태///////////////
function PhoneData_Function() {
  var device_profile_name = android.provider.Settings.Global.getString(Api.getContext().getContentResolver(), "device_name");
  return  "북곽봇상태\n\n휴대폰 이름 : " + device_profile_name
        + "\n안드로이드버전 : " + Device.getAndroidVersionName()
        + "\n\n배터리 : " + Device.getBatteryLevel()
        + "%\n온도 : " + Device.getBatteryTemperature()/10
        + "°c\n충전여부 : "+Device.isCharging()
        + "\n전압상태 : " + Device.getBatteryVoltage();
}

///////////////유효숫자///////////////
function Significant_figures(n) {
  try{
    for(i=0;i<n.length;i++){ //숫자나 .이 아닌 문자가 있을 때
      if(n[i]!='.'&&(n[i]<'0'||n[i]>'9')) throw("Wrong Number");
    }
    n=n.split(".");
    var z_cnt=0,cnt=0,p;

    if(n.length>2) throw("Wrong Number"); //소숫점이 여러개 있을 때
    if(n[0].length==0) throw("Wrong Number"); //소숫점 앞에 아무것도 없을 때

    for(i=0;i<n[0].length;i++) { //정수부
      if('1'<=n[0][n[0].length-1-i] && n[0][n[0].length-1-i]<='9'){
        z_cnt+=i; //0이 아닌 숫자가 나오기 전까지 0 갯수
        cnt+=n[0].length-i; //일반 숫자 갯수
        break;
      }
    }
    if(n.length==2) { //소수부
      cnt+=z_cnt;
      cnt+=n[1].length;
      p=-n[1].length;
    }
    else p=z_cnt;
    return "유효숫자 : " + cnt + "개(10^"+p+" 자리)";
  }catch(e) {
    if(e=="Wrong Number") return "숫자가 올바르지 않습니다.";
    else return e;
  }
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
    result = JSON.parse(Jsoup.connect("http://api.hegelty.me/pingpong?query=" + str + "&sessionId=" + room).ignoreContentType(true).get().text())
    text = result.text;
    if(text == "급식") return "오늘 급식이에요!\n"+Meal_Function(0,0,false)
    else if(text == "시간표") return "시간표를 알려드릴게요.\n"+Timetable_Function(0)
    else if(text == "줌") return "줌 ID와 PW에요.\nZOOM ID/PW\n\n" + Lw + "수학(조아름)\n ▷ZOOM ID : 340 067 2377\n ▷ZOOM PW : 828282\n수학(박현종)\n ▷ZOOM ID : 905 460 8554\n ▷ZOOM PW : 28173\n물리(김형준)\n ▷ZOOM ID : 716 9383 0607\n ▷ZOOM PW : 202020\n화학(이은실)\n ▷ZOOM ID : 216 3672 517\n ▷ZOOM PW : 20211712\n생물(김지수)\n ▷ZOOM ID : 797 844 9420\n ▷ZOOM PW : 30500\n지구과학(오상림)\n ▷ZOOM ID : 499 771 6453\n ▷ZOOM PW : a1234\n물리(박규)\n ▷ZOOM ID : 616 969 5818\n ▷ZOOM PW : 210412\n화학(김재균)\n ▷ZOOM ID : 967 747 5050\n ▷ZOOM PW : 684413\n지구과학(오중렬)\n ▷ZOOM ID : 605 412 6695\n ▷ZOOM PW : LOVEGBSHS\n생물(김정미)\n ▷ZOOM ID : 745 635 4367\n ▷ZOOM PW : 48904\n정보(김현철)\n ▷ZOOM ID : 444 294 7122\n ▷ZOOM PW : 334082\n국어(전은선)\n ▷ZOOM ID : 707 862 0937\n ▷ZOOM PW : ApSem0\n통합사회(이은영)\n ▷ZOOM ID : 260 791 3007\n ▷ZOOM PW : 2021\n영어(이지현)\n ▷ZOOM ID : 864 663 3910\n ▷ZOOM PW : 11111\n영어(서원화)\n ▷ZOOM ID : 474 481 9797\n ▷ZOOM PW : 7777\n체육(이기성)\n ▷ZOOM ID : 699 847 6147\n ▷ZOOM PW : 30001\n융합과학탐구(박규)\n ▷ZOOM ID : 616 969 5818\n ▷ZOOM PW : 210412";
    return text;
  }catch(e){ return e;}
}

///////////////시험까지 남은 시간///////////////
function LeftTimeToExam()
{
  var examTime = new Date(2021,10,6,9,10,00,00);
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

///////////////산화수///////////////
function   Oxidation_Number(s)
{
  var Oneja = {'H':0,'He':0,'Li':0,'Be':0,'B':0,'C':0,'N':0,'O':0,'F':0,'Ne':0,'Na':0,'Mg':0,'Al':0,'Si':0,'P':0,'S':0,'Cl':0,'Ar':0,'K':0,'Ca':0,'Sc':0,'Ti':0,'V':0,'Cr':0,'Mn':0,'Fe':0,'Co':0,'Ni':0,'Cu':0,'Zn':0,'Ga':0,'Ge':0,'As':0,'Se':0,'Br':0,'Kr':0,'Rb':0,'Sr':0,'Y':0,'Zr':0,'Nb':0,'Mo':0,'Tc':0,'Ru':0,'Rh':0,'Pd':0,'Ag':0,'Cd':0,'In':0,'Sn':0,'Sb':0,'Te':0,'I':0,'Xe':0,'Cs':0,'Ba':0,'La':0,'Ce':0,'Pr':0,'Nd':0,'Pm':0,'Sm':0,'Eu':0,'Gd':0,'Tb':0,'Dy':0,'Ho':0,'Er':0,'Tm':0,'Yb':0,'Lu':0,'Hf':0,'Ta':0,'W':0,'Re':0,'Os':0,'Ir':0,'Pt':0,'Au':0,'Hg':0,'Tl':0,'Pb':0,'Bi':0,'Po':0,'At':0,'Rn':0,'Fr':0,'Ra':0,'Ac':0,'Th':0,'Pa':0,'U':0,'Np':0,'Pu':0,'Am':0,'Cm':0,'Bk':0,'Cf':0,'Es':0,'Fm':0,'Md':0,'No':0,'Lr':0,'Rf':0,'Db':0,'Sg':0,'Bh':0,'Hs':0,'Mt':0};
  var Result = {'H':0,'He':0,'Li':0,'Be':0,'B':0,'C':0,'N':0,'O':0,'F':0,'Ne':0,'Na':0,'Mg':0,'Al':0,'Si':0,'P':0,'S':0,'Cl':0,'Ar':0,'K':0,'Ca':0,'Sc':0,'Ti':0,'V':0,'Cr':0,'Mn':0,'Fe':0,'Co':0,'Ni':0,'Cu':0,'Zn':0,'Ga':0,'Ge':0,'As':0,'Se':0,'Br':0,'Kr':0,'Rb':0,'Sr':0,'Y':0,'Zr':0,'Nb':0,'Mo':0,'Tc':0,'Ru':0,'Rh':0,'Pd':0,'Ag':0,'Cd':0,'In':0,'Sn':0,'Sb':0,'Te':0,'I':0,'Xe':0,'Cs':0,'Ba':0,'La':0,'Ce':0,'Pr':0,'Nd':0,'Pm':0,'Sm':0,'Eu':0,'Gd':0,'Tb':0,'Dy':0,'Ho':0,'Er':0,'Tm':0,'Yb':0,'Lu':0,'Hf':0,'Ta':0,'W':0,'Re':0,'Os':0,'Ir':0,'Pt':0,'Au':0,'Hg':0,'Tl':0,'Pb':0,'Bi':0,'Po':0,'At':0,'Rn':0,'Fr':0,'Ra':0,'Ac':0,'Th':0,'Pa':0,'U':0,'Np':0,'Pu':0,'Am':0,'Cm':0,'Bk':0,'Cf':0,'Es':0,'Fm':0,'Md':0,'No':0,'Lr':0,'Rf':0,'Db':0,'Sg':0,'Bh':0,'Hs':0,'Mt':0};

  var ion=0, e_cnt=0;
  //원자 갯수 기록
  for(var cnt=0;s[cnt];cnt++)
  {
    var amount=0;
    try{
      Log.debug(s[cnt]);
      if(s[cnt]>='A'&&s[cnt]<='Z'){
        if(s[cnt+1]>='a'&&s[cnt+1]<='z'){ //두글자
          t_cnt=0;
          if(Oneja.hasOwnProperty(s[cnt]+s[cnt+1])){ //원자가 맞으면
            if(isNaN(s[cnt+2])==false){ //개수
              for(i=cnt+2;isNaN(s[i]);i++){
                amount=amount*10+Number(s[i]);
                t_cnt++;
              }
              Oneja[s[cnt]+s[cnt+1]]=amount;
            }
            else Oneja[s[cnt]+s[cnt+1]]=1;
            cnt+=t_cnt+1;
            e_cnt++;
          }
          else throw("Wrong Element"); //아닐때
        }
        //한글자
        else if(Oneja.hasOwnProperty(s[cnt])){ //원자가 맞으면
          t_cnt=0;
          if(isNaN(s[cnt+1])==false){ //개수
              for(i=cnt+1;!isNaN(s[i])&&i<=s.length;i++){
                amount=amount*10+Number(s[i]);
                t_cnt++;
              }
            }
              if(amount==0) amount=1;
              Oneja[s[cnt]]=amount;
              cnt+=t_cnt;
              e_cnt++;
              Log.debug(s[cnt-1] + String(Oneja[s[cnt]]))
          }
        else throw("Wrong Element");
      }
      else if(s[cnt]=='+'){
        t_cnt=0;
        if(isNaN(s[cnt+1])==false){
          for(i=cnt+1;!isNaN(s[i])&&i<=s.length;i++){
            ion=ion*10+Number(s[i]);
            t_cnt++;
          }
        }
        if(ion==0) ion=1;
        cnt+=t_cnt;
      }
      else if(s[cnt]=='-'){
        t_cnt=0;
        if(isNaN(s[cnt++])==false){
          for(i=cnt+1;!isNaN(s[i])&&i<=s.length;i++){
            ion=ion*10-Number(s[i]);
            t_cnt++;
          }
        }
        if(ion==0) ion=-1;
        Log.debug(ion)
        cnt+=t_cnt;
      }
    }catch(e){
      if(e=="Wrong Element") return "잘못된 화학식입니다.";
      else return e;
    }
  }
  Log.debug(e_cnt)
  if(e_cnt==1){ //단원자
    Log.debug("단원자")
    if(ion==0){
      Log.debug("ni")
      for(key in Oneja){
        if(Oneja[key]>1) return key + " : 0";
      }
    }
    else{
      Log.debug("이온")
        for(key in Oneja){
        if(Oneja[key]>1) return key + " : " + (ion/Oneja[key]>0?"+"+ion/Oneja[key]:ion/Oneja[key]);
      }
    }
  }
  else{
    var jugi1 = ['Li','Na','K','Rb','Cs','Fr']; //1족
    var jugi2 = ['Be','Mg','Ca','Sr','Ba','Ra']; //2족
    var jugi17 = ['F','Cl','Br','I','At','Ts']; //17족
    if(Oneja['F']>0){ //F -1
      Result['F']=-1;
      e_cnt--;
      ion-=Oneja['F'];
    }
    for(i in jugi1){ //1족 +1
      if(Oneja[i]>0){
        Result[i]=1;
        e_cnt--;
        ion+=Oneja[i];
      }
    }
    if(e_cnt){
    for(i in jugi2){ //2족 +2
      if(Oneja[i]>0){
        Result[i]=2;
        e_cnt--;
        ion+=Oneja[i]*2;
      }
    }
    if(Oneja['Al']>0){ //Al +3
      Result['Al']=3;
      e_cnt--;
      ion+=Oneja['Al']*3;
    }
    if(e_cnt){ //H +1
    if(Oneja['H']>0){
      Result['H']=1;
      e_cnt--;
      ion+=Oneja['H'];
    }
    if(e_cnt){ //O -2
    if(Oneja['O']>0){
      Result['O']=-2;
      e_cnt--;
      ion-=Oneja['O']*2;
    }
    if(e_cnt){
    for(i in jugi17){ //17족 -1
      if(Oneja[i]>0){
        Result[i]=-1;
        e_cnt--;
        ion-=Oneja[i];
      }
    }
    if(e_cnt){ 
    if(e_cnt==1){
      for(key in Oneja){
        if(Oneja[key]>0&&Result[key]==0){
          Result[key]=-ion;
          e_cnt--;
      }
    }
  }}}}}
  }
  var Result_String="";
  for(key in Oneja){
    if(Oneja[key]>0){
      if(Result[key]==0&&e_cnt>0) Result_String+=key + " : 알 수 없음\n"; 
      else Result_String+=key + " : " + (Result[key]>0?"+"+Result[key]:Result[key]) +"\n"; 
    }
  }
  return Result_String.slice(0,-1);
  }
}