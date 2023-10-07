var roomList = [];
var scriptList = ["Kaling","DiTalks","gamemodule", "module", "main"]
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(isGroupChat&&roomList.indexOf(room)==-1) {
    Log.d(room)
    roomList.push(room);
  }
  if(sender==""&&room=="") {
    if(msg.startsWith("!공지")) {
      for(let i=0;i<roomList.length;i++) {
        try {
          replier.reply(roomList[i], "📢 공지사항\n============\n" + msg.substr(3));
        } catch(e) {
          replier.reply(roomList[i]+" 에 메세지를 보낼 수 없습니다.");
        }
        java.lang.Thread.sleep(5000);
      }
    }
    if(msg=="!방목록") {
      replier.reply(roomList.length + "개 방\n---------\n" + roomList.join("\n"));
    }
    if(msg=="!리로드") {
      for(let i=0;i<scriptList.length;i++) {
        Api.reload(scriptList[i]);
        if(i==0) java.lang.Thread.sleep(1000*3);
        Api.on(scriptList[i]);
        replier.reply(scriptList[i] + "리로드 완료");
        java.lang.Thread.sleep(300);
        }
    }
  }
  
}