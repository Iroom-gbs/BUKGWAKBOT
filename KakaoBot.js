/**
 * 북곽봇
 * 제작자 : HegelTY
 * 북곽 1학년을 위해 만들어진 카톡봇입니다.
 * 현재 버전 1.1.0
 * Copyright (c) 2021 IROOM
 * MIT License
 */

 importClass(org.jsoup.Jsoup);
 const scriptName = "test";
 const FS = FileStream;
 let roomset_route = "/sdcard/BUKGWAKBOT/room.json";
 
 let DiTalks_Rooms = JSON.parse(FS.read("/sdcard/BUKGWAKBOT/DiTalks_Rooms.json"))
 
 const M = Bridge.getScopeOf("module");
 const AS = Bridge.getScopeOf("autoselfcheck");
 const G = Bridge.getScopeOf("gamemodule");
 const P = Bridge.getScopeOf("pingpong");
 const K = Bridge.getScopeOf("kakaolink");
 
 const Lw = "\u200b".repeat(500);
 
 function command(room, msg, sender, isGroupChat, replier, msg_data) {
   let today = new Date();
   switch(msg_data[0]){
     case "업데이트": return(
                                   "업데이트 노트 - 1.0.0\n"
                                   +"----------\n"+ "\u200b".repeat(500)
                                   +"추가\n"
                                   +"개선\n"
                                   );break;
     //도움말
     case "도움말":
     case "명령어": replier.reply(
                                 "도움말\n"
                               + "\u200b".repeat(500)
                               + "() : 선택  [] : 필수\n갠톡으로 대화할 시 '!'와 '북곽아'없이 사용할 수 있습니다.\n"
                               + "북곽아 [] : 북곽이랑 대화합니다.\n"
                               + "!채널 : 북곽봇 카카오톡 채널을 알려줍니다.\n\n"
                               
                               + "!급식 (내일) (아침/점심/저녁) : 급식을 보여줍니다.\n"
                               + "!시간표 (내일) : 시간표를 보여줍니다.\n"
                               + "!책 (제목) : 도서관에서 책을 검색합니다.\n"
                               + "!교과서 : 교과서 드라이브 주소를 아려줍니다.\n\n"
                               
                               + "!과제 : 과제 목록을 보여줍니다.\n"
                               + "!과제 추가 [과제 내용] : 과제를 등록합니다.\n"
                               + "!과제 삭제 [삭제할 과제 번화] : 과제를 삭제합니다.\n"
 
                               + "!정보 : 북곽봇 정보를 알려줍니다.\n"
                               + "!상태 : 북곽봇 휴대폰 상태를 알려줍니다.\n\n"
 
                               + "!한강수온 (화씨) : 오늘 한강의 온도를 알려줍니다.\n"
                               + "!날씨 (위치) : 날씨를 알려줍니다.\n"
                               + "!코로나 : 코로나 확진자 정보를 알려줍니다.\n"
                               + "!번역 [언어] [내용] : 해당 언어로 내용을 번역합니다.\n\t지원 언어 : 영어/일본어/중국어/네덜란드어/독일어/러시아어/말레이시아어/벵골어/베트남어/스페인어/아랍어/이탈리아어/인도네시아어/태국어/터키어/포르투갈어/프랑스어/힌디어\n"
                               + "!단축 [url] : url을 단축해줍니다.\n\n"
 
                               + "!남은시간 : 다음 시험(중간/기말고사)까지 남은 시간을 알려줍니다.\n"
                               + "!기프티콘 (종류) : 가짜 기프티콘을 보냅니다.\n\t종류 : 3090, 3990X, 기프트카드10, 기프트카드5, 롤, 싸이버거, 아메리카노, 아이스크림케이크, 아이폰12, 아이폰미니, 에어팟, 조기졸업권, 처갓집, 컵밥, 페레레로쉐, 홍삼\n"
                               + "!랜덤숫자 [시작숫자] [끝숫자] : 시작숫자에서 끝 숫자 사이 랜덤 숫자가 나옵니다.\n"
                               + "!랜덤목록 [개수] : 1에서 개수까지의 수를 랜덤순서로 출력합니다.\n"
                               + "!주사위 : 주사위를 굴립니다.\n"
                               + "!긴단어 [글자] : 글자로 시작하는 긴 단어(끄투, 어인정 포함)를 알려줍니다.\n"
                               + "!롤 [소환사명] : OP.GG에서 소환서의 전적을 검색합니다.(미완)\n"
                               + "!롤 갱신 [소환사명] : OP.GG에서 소환사의 전적을 갱신합니다.\n\n"
 
                               + "!노래검색 [제목] : 노래를 검색합니다.\n"
                               + "!가사 [제목] : 노래의 가사를 보여줍니다.\n"
                               + "!TV : 현재 방영중인 TV 프로그램 목록을 보여줍니다.\n"
                               + "!주식 [종목] : 주식 정보를 보여줍니다.\n\n"
                               );
       break;
     
     //채널
     case "채널": return("https://pf.kakao.com/_xdARxcs/chat");
     //정보
     case "정보": return("북곽봇\n"
                                 + "개발자 : hegelty(1203)\n"
                                 + "버전 : 1.1 dev\n"
                                 + "소스 : https://github.com/hegelty/BUKGWAKBOT\n"
                                 + "\u200b".repeat(500)
                                 + "라이선스\n\n--------------------\n"
                                 + " ▣ comcigan ▣\n\thttps://github.com/darkapplepower/comcigan\n"
                                 + '\tMIT License\nCopyright (c) 2020 darkapplepower\n\n'
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
       break;
 
     //상태
     case "상태": return(M.PhoneData_Function()); break;
 
     //단순응답
     case "반장": return("명물"); break;
     case "명물": return("반장"); break;
     case "짜릿짜릿해": return("1.\nsoundcloud.com/seob88861/mp3\n2.\nyoutu.be/oq0VGRQ9J-0"); break;
     case "태양만세": return("태양 만세!"); break;
 
     //자가진단
     case "자가진단":
       if(sender=="나태양")return(AS.Autoselfcheck_Function());
       break;
     
     //급식
     case "급식":
       var tm=0,type=0,reset=false;
       if(msg_data[1]=="내일") tm=1;
   
       if(msg_data[tm+1]=="아침") type=1;
       else if(msg_data[tm+1]=="점심") type=2;
       else if(msg_data[tm+1]=="저녁") type=3;
   
       if(msg_data[1]=="리로드") reset=true;
   
       return(M.Meal_Function(tm,type,reset));
       break;
     
     //시간표
     case "시간표":
       var tm=0, period=0;
       if(msg_data[1]=="내일") tm=1;
       return(M.Timetable_Function(tm));
       break;
 
     //도서검색
     case "책": return(M.Library_Search(msg.substr(2))); break;
     case "교과서": return("http://di.do/dScIy"); break;
     
     case "과제":
       if(msg_data[1]=="추가") {
         return(M.Homework_Add_Function(msg.substr(6),sender));
       }
       else if(msg_data[1]=="삭제") {
         return(M.Homework_Remove_Function(msg_data[2]));
       }
       else if(msg_data[1]=="수정") {
         return(M.Homework_Change_Function(msg_data[2],msg.substr(9)));
       }
       else return(M.Homework_Show_Function());
       break;
 
     //코로나 현황
     case "코로나": return(M.Corona_Function()); break;
 
     case "남은시간": return("시험 끝까지 남은 시간 \n"+M.LeftTimeToExam()); break;
 
     //코드업 정보
     case "코드업":
       if(msg_data.length<2) return("찾으려는 아이디를 입력하세요.\n(!코드업 [아이디])");
       else return(M.CodeUPRank_Function(msg_data[1]));
       break;
 
     //날씨
     case "날씨" : 
       if(msg_data.length<2||msg_data[1]=="내일"||msg_data[1]=="모레") area = "";
       else area = msg_data[1];
   
       if(msg_data[1]=="내일"||msg_data[2]=="내일") day=1;
       else if(msg_data[1]=="모레"||msg_data[2]=="모레") day=2;
       else day=0;
       return(M.Weather_Function(area,day)); 
 
       break;
     
     //한강 수온
     case "한강수온": return(M.Hangang_Function(msg_data[1])); break;
 
     //노래검색
     case "노래검색": M.MusicSearch(msg.replace(msg_data[0],""),room); break;
 
     //가사
     case "가사": return(M.Lyrics(msg.replace(msg_data[0],""))); break;
 
     //현재 TV
     case "TV": return(M.TV_Now()); break;
     //주식
     case "주식": return(M.Stock(msg_data[1])); break;
 
     //번역
     case "번역": return(M.getTranslate(msg_data[1],msg.replace(msg_data[0],"").replace(msg_data[1],""))); break;
     //단축
     case "단축": return(M.shorten(msg.replace("!단축 ",""))); break;
 
     //랜덤숫자 뽑기
     case "랜덤숫자": return(G.RandNum(msg_data[1],msg_data[2])); break;
     //랜덤목록 뽑기
     case "랜덤목록": return(G.RandList(msg_data[1])); break;
     //가위바위보
     case "가위바위보": return(G.RSP(msg_data[1])); break;
 
     //기프티콘 낚시
     case "기프티콘": M.Giftcon(room, msg_data[1]); break;
     
     //롤 전적검색, 갱신
     case "롤" :
       if(msg_data[1]=="갱신"){ return(G.opggupdate(msg.replace("!롤 갱신 ",""))); break;}
       return(G.LOLHistory(msg.replace("!롤 ",""),room)); break;
 
     //끄투 긴단어검색
     case "긴단어": return(G.Kkutu_Long(msg_data[1][0])); break;
     //주사위
     case "주사위": return(G.Dice()); break;
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
     if(sender=="방장봇") return;
     for(i=0;i<DiTalks_Rooms.Rooms.length;i++) {
       if(room==DiTalks_Rooms.Rooms[i].KakaoTalk) sendToDiscord(sender, msg, DiTalks_Rooms.Rooms[i].Webhook);
     }
   }
   else if(packageName == "com.discord") {
     server_name = room.split("#")[0].trim();
     channel_name = "#"+room.split("#")[1].split(":")[0];
     sender = (room.split(":")[1].substring(1).replace(" ","").trim());
     if(sender.startsWith("[카톡]")||msg=="에러") return;
     for(i=0;i<DiTalks_Rooms.Rooms.length;i++) {
       if(server_name==DiTalks_Rooms.Rooms[i].Discord) {
         for(j=0;j<DiTalks_Rooms.Rooms[i].Channel.length;j++)
         {
           if(channel_name==DiTalks_Rooms.Rooms[i].Channel[j]) break;
           if(j==DiTalks_Rooms.Rooms[i].Channel.length-1) return;
         }
         sendToKakaoTalk(DiTalks_Rooms.Rooms[i].KakaoTalk ,server_name, channel_name, msg, sender);
       }
     }
   }
 }
 
 function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
   if(room[0]==".") return;
   try {
     msg_data = msg.split(' ');
     DiTalks(room, msg, sender, packageName);
     if(isGroupChat) {
       if(room=="GBS17 정보문제 질문방") return;
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
     //기기 옮기기 전까지 막아두기
     /*
     else {
       if(msg[0]=="!") msg_data[0] = msg_data[0].substr(1);
       if(command(room, msg, sender, isGroupChat, replier, msg_data)==false) {
         replier.reply(M.PingPong(msg));
       }
     }
     */
   }
   catch(e){
     if(packageName=="com.kakao.talk")replier.reply("에러");
     Log.debug(e);
   }
 }