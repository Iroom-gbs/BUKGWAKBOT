/**
 * 북곽봇
 * 제작자 : hegelty(https://github.com/hegelty)
 * 경기북과학고 채팅방들을 위해 만들어진 카톡봇입니다.
 * 현재 버전 2
 * Copyright (c) 2021 hegelty
 * MIT License
 */

importClass(org.jsoup.Jsoup);
const scriptName = "test";
const FS = FileStream;

let DiTalks_Rooms = JSON.parse(FS.read("/sdcard/BUKGWAKBOT/DiTalks_Rooms.json"))

const M = Bridge.getScopeOf("module");
const G = Bridge.getScopeOf("gamemodule");

const Lw = "\u200b".repeat(500);
 
function command(room, msg, sender, isGroupChat, replier, msg_data) {
  let today = new Date();
  switch(msg_data[0]){
    case "업데이트": return(
                            "업데이트 노트 - 2.0.0\n"
                            +"----------\n"+ "\u200b".repeat(500)
                            +"추가\n"
                            +"개선\n"
                            )
    //도움말
    case "도움말":
    case "명령어": return(
                      "도움말\n"
                    + "\u200b".repeat(500)
                    + "() : 선택  [] : 필수\n1:1 채팅으로 대화할 시 '!'와 '북곽아'없이 사용할 수 있습니다.\n"
                    + "북곽아 [] : 북곽이랑 대화합니다.\n\n"
                    
                    + "!반설정 [학년] [반]: 현재 채팅방의 반을 설정할수 있습니다. 방을 설정하면 급식/시간표를 편하게 볼 수 있습니다.\n"
                    + "!알림: 다음교시 알림, 급식 알림을 설정합니다.\n"
                    
                    + "!급식 (내일/모레/글피 등) (아침/점심/저녁) : 급식을 보여줍니다.\n"
                    + "!시간표 (내일/모레/글피 등) (학년 반): 시간표를 보여줍니다.\n"
                    + "!책 (제목) : 도서관에서 책을 검색합니다.\n"
                    + "!교과서 : 교과서 드라이브 주소를 알려줍니다.\n\n"
                    
                    + "!코드업 [id]: 코드업 유저 정보를 알려줍니다.\n"
                    + "!boj [handle]: 백준 유저 정보를 알려줍니다.\n\n"

                    + "!정보 : 북곽봇 정보를 알려줍니다.\n"
                    + "!상태 : 북곽봇 휴대폰 상태를 알려줍니다.\n\n"
                    
                    + "!위키 (내용) : GBSWiki에서 내용을 검색합니다.\n"
                    + "!한강수온 (화씨) : 오늘 한강의 온도를 알려줍니다.\n"
                    + "!날씨 (위치) : 날씨를 알려줍니다.\n"
                    + "!번역 [언어] [내용] : 해당 언어로 내용을 번역합니다.\n\t지원 언어 : 영어/일본어/중국어/네덜란드어/독일어/러시아어/말레이시아어/벵골어/베트남어/스페인어/아랍어/이탈리아어/인도네시아어/태국어/터키어/포르투갈어/프랑스어/힌디어\n"
                    + "!APOD [년-월-일(ex. 2005-03-05)] : 오늘의 APOD를 보여줍니다.\n"
                    + "!단축 [url] : url을 단축해줍니다.\n\n"

                    + "!남은시간 : 다음 시험(중간/기말고사)까지 남은 시간을 알려줍니다.\n"
                    + "!기프티콘 (종류) : 가짜 기프티콘을 보냅니다.\n\t종류 : 3090, 3990X, 기프트카드10, 기프트카드5, 롤, 싸이버거, 아메리카노, 아이스크림케이크, 아이폰12, 아이폰미니, 에어팟, 조기졸업권, 처갓집, 컵밥, 페레레로쉐, 홍삼\n"
                    + "!랜덤숫자 [시작숫자] [끝숫자] : 시작숫자에서 끝 숫자 사이 랜덤 숫자가 나옵니다.\n"
                    + "!랜덤목록 [개수] : 1에서 개수까지의 수를 랜덤순서로 출력합니다.\n"
                    + "!주사위 : 주사위를 굴립니다.\n"
                    + "!긴단어 [글자] : 글자로 시작하는 긴 단어(끄투, 어인정 포함)를 알려줍니다.\n"
                    + "!롤 [소환사명] : OP.GG에서 소환서의 전적을 검색합니다.(미완)\n"
                    + "!롤 갱신 [소환사명] : OP.GG에서 소환사의 전적을 갱신합니다.\n\n"

                    + "!노래 [제목] : 노래를 검색합니다.\n"
                    + "!가사 [제목] : 노래의 가사를 보여줍니다.\n"
                    + "!TV : 현재 방영중인 TV 프로그램 목록을 보여줍니다.\n"
                    + "!주식 [종목] : 주식 정보를 보여줍니다.\n"
                    + "!코인 [이름/심볼] : 코인 정보를 보여줍니다.\n"
                    );
    
    //정보
    case "정보": return("북곽봇\n"
                                + "개발자 : hegelty(3501)\n"
                                + "버전 : 2.0.0\n"
                                + "소스 : https://github.com/hegelty/BUKGWAKBOT\n"
                                + "\u200b".repeat(500)
                                + "라이선스\n\n--------------------\n"
                                + " ▣ 번역 ▣\n\thttps://cafe.naver.com/nameyee/32587\n"
                                + '\tMIT License\nCopyright (c) 2021 조유리즈\n\n'
                                + " ▣ OP.GG 갱신 ▣\n\thttps://cafe.naver.com/nameyee/27089\n"
                                + '\tMIT License\nCopyright (c) 2021 민초단\n\n'
                                + " ▣ 초성 구하기 ▣\n\thttps://cafe.naver.com/nameyee/32601\n"
                                + '\tMIT License\nCopyright (c) 2021 임지혁\n\n'
                                + " ▣ CryptoJS v3.1.2 ▣\n\tcode.google.com/p/crypto-js\n\t(c) 2009-2013 by Jeff Mott. All rights reserved.\n\tcode.google.com/p/crypto-js/wiki/License\n"
                                + "\t▣ 핑퐁툴 ▣\n\thttps://github.com/minibox24/PingPongTool\n" 

                                + '--------------------\n'
                                + ' ● MIT License\n\thttps://opensource.org/licenses/MIT\n'
                                );

    //상태
    case "상태": return(M.showPhoneStat()); 
    case "반설정":
      return(M.setClass(msg_data[1],msg_data[2],room));
      
    //자가진단
    case "자가진단":
      if(sender=="나태양") return(AS.Autoselfcheck_Function());
    
    //급식
    case "급식":
      tm=0,type=-1,reset=false;
      switch(msg_data[1]){
        case "내일": tm=1; break;
        case "모레": tm=2; break;
        case "글피": tm=3; break;
        case "그글피": tm=4; break;
        case "어제": tm=-1; break;
        case "그저께":case "그제": tm=-2; break;
        case "그끄저께":case "그끄제": tm=-3; break;
      }
  
      if(msg_data[msg_data.length-1]=="아침") type=0;
      else if(msg_data[msg_data.length-1]=="점심") type=1;
      else if(msg_data[msg_data.length-1]=="저녁") type=2;
  
      if(msg_data[1]=="리로드") reset=true;
  
      return(M.showMeal(tm,type,reset));
    
    //시간표
    case "시간표":
      tm=0, period=0;
      switch(msg_data[1]){
        case "내일": tm=1; break;
        case "모레": tm=2; break;
        case "글피": tm=3; break;
        case "그글피": tm=4; break;
      }
      return(M.showTimetable(msg_data,tm,room));

    //도서검색
    case "책": return(M.searchBook(msg.substr(2)));
    case "교과서": return("http://di.do/dScIy");
    
    case "남은시간": return("시험 끝까지 남은 시간 \n"+M.showLeftTimeToExam());

    //코드업 정보
    case "코드업":
      if(msg_data.length<2) return("찾으려는 아이디를 입력하세요.\n(!코드업 [아이디])");
      else return(M.showCodeUPUserInfo(msg_data[1]));

    case "boj":
      if(msg_data.length<2) return("찾으려는 핸들을 입력하세요.\n(!boj [아이디])");
      M.showBOJUserInfo(msg_data[1]);
      break;

    //날씨
    case "날씨" : 
      if(msg_data.length<2||msg_data[1]=="내일"||msg_data[1]=="모레") area = "";
      else area = msg_data[1];
  
      if(msg_data[1]=="내일"||msg_data[2]=="내일") day=1;
      else if(msg_data[1]=="모레"||msg_data[2]=="모레") day=2;
      else day=0;
      return(M.showWeather(area,day)); 
    
    //위키
    case "위키": return(M.searchWiki(msg.substr(3)));
    //한강 수온
    case "한강수온": return(M.showHangangTemp(msg_data[1]));

    //노래검색
    case "노래":
      result = M.searchMusic(msg.replace(msg_data[0],""),room);
      if(result!=0) return result;
      break;

    //가사
    case "가사": return(M.showLyrics(msg.replace(msg_data[0],"")));

    //현재 TV
    case "TV": return(M.showTVList());
    //주식
    case "주식": return(M.showStockInfo(msg_data[1]));
    //코인
    case "코인": return(M.showCoinInfo(msg_data[1]));

    //번역
    case "번역": return(M.getTranslate(msg_data[1],msg.replace(msg_data[0],"").replace(msg_data[1],"")));
    //URL 단축
    case "단축": return(M.makeShortenURL(msg.replace("!단축 ","")));

    //랜덤숫자 뽑기
    case "랜덤숫자": return(G.RandNum(msg_data[1],msg_data[2]));
    //랜덤목록 뽑기
    case "랜덤목록": return(G.RandList(msg_data[1]));
    //가위바위보
    case "가위바위보": return(G.RSP(msg_data[1]));

    //기프티콘 낚시
    case "기프티콘":
      result = M.sendGiftcon(room, msg_data[1]);
      if(result!=0) return result;
      break;

    case "apod":
    case "Apod":
    case "APOD":
      result = M.showAPOD(msg_data[1], room);
      if(result) replier.reply(result);
      return true;
    
    //롤 전적검색, 갱신
    case "롤" :
      if(msg_data[1]=="갱신"){ return(G.opggupdate(msg.replace("!롤 갱신 ","")));}
      result = G.LOLHistory(msg.replace("!롤 ",""),room); 
      if(result!="성공") return result;

    //끄투 긴단어검색
    case "긴단어": return(G.Kkutu_Long(msg_data[1][0]));
    //주사위
    case "주사위": return(G.Dice());
    //타이머 시작
    case "시작": return true;
    default: return false;
  }
  return true;
}

function sendToDiscord(sender, msg, url) {
  jsonbody = {
    "username": "[카톡]"+sender,
    "content": msg
  }
  Jsoup.connect(url)
    .header('Content-Type','application/json')
    .requestBody(JSON.stringify(jsonbody))
    .ignoreHttpErrors(true)
    .ignoreContentType(true)
    .post()
}

function sendToKakaoTalk(room, server_name, channel_name, msg, sender) {
  Log.debug(sender + "\n" + msg + "\n" + room);
  Api.replyRoom(room, sender+" : "+msg, "com.kakao.talk");
}

function DiTalks(room, msg, sender, packageName)
{
  if(packageName == "com.kakao.talk") {
    for(i=0;i<DiTalks_Rooms.Rooms.length;i++) {
      if(room==DiTalks_Rooms.Rooms[i].KakaoTalk) sendToDiscord(sender, msg, DiTalks_Rooms.Rooms[i].Webhook);
    }
  }
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room[0]==".") return;
  try {
    msg_data = msg.split(' ');
    DiTalks(room, msg, sender, packageName);
    if(isGroupChat) {
      if(msg_data[0]=="북곽아") {
        if(msg.substr(3))
        {
          pingpong_output = M.PingPong(msg.substr(3));
          replier.reply(pingpong_output);
          DiTalks(room,pingpong_output,"북곽봇","com.kakao.talk");
        }
        else replier.reply("네?");
      }

      if(msg[0]=="!"){
        msg_data[0] = msg_data[0].substr(1);
        command_output = command(room, msg, sender, isGroupChat, replier, msg_data);
        if(!command_output) {
          //replier.reply("알수없는 명령어입니다.");
          //DiTalks(room,"알수없는 명령어입니다.","북곽봇","com.kakao.talk");
        }
        else {
          if(command_output===true);
          else{
          replier.reply(command_output);
          DiTalks(room,command_output,"북곽봇","com.kakao.talk");
        }}
      }
    }
    else {
      let result;
      if(msg[0]=="!") {
        msg_data[0] = msg_data[0].substr(1);
      }
      result = command(room, msg, sender, isGroupChat, replier, msg_data);
      if(result==false) {
        replier.reply(M.PingPong(msg));
      }
      else replier.reply(result);
    }
  }
  catch(e){
    if(packageName=="com.kakao.talk");
    Log.e(e);
  }
}