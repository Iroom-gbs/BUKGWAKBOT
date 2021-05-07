importClass(org.jsoup.Jsoup);
const comci = require('comci.js');
const scriptName = "module";
const FS = FileStream;

//급식에 필요한 변수들
var MealDataDate = new Array("-1","-1");
var mealdata = new Array(new Array("\n","\n","\n"), new Array("\n","\n","\n"));

//한강수온에 필요한 변수들
var hangang_temp, hangang_time, HangangDataDate;

///////////////시간표///////////////
function Timetable_Function(tm) //tm : 오늘(false)/내일(true)
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

///////////////급식///////////////
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

    if(tm==true) //내일급식
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
    if(day==0||day==6) //주말
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

    var meal_Link = "https://open.neis.go.kr/hub/mealServiceDietInfo"
                  + "ATPT_OFCDC_SC_CODE=" + ATPT_OFCDC_SC_CODE 
                  + "&SD_SCHUL_CODE=" + SD_SCHUL_CODE 
                  + "&MLSV_YMD=" + year + month + date 
                  + "&KEY=" + KEY + "&TYPE=%E3%85%93%EB%82%B4%E3%85%9C";
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

///////////////날씨///////////////
function Weather_Function(area, day)
{
  day=Number(day);
  area = new String(area);
  var result = new String("");
  let date1 = new Date();
  var time = date1.getTime()

  let today = new Date(time+86400000*day); //날짜 맞추기
  var year = String(today.getFullYear()); // 년도
  var month = numberPad(today.getMonth() + 1, 2);  // 월
  var date = numberPad(today.getDate(), 2);  // 날짜

  if(area=="") area = "녹양동"; //기본장소
  try{
    result = "-" +year+"년"+month+"월"+date+"일 날씨정보 -\n\n";
    var url = Jsoup.connect("https://search.naver.com/search.naver?query="+area + "날씨 " + month+"월 "+date+"일").ignoreContentType(true).get();
    if(day==0){ //오늘
      try
      {
        let path = "#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.today_area._mainTabContent > "
        result += url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.sort_box._areaSelectLayer > div > div > span > em").text()
                  + "\n\n" + url.select(path + "div.main_info > div > ul > li:nth-child(1) > p").text()
                  + "\n ■현재온도" + url.select(path + "div.main_info > div > p > span.todaytemp").text() + "°C"
                  + "\n ■최저 " + url.select(path + "div.main_info > div > ul > li:nth-child(2) > span.merge > span.min > span").text()
                  + "°C 최고"
                  + url.select(path + "div.main_info > div > ul > li:nth-child(2) > span.merge > span.max > span").text() + "°C"
                  + "\n ■체감온도 " + url.select(path + "div.main_info > div > ul > li:nth-child(2) > span.sensible > em > span").text() + "°C"
                  + "\n ■미세먼지 " + url.select(path + "div.sub_info > div > dl > dd:nth-child(2) > span.num").text()
                  + "\n ■초미세먼지 " + url.select(path + "div.sub_info > div > dl > dd:nth-child(4) > span.num").text()
                  + "\n\n자료 : 네이버"
        if((url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_title_area > h2").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      } catch (e) {Log.error(e);return "정보 불러오기 오류";}
    }

    else if(day==1){ //내일
      try
      {
        let path = "#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > ";
        result += url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.sort_box._areaSelectLayer > div > div > span > em").text()
                + "\n\n◈오전\n  "+ url.select(path+"div:nth-child(4) > div:nth-child(2) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select(path+"div:nth-child(4) > div:nth-child(2) > p > span.todaytemp").text()+ "°C"
                + "\n\n◈오후  " + url.select(path+"div:nth-child(4) > div:nth-child(3) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select(path+"div:nth-child(4) > div:nth-child(3) > p > span.todaytemp").text()+ "°C"
                + "\n\n자료 : 네이버";  
        if((url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_title_area > h2").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      }catch(e){Log.error(e); return "정보 불러오기 오류";}
    }

    else{ //모레
      try
      {
        let path = "#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.tomorrow_area.day_after._mainTabContent > "
        result += url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_cs_wrap > div.weather_box > div.weather_area._mainArea > div.sort_box._areaSelectLayer > div > div > span > em").text()
                + "\n\n◈오전\n  "+ url.select(path+"div:nth-child(2) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select(path+"div:nth-child(2) > p > span.todaytemp").text()+ "°C"
                + "\n\n◈오후  " + url.select(path+"div:nth-child(3) > div > ul > li:nth-child(1) > p").text()
                + "\n  ■기온 " + url.select(path+"div:nth-child(3) > p > span.todaytemp").text()+ "°C"
                + "\n\n자료 : 네이버";  
        if((url.select("#main_pack > section.sc_new.cs_weather._weather > div > div.api_title_area > h2").text()).length<1) return "지역을 찾을 수 없습니다.";
        return result;
      }catch(e){Log.error(e);return "정보 불러오기 오류";}
    }
  }catch(e){
    return "에러!\n" + e;
  }
}

///////////////코로나///////////////
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
            + "(" + url.select("#content > div > div.caseTable > div:nth-child(4) > ul > li:nth-child(2) > dl > dd > span").text() + ")"
            + "\n\n자료 : 보건복지부";  
    return result;
  }catch(e){return e;}
}

///////////////한강수온///////////////
function Hangang_Function(type)
{
  try{
    let today = new Date();
    let hour = today.getHours();  // 시간
    if(HangangDataDate + 3 <= hour || hour<HangangDataDate); //데이터가 최신이 아닐 경우 갱신
    {
      let HangangData = JSON.parse(Jsoup.connect("http://openapi.seoul.go.kr:8088/5577427a6d736b783130377644627364/json/WPOSInformationTime/4/4/").ignoreContentType(true).get().text().split('[')[1].split(']')[0]);
      hangang_temp = Number(HangangData.W_TEMP); //수온
      hangang_site = HangangData.SITE_ID; //위치
      HangangDataDate = hour; //갱신시간 설정
      hangang_time = HangangData.MSR_DATE; 
    }

    let temp_C = String(hangang_temp) + "°C"; //섭씨
    let temp_K = String((hangang_temp + 273.15).toFixed(2))+ "K"; //절대온도
    let temp_F = String((hangang_temp * 1.8 + 32).toFixed(2))+ "°F";  //화씨
    let temp_R = String(((hangang_temp + 273.15)*1.8).toFixed(2))+ "°R";  //란씨
    if(type == '화씨') return("지금 한강의 수온은 " + temp_F + "(" + temp_R +") 입니다.\n("+hangang_time+hangang_site+"기준)\n\n당신은 소중한 사람입니다.\n자살예방상담전화 1393\n청소년전화 1388");
    else return("지금 한강의 수온은 " + temp_C + "(" + temp_K +") 입니다.\n("+hangang_time+" "+hangang_site+"기준)\n\n당신은 소중한 사람입니다.\n자살예방상담전화 1393\n청소년전화 1388");
  }catch(e){
    return("에러!\n" + e);
  }
}

///////////////코드업///////////////
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

///////////////도서검색///////////////
function Library_Search(book_name)
{
  var result = "";
  try{
    var url = JSON.parse(Jsoup.connect("https://saroro.develope.dev/book.php")
              .data("school","경기북과학고등학교")
              .data("book",book_name)
              .get().text());
Log.debug(url.result);
    if(url.result!="성공") throw(url.reason); //실패시 throw
    if(url.content.경기.bookCount==0) throw("검색 결과가 없습니다."); //검색결과 0개일때
    result += "도서검색결과\n"
            + "검색된 책 : " + url.content.경기.bookCount + "권\n"
            + "----------\n";
    
    for(i=0;i<url.content.경기.bookCount;i++) //목록출력
    {
      bookInfo = url.content.경기.bookList[i];
      result += (i+1) + ". " + bookInfo.bookName + "\n"
              + "  ◈저자 : " + bookInfo.writer.replace(";","\n") + "\n"
              + "  ◈출판사 : " + bookInfo.pub + "\n"
              + "  ◈청구기호 : " + bookInfo.code + "\n"
              + "  ◈상태 : " + bookInfo.state;
      if(i==0) result += "\n더보기를 눌러주세요" + "\u200b".repeat(500); //2번째부터는 더보기로
      result += "\n\n";
    }

    return result;
  }catch(e){return e;}
}

///////////////폰 상태///////////////
function PhoneData_Function()
{
  var device_profile_name = android.provider.Settings.Global.getString(Api.getContext().getContentResolver(), "device_name");
  return  "북곽봇상태\n\n휴대폰 이름 : " + device_profile_name
        + "\n안드로이드버전 : " + Device.getAndroidVersionName()
        + "\n\n배터리 : " + Device.getBatteryLevel()
        + "%\n온도 : " + Device.getBatteryTemperature()/10
        + "°c\n충전여부 : "+Device.isCharging()
        + "\n전압상태 : " + Device.getBatteryVoltage();
}

///////////////유효숫자///////////////
function Significant_figures(n)
{
  try{
    for(i=0;i<n.length;i++){ //숫자나 .이 아닌 문자가 있을 때
      if(n[i]!='.'&&(n[i]<'0'||n[i]>'9')) throw("Wrong Number");
    }
    n=n.split(".");
    var z_cnt=0,cnt=0,p;

    if(n.length>2) throw("Wrong Number"); //소숫점이 여러개 있을 때
    if(n[0].length==0) throw("Wrong Number"); //소숫점 앞에 아무것도 없을 때

    for(i=0;i<n[0].length;i++){ //정수부
      if('1'<=n[0][n[0].length-1-i] && n[0][n[0].length-1-i]<='9'){
        z_cnt+=i; //0이 아닌 숫자가 나오기 전까지 0 갯수
        cnt+=n[0].length-i; //일반 숫자 갯수
        break;
      }
    }
    if(n.length==2){ //소수부
      cnt+=z_cnt;
      cnt+=n[1].length;
      p=-n[1].length;
    }
    else p=z_cnt;
    return "유효숫자 : " + cnt + "개(10^"+p+" 자리)";
  }catch(e){
    if(e=="Wrong Number") return "숫자가 올바르지 않습니다.";
    else return e;
  }
}

///////////////산화수///////////////
function Oxidation_Number(s)
{
  var Oneja = {'H':0,'He':0,'Li':0,'Be':0,'B':0,'C':0,'N':0,'O':0,'F':0,'Ne':0,'Na':0,'Mg':0,'Al':0,'Si':0,'P':0,'S':0,'Cl':0,'Ar':0,'K':0,'Ca':0,'Sc':0,'Ti':0,'V':0,'Cr':0,'Mn':0,'Fe':0,'Co':0,'Ni':0,'Cu':0,'Zn':0,'Ga':0,'Ge':0,'As':0,'Se':0,'Br':0,'Kr':0,'Rb':0,'Sr':0,'Y':0,'Zr':0,'Nb':0,'Mo':0,'Tc':0,'Ru':0,'Rh':0,'Pd':0,'Ag':0,'Cd':0,'In':0,'Sn':0,'Sb':0,'Te':0,'I':0,'Xe':0,'Cs':0,'Ba':0,'La':0,'Ce':0,'Pr':0,'Nd':0,'Pm':0,'Sm':0,'Eu':0,'Gd':0,'Tb':0,'Dy':0,'Ho':0,'Er':0,'Tm':0,'Yb':0,'Lu':0,'Hf':0,'Ta':0,'W':0,'Re':0,'Os':0,'Ir':0,'Pt':0,'Au':0,'Hg':0,'Tl':0,'Pb':0,'Bi':0,'Po':0,'At':0,'Rn':0,'Fr':0,'Ra':0,'Ac':0,'Th':0,'Pa':0,'U':0,'Np':0,'Pu':0,'Am':0,'Cm':0,'Bk':0,'Cf':0,'Es':0,'Fm':0,'Md':0,'No':0,'Lr':0,'Rf':0,'Db':0,'Sg':0,'Bh':0,'Hs':0,'Mt':0};
  var Result = {'H':0,'He':0,'Li':0,'Be':0,'B':0,'C':0,'N':0,'O':0,'F':0,'Ne':0,'Na':0,'Mg':0,'Al':0,'Si':0,'P':0,'S':0,'Cl':0,'Ar':0,'K':0,'Ca':0,'Sc':0,'Ti':0,'V':0,'Cr':0,'Mn':0,'Fe':0,'Co':0,'Ni':0,'Cu':0,'Zn':0,'Ga':0,'Ge':0,'As':0,'Se':0,'Br':0,'Kr':0,'Rb':0,'Sr':0,'Y':0,'Zr':0,'Nb':0,'Mo':0,'Tc':0,'Ru':0,'Rh':0,'Pd':0,'Ag':0,'Cd':0,'In':0,'Sn':0,'Sb':0,'Te':0,'I':0,'Xe':0,'Cs':0,'Ba':0,'La':0,'Ce':0,'Pr':0,'Nd':0,'Pm':0,'Sm':0,'Eu':0,'Gd':0,'Tb':0,'Dy':0,'Ho':0,'Er':0,'Tm':0,'Yb':0,'Lu':0,'Hf':0,'Ta':0,'W':0,'Re':0,'Os':0,'Ir':0,'Pt':0,'Au':0,'Hg':0,'Tl':0,'Pb':0,'Bi':0,'Po':0,'At':0,'Rn':0,'Fr':0,'Ra':0,'Ac':0,'Th':0,'Pa':0,'U':0,'Np':0,'Pu':0,'Am':0,'Cm':0,'Bk':0,'Cf':0,'Es':0,'Fm':0,'Md':0,'No':0,'Lr':0,'Rf':0,'Db':0,'Sg':0,'Bh':0,'Hs':0,'Mt':0};

  var ion=0, e_cnt=0;
  //원자 갯수 기록
  for(var cnt=0;s[cnt];cnt++)
  {
    var amount=0;
    try{
      Log.debug(s[cnt])
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
      if(e=="Wrong Element") return "잘못된 화학식입니다."
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