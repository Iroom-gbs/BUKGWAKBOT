importClass(org.jsoup.Jsoup);
const scriptName = "module";
const FS = FileStream;

const K = Bridge.getScopeOf("Kaling");
const Kakao = K.Kakao
let room_info = "/sdcard/BUKGWAKBOT/room.json";

const Lw = "\u200b".repeat(500);

//급식에 필요한 변수들
var dayString = ["월","화","수","목","금","토","일"];

///////////////반 설정///////////////
function setClass(grade,cls,room) {
  grade = Number(grade);
  cls = Number(cls);
  if(Number.isInteger(grade) == false || Number.isInteger(cls) == false) return "학년과 반은 정수로 입력해주세요.";
  if(grade < 1 || grade > 3) return "학년은 1~3학년만 입력해주세요.";
  if(cls < 1 || cls > 5) return "반은 1~5반만 입력해주세요.";

  grade = parseInt(grade);
  cls = parseInt(cls);

  room_data = JSON.parse(FS.read(room_info));
  if(room_data[room] == undefined) {
    room_data[room] = {
    "grade":grade,
    "cls":cls
    };
  }
  else {
    origin = room_data[room];
    room_data[room].grade = grade;
    room_data[room].cls = cls;
  }
  
  FS.write(room_info,JSON.stringify(room_data));
  return "반 설정이 완료되었습니다.";
}

function getRoomInfo(room) {
  room_data = JSON.parse(FS.read(room_info));
  try{
    return room_data[room]?room_data[room]:-1;
  } catch(e) {
    return -1;
  }
}

///////////////시간표///////////////
function showTimetable(msg_data,tm,room) {
  try{
    let room_data = getRoomInfo(room);
    let grade,cls;
    grade = Number(msg_data[msg_data.length-2])
    cls = Number(msg_data[msg_data.length-1])

    if(Number.isInteger(grade) == false || Number.isInteger(cls) == false || grade < 1 || grade > 3 || cls < 1 || cls > 5) {
      if(room_data!=-1)
      {
      grade = room_data.grade;
      cls = room_data.cls;
      }
      else return "반을 설정하거나 학년과 반을 입력하세요.\n예시) !반설정 1 2\n!시간표 1 2";
    }
    grade = parseInt(grade);
    cls = parseInt(cls);

    let today = new Date();
    let today_day = today.getDay();
  
    today = new Date(today.getTime() + 86400000 * tm)
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜
    let day = today.getDay() - 1; //요일

    let TimeTable =  year + "년 " + month + "월 " + date+ "일 " + dayString[day] + "요일\n"+grade+"학년"+cls+"반\n";
    
    let res = JSON.parse(Jsoup.connect("http://bgb.hegelty.space/timetable")
                              .data("school_name","경기북과학고")
                              .data("simple",1)
                              .data("next_week",day<today_day?1:0)
                              .ignoreContentType(true).get().text());
    
    if(res.success == false) return "시간표가 없습니다.";

    data = res.data[grade][cls].timetable[day+1]
    for(let i=1;i<=7;i++) {
      TimeTable += "\n" + data[i].period + "교시 : " + data[i].subject + "(" + data[i].teacher + ")" + (data[i].replaced?" (대체)":"");
    }
    TimeTable += "\n갱신: " + res.갱신일시;
    return TimeTable;
  }catch(e) {
    return "에러!! : " + e;
  }
}

///////////////급식///////////////
function showMeal(tm,type,reset) {
  tmd = ["그끄저께", "그제", "어제", "오늘","내일","모레", "글피", "그글피"];
  try{
    let today = new Date();

    today = new Date(today.getTime() + 86400000 * tm)
    let year = String(today.getFullYear()); // 년도
    let month = numberPad(today.getMonth() + 1, 2);  // 월
    let date = numberPad(today.getDate(), 2);  // 날짜

    let res = JSON.parse(Jsoup.connect("http://bgb.hegelty.space/schoolmeal")
                              .data("school_name","경기북과학고")
                              .data("date",year+month+date)
                              .ignoreContentType(true).get().text());

    if(res.success == false) return "급식이 없습니다.";

    let meal = ["","",""];
    let meal_code = {"조식":0,"중식":1,"석식":2};
    let meal_name = ["조식","중식","석식"];
    for(i of res.data) {
      meal[meal_code[i.type]] = i.menu + "\n" + i.cal;
    }

    if(type!=-1) return tmd[tm+3] + "의 " + meal_name[type] + " 메뉴\n\n" + meal[type];
    return  tmd[tm+3] + "의 메뉴\n" + Lw
            + "조식\n" + meal[0] + "\n\n"
            + "중식\n" + meal[1] + "\n\n"
            + "석식\n" + meal[2]
  }catch(e) {
    return "에러!\n" + e;
  }
}

///////////////날씨///////////////
function showWeather(area, day) {
  let day=Number(day);
  let area = new String(area);
  let result = new String("");
  let date1 = new Date();
  let time = date1.getTime();

  let today = new Date(time+86400000*day); //날짜 맞추기
  let year = String(today.getFullYear()); // 년도
  let month = numberPad(today.getMonth() + 1, 2);  // 월
  let date = numberPad(today.getDate(), 2);  // 날짜

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

///////////////한강수온///////////////
function showHangangTemp(type) {
  try {
    let today = new Date();
    let hour = today.getHours();  // 시간
     
    let HangangData = JSON.parse(Jsoup.connect("http://openapi.seoul.go.kr:8088/5577427a6d736b783130377644627364/json/WPOSInformationTime/4/4/")
                      .ignoreContentType(true).get().text().split('[')[1].split(']')[0]);
    let hangang_temp = Number(HangangData.W_TEMP); //수온
    let hangang_site = HangangData.SITE_ID; //위치
    let hangang_time = HangangData.MSR_DATE; 

    let temp_C = String(hangang_temp) + "°C"; //섭씨
    let temp_K = String((hangang_temp + 273.15).toFixed(2))+ "K"; //절대온도
    let temp_F = String((hangang_temp * 1.8 + 32).toFixed(2))+ "°F";  //화씨
    let temp_R = String(((hangang_temp + 273.15)*1.8).toFixed(2))+ "°R";  //란씨
    if(type == '화씨') return("지금 한강의 수온은 " + temp_F + "(" + temp_R +") 입니다.\n("+hangang_time+hangang_site+"기준)\n\n자료 : 서울특별시");
    else return("지금 한강의 수온은 " + temp_C + "(" + temp_K +") 입니다.\n("+hangang_time+" "+hangang_site+"기준)\n\n자료 : 서울특별시");
  }catch(e){
    return("에러!\n" + e);
  }
}

///////////////코드업///////////////
function showCodeUPUserInfo(name) {
  try {
    let url = Jsoup.connect("https://codeup.kr/userinfo.php?user="+name).get();
    result = url.select("#lv > strong > span").text() + "\n"
           + url.select("body > main > div.container.mt-2 > blockquote > footer").text()
           + "\n전체순위 : " + url.select("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(1) > td.text-center").text()
           + "\n푼 문제 : " + url.select("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(2) > td.text-center > a").text();
    if((url.select("#lv > strong > span").text()).length<1) result = "그런 사용자는 없습니다.\n아이디를 확인하세요.";

  }catch(e){ return e;}
  return result;
}

///////////////백준///////////////
function showBOJUserInfo(handle, room) {
  let tier_table = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby", "Master"]
  let roman_num = ["I", "II", "III", "IV", "V"]
  let res = {}
  try {
      res = JSON.parse(Jsoup.connect("https://solved.ac/api/v3/user/show")
                  .data("handle", handle)
                  .ignoreContentType(true).get().text())


      let organizations = ""
      for (let i=0;i<res["organizations"].length;i++) {
          Log.d(res["organizations"][i]["name"])
          organizations += res["organizations"][i]["name"] + ((i==res["organizations"].length-1)?"":", ")
      }
      
      Kakao.sendLink(room, {
          template_id: 89209,
          template_args: {
              "handle": handle,
              "tier": tier_table[parseInt((res["tier"]-1)/5)]+" "+(res["tier"]==31?"":roman_num[(5-(res["tier"]-1)%5)-1]),
              "tier_image": "https://raw.githubusercontent.com/Iroom-gbs/BUKGWAKBOT/master/solvedac/"+String(res["tier"])+".png",
              "rating": res["rating"],
              "badge": res["badge"]["displayName"],
              "badge_image": res["badge"]["badgeImageUrl"],
              "exp": res["exp"],
              "solved": res["solvedCount"],
              "organizations": organizations
          }
      }, 'custom').then(e => {
          return 1
      }).catch(e => {
          Log.e(e);
          return {
              "handle": handle,
              "bio": res["bio"],
              "organizations": organizations,
              "badge": {
                  "name": res["badge"]["displayName"],
                  "url": ["displayName"]
              },
              "background": {
                  "name": res["background"]["displayName"],
                  "url": res["background"]["backgroundImageUrl"]
              },
              "profileImage": res["profileImageUrl"],
              "solved": res["solvedCount"],
              "voted": res["voteCount"],
              "exp": res["exp"],
              "rating": res["rating"],
              "tier": res["tier"],
              "tierName": tier_table[parseInt((res["tier"]-1)/5)]+" "+(res["tier"]==31?"":roman_num[(5-(res["tier"]-1)%5)-1]),
              "tierImage": "https://raw.githubusercontent.com/Iroom-gbs/BUKGWAKBOT/master/solvedac/"+String(res["tier"])+".png",
              "class": res["class"],
              "maxStreak": res["maxStreak"]
          }
      })
  } catch(e) {
      Log.e(e);
      return "핸들을 찾을 수 없습니다."
  }
}

///////////////도서검색///////////////
function searchBook(book_name) {
  try {
    let url = JSON.parse(Jsoup.connect("https://api.book.msub.kr/?book="+book_name+"&school=경기북과학고&local=경기").ignoreContentType(true).get().text());
    if(url.status!="normal") throw("검색 결과가 없습니다."); //실패시 throw
    result = "도서검색결과\n"
           + "검색된 책 : " + url.result.length + "권\n"
           + "----------\n";
    
    for(i=0;i<url.result.length;i++) { //목록출력
      let bookInfo = url.result[i];
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

///////////////폰 상태///////////////
function showPhoneStat() {
  return  "북곽봇상태\n"
        + "\n안드로이드버전 : " + Device.getAndroidVersionName()
        + "\n\n배터리 : " + Device.getBatteryLevel()
        + "%\n배터리 온도 : " + Device.getBatteryTemperature()/10
        + "°c\n충전여부 : "+Device.isCharging()
        + "\n전압상태 : " + Device.getBatteryVoltage();
}

///////////////음악검색///////////////
function searchMusic(title, room){
  try {
    var MusicData = JSON.parse(Jsoup.connect("https://api.music.msub.kr/?song=" + title).ignoreContentType(true).get().text());
    if(MusicData.song.length==0) return "검색 결과가 없습니다.";
    MusicData = MusicData.song[0];
    let MusicThumbnail = MusicData.albumimg;
    let MusicTitle = MusicData.name;
    let MusicAlbum = MusicData.album;
    let MusicLink = MusicData.melonlink;
    let MusicArtist = MusicData.artist;

    Kakao.sendLink(room,{
      "link_ver" : "4.0",
      "template_id" : 55964,
      "template_args" : {
        "title": MusicTitle,
        "image" : MusicThumbnail,
        "des" : MusicArtist + " [" + MusicAlbum + "]",
        "link" : MusicLink.replace("http://m.app.melon.com/","")
      }
      }, "custom");
    return 0;
    } catch(e) { return "에러" + e; }
}

///////////////가사///////////////
function showLyrics(title) {
  var MusicData = JSON.parse(Jsoup.connect("https://api.music.msub.kr/?song=" + title).ignoreContentType(true).get().text());
  if(MusicData.song.length==0) return "검색 결과가 없습니다."; //실패시 throw

  MusicData = MusicData.song[0];
  let MusicLyrics = MusicData.lyrics;
  let MusicTitle = MusicData.name;
  let MusicArtist = MusicData.artist;

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
      .ignoreContentType(true).ignoreHttpErrors(true)
      .post()
  const json = JSON.parse(parse.text());
  const result = json.result.output;
  return result;
  }catch(e){return "!번역 [언어] [내용]"}
}
const getLanguage = (a) => {
  const language = {
      '영어': 'en', '일본어': 'jp', '중국어': 'cn', '네덜란드어': 'nl',
      '독일어': 'de', '러시아어': 'ru', '말레이시아어': 'ms', '벵골어': 'bn',
      '베트남어': 'vi', '스페인어': 'es', '아랍어': 'ar', '이탈리아어': 'it',
      '인도네시아어': 'id', '태국어': 'th', '터키어': 'tr', '포르투갈어': 'pt',
      '프랑스어': 'fr', '힌디어': 'hi'
  };
  return language[a];
}

///////////////링크 단축///////////////
function makeShortenURL(url) {
  result = Jsoup.connect("http://di.do/index.php").data("u", url).post().select("input[name^=n]").attr("value");
  if(!result.split("do/")[1]=="EU") return "URL이 올바르지 않습니다.";
  return result;
}

///////////////핑퐁///////////////
function PingPong(str, room) {
  try{
    let result = JSON.parse(Jsoup.connect("http://121.168.91.34:8000/pingpong?query=" + str + "&sessionId=" + room).ignoreContentType(true).get().text())
    return result.text;
  }catch(e){ return e;}
}

///////////////시험까지 남은 시간///////////////
function showLeftTimeToExam()
{
  let examTime = new Date(2021,12-1,9,11,30,0);
  let nowTime = new Date();
  let timeGap = examTime-nowTime;
  if(timeGap<=0) return "모든 시험이 끝났습니다!";
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
function showStockInfo(name) {
  let url = "https://search.naver.com/search.naver?query=주식 " + name;
  let data = Jsoup.connect(url).get();
  let name = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.stk_nm").text();
  let code = data.select("#_cs_root > div.ar_spot > div > h3 > a > em").text();
  let price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > strong").text();
  if(!price) {
    price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.dw > strong").text();
    let price_change = "-"+data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.dw > span.n_ch > em:nth-child(3)").text();
    let change_percent = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.dw > span.n_ch > em:nth-child(4)").text();
  }
  else {
    price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > strong").text();
    let price_change = "+"+data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > span.n_ch > em:nth-child(3)").text();
    let change_percent = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.up > span.n_ch > em:nth-child(4)").text();
  } 
  if(!price) {
    price = data.select("#_cs_root > div.ar_spot > div > h3 > a > span.spt_con.eq > strong").text();
    let price_change = "보합";
    let change_percent = "";
  }

  return "[주식정보]\n" + name + "(" + code + ")\n현재 주가 : " + price + "\n주가 변동 : " + price_change + change_percent;
}

///////////////코인///////////////
function showCoinInfo(coin_name) {
  let names = {}, symbol_to_korean_name = {}, korean_name_to_symbol = {};
  let symbol = "";
  try {
      names = JSON.parse(Jsoup.connect("https://api.upbit.com/v1/market/all") //업비트 api
                              .ignoreContentType(true).get().text());
      for(let i in names) { //이름 수만큼 반복
          let korean_name = names[i].korean_name; //한글 이름
          symbol_to_korean_name[names[i].market.split('-')[1]] = korean_name; //키값이 심볼, 값이 한글 이름
          korean_name_to_symbol[korean_name] = names[i].market.split('-')[1]; //키값이 한글 이름, 값이 심볼
      }
  } catch(e) { //에러 발생시
      return "error(" + e.lineNumber + "): " + e; 
  }

  coin_name = coin_name.trim().toUpperCase(); //입력받은 코인 이름 전후 공백 제거 후 모두 대문자로 변경
  if(coin_name in korean_name_to_symbol) { //해당 이름이 한글 이름 목록에 있을 시
      symbol = korean_name_to_symbol[coin_name]; //심볼을 가져옴
  }
  else if(coin_name in symbol_to_korean_name) { //해당 이름이 심볼 목록에 있을 시
      symbol = coin_name; //입력받은 값을 심볼로 설정
      coin_name = symbol_to_korean_name[coin_name]; //한글 이름을 가져옴
  }
  else {
      return coin_name + "을 찾을 수 없습니다. 지원하는 코인 목록을 보려면 /코인 을 입력하세요."
  }
  price_data = JSON.parse(Jsoup.connect("https://api.upbit.com/v1/ticker?markets=KRW-" + symbol) //업비트 API에 원화-코인 시세 조회
                                  .ignoreContentType(true).get().text())[0]; //첫번째 항목 선택

  let trade_date_kst = price_data.trade_date_kst.toString(); //기준날짜
  let trade_time_kst = price_data.trade_time_kst.toString(); //기준시간
  let opening_price = price_data.opening_price; //당일시가
  let high_price = price_data.high_price; //당일고가
  let low_price = price_data.low_price; //당일저가
  let trade_price = price_data.trade_price; //현재시세
  let signed_change_price = price_data.signed_change_price; //변동시세
  let signed_change_rate = price_data.signed_change_rate; //변동률
  
  return"❗️ " + coin_name + "(" + symbol + ") 시세정보 ❗️\n"
          + "▪️ " + trade_date_kst.substr(0,4) + "-" + trade_date_kst.substr(4,2) + "-" + trade_date_kst.substr(6,2) + " " + trade_time_kst.substr(0,2) + ":" + trade_time_kst.substr(2,2) + " 기준 ◾️\n"
          + "✅️ 현재시세 : " + thousand_separator(trade_price) + "원\n"
          + "✅️ 변동시세 : " + thousand_separator(signed_change_price) + "원\n"
          + "✅️ 당일시가 : " + thousand_separator(opening_price) + "원\n"
          + "📈 당일고가 : " + thousand_separator(high_price) + "원\n"
          + "📉 당일저가 : " + thousand_separator(low_price) + "원\n"
          + "📊 변동률 : " + "(" + (signed_change_rate * 100).toFixed(2) + "%)";
}

///////////////기프티콘 낚시////////////////
function sendGiftcon(room, type){
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
    default : return "잘못된 기프티콘 종류입니다.\n지원하는 기프티콘 목록 : 3090, 3990X, 기프트카드10, 기프트카드5, 롤, 싸이버거, 아메리카노, 아이스크림케이크, 아이폰12, 아이폰미니, 에어팟, 조기졸업권, 처갓집, 컵밥, 페레레로쉐, 홍삼";
  }
  Kakao.sendLink(room,{
      link_ver : "4.0",
      template_id : 53767,
      template_args : {
      title : "선물과 메시지가 도착하였습니다.",
      des : "",
      image : image
      }
    }, "custom").then(e => {}).catch(e => {
        Log.e(e);
  });
    return 0;
}

///////////////APOD///////////////
function showAPOD(date_string, room){
  if(date_string) date_string = "&date=" + date_string;
  let apod = JSON.parse(Jsoup.connect("https://api.nasa.gov/planetary/apod?api_key=Q1oKwpJnCk4iCcqI8hte4c145eJNpEdvdJNf6sEs"+(date_string?date_string:"")).ignoreContentType(true).get().text());
  Log.d(apod.date + apod.url + apod.hdurl + apod.title)
  if(apod.media_type!="image") return apod.url;
  
  Kakao.sendLink(room,{
    "link_ver" : "4.0",
    "template_id" : 69481,
    "template_args" : {
      "date": apod.date,
      "image" : apod.url,
      "url" : apod.hdurl,
      "title" : apod.title
      }
    }, "custom").then(e => {}).catch(e => {
      Log.e(e);
  });;
  return 0;
}

///////////////현재 TV////////////////
//[출처] TV 지상파 방송 편성표 파싱 (카카오톡 봇 커뮤니티) | 작성자 에케
function showTVList() {
  let data = Jsoup.connect("https://m.search.naver.com/search.naver?query=%ED%8E%B8%EC%84%B1%ED%91%9C").get().select("li.program_item.on");
  let k1 = data.get(0).select(".pr_name").text();
  let k2 = data.get(1).select(".pr_name").text();
  let m = data.get(2).select(".pr_name").text();
  let s = data.get(3).select(".pr_name").text();
  let e1 = data.get(4).select(".pr_name").text();
  let e2 = data.get(5).select(".pr_name").text();
  return("현재 방송중인 프로그램입니다.\nKBS1 " + k1 + "\nKBS2 " + k2 + "\nMBC " + m + "\nSBS " + s + "\nEBS1 " + e1 + "\nEBS2 " + e2 + "\n@sh4cker");
}

///////////////위키////////////////
function searchWiki(w) {
  try {
    w = w.trim();
    if(!w) return("gbs.wiki")
    try {
      url = Jsoup.connect("https://gbs.wiki/api/raw/"+encodeURI(w)).ignoreContentType(true).userAgent("BUKGWAKBOT").get();
    } catch (e) {
      url = Jsoup.connect("https://gbs.wiki/search/"+encodeURI(w)).ignoreContentType(true).userAgent("BUKGWAKBOT").get();
      w = url.select("#main_data > ul:nth-child(3) > li:nth-child(1) > a").text();
      url = Jsoup.connect("https://gbs.wiki/api/raw/"+encodeURI(w)).ignoreContentType(true).userAgent("BUKGWAKBOT").get();
    }
    outline = JSON.parse(url.text()).data;
    if(outline.indexOf("#redirect")!=-1){
      w = outline.split("#redirect")[1].trim();
      url = Jsoup.connect("https://gbs.wiki/api/raw/"+encodeURI(w)).ignoreContentType(true).userAgent("BUKGWAKBOT").get();
      outline = JSON.parse(url.text()).data;
    }
    else if(outline.indexOf("#넘겨주기")!=-1) {
      w = outline.split("#넘겨주기")[1].trim();
      url = Jsoup.connect("https://gbs.wiki/api/raw/"+encodeURI(w)).ignoreContentType(true).userAgent("BUKGWAKBOT").get();
      outline = JSON.parse(url.text()).data;
    }
    var result = w + "에 대한 GBSWiki 검색 결과\n"
              + "https://gbs.wiki/w/"+w + "\n"
              + Lw + "\n"
              + outline.substr(0,outline.length>1000?1000:outline.length-1) + "\n\n 자세한 내용은 위 링크로 이동해주세요.";
    return result;
  } catch(e) {
    Log.d("위키 오류" + e);
    return "해당 문서가 존재하지 않거나, 볼 수 없습니다. 학생/교사 개인 문서는 로그인해야만 볼 수 있습니다."
  };
}


//[출처] 게이지 함수 (카카오톡 봇 커뮤니티) | 작성자 뀨야
function creadtBar(num, max, p, n){
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

function numberComma(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dateNumToString(n) {
  return n.substr(0,4)+"년 "+n.substr(4,2)+"월 "+n.substr(6,2)+"일";
}

function thousand_separator(num) { //1000 단위로 콤마 찍기
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}