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
      status = Jsoup.connect("http://121.168.91.34:8000/hcs?name="
                              + name
                              + "&birth=" + birth
                              + "&local=%EA%B2%BD%EA%B8%B0&school=%EA%B2%BD%EA%B8%B0%EB%B6%81%EA%B3%BC%ED%95%99%EA%B3%A0&type=%EA%B3%A0%EB%93%B1&"
                              + "&password=" + pass
                              ).ignoreContentType(true).get().text();
      if(JSON.parse(status).code == "SUCCESS") {
          result += number + name + " 성공\n";
      }
      else {
          result += number + name + " " + JSON.parse(status).code + "\n";
      }
  }
  return result;
}