importClass(org.jsoup.Jsoup);
const scriptName = "autoselfcheck";

let selfcheck_route = "/sdcard/BUKGWAKBOT/selfcheck.json";
const FS = FileStream;

var result = "";

function Autoselfcheck_Function() {
  result="";
  selfcheckList = JSON.parse(FS.read(selfcheck_route));
  for(i=0;i<selfcheckList.인원;i++) {
      let name = (selfcheckList.데이터)[i].이름;
      let birth = (selfcheckList.데이터)[i].생일;
      let pass = (selfcheckList.데이터)[i].비밀번호;
      let number = (selfcheckList.데이터)[i].번호;
      status = Jsoup.connect("https://api.self-check.msub.kr/?local=경기&sctype=고등학교&scname=경기북과학고등학교&name="
                              + name
                              + "&birth=" + birth
                              + "&pass=" + pass
                              ).ignoreContentType(true).get().text();
      if(status.split(":")[1].split(",")[0]=="0") {
          result += number + name + " 성공\n";
      }
      else {
          result += number + name + " " + status.split('"')[6].split('"')[0] + "\n";
      }
  }
  return result;
}

//확인
function Check_SelfCheck() {
    url = JSON.parse(Jsoup.connect("http://193.123.246.37/api/isSurvey")
                    .data("org","J100005167")
                    .data("grade",1)
                    .data("class",2)
                    .data("json",true)
                    .ignoreContentType(true).get().text());
    result  = "경기북과학고(" + url.orgCode + ")\n"
            + url.grade + "학년 " + url.class + "반\n\n"
            + "미참여자 : " + url.detail.nonpart + "\n"
            + "참여자 : " + url.detail.normal + "\n"
            + "유증상자 : " + url.detail.symptom +"\n\n"
            + "\u200b".repeat(500) + "미참여자 목록";
    
    for(i=0;i<(url.surveyList).length;i++) {
        if(url.surveyList[i].isSurvey=="N")
            result += "\n" + url.surveyList[i].attNumber + "번";
    }
    return result;
}