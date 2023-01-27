importClass(
    java.net.ServerSocket,
    java.io.BufferedReader,
    java.io.InputStreamReader,
    java.io.OutputStream,
);

const K = Bridge.getScopeOf("KakaoLink");
const Kakao = K.Kakao

Allowed_Channel = ["열린잡담"]
Image_Exts = ["jpg","jpeg","JPG","JPEG","png","PNG","gif","GIF","bmp","BMP"]

function sendImageToKakao(room, url) {
    Log.d(room)
    try { 
        Kakao.send(room,{
            "link_ver" : "4.0",
            "template_id" : 69509,
            "template_args" : {
              "image" : url,
              "url" : url
            }
            }, "custom");
    } catch(e) {
        Log.e(e);
    }
}

function ditalks(room, replier) {
    try {
        //소켓 생성
        const socket = new java.net.Socket("", 8080);
        socket.setSoTimeout(300000)
        replier.reply("연결됨")
        const input = socket.getInputStream();
        let line = new java.nio.ByteBuffer.allocate(1024).array();
        while(1) {
          try {
              let lcnt = input.read(line)
              let message = JSON.parse(UTF8stringFromJavaByteArray(line,lcnt))
              let msg = message.Message;
              let sender = message.SendBy
              if(msg=="exit") {
                  replier.reply("연결을 종료합니다.")
                  return 0;
              }
              
              if(socket.isConnected() == true && socket.getKeepAlive() == false) {
                socket.setKeepAlive(true);
                if(socket.getKeepAlive() == false) {
                    socket.close();
                    return 1;
                }
              }
              if(!msg||!sender) continue;
              if(message.IsForce||Allowed_Channel.indexOf(message.Channel)>-1) replier.reply(sender + " : " + msg)
              if(message.File.length>0) {
                  let filelist = "";
                  for(i=0;i<message.File.length;i++) {
                      ext = message.File[i].Name.split(".");
                      ext = ext[ext.length-1];
                      if(Image_Exts.indexOf(ext)>-1) {
                          sendImageToKakao(room, message.File[i].Url);
                      }
                      else filelist += "\n["+ message.File[i].Name + "] " + message.File[i].Url;
                  }
                  replier.reply(sender + " : 파일을 보냈습니다." + filelist)
              }
          } catch (e) {
              Log.e(e);
              return 1;
          }
        }
        return;
    } catch (e) {
        Log.e(e);
    }
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if(msg == "소켓 테스트"&&room=="IROOM") {
        replier.reply("소켓을 연결합니다.")
        let reconnect = ditalks(room, replier);
        while(reconnect) {
            Log.d("소켓을 재연결합니다.")
            reconnect = ditalks(room, replier);
        }
    }
}

function UTF8stringFromJavaByteArray(line,lcnt)
    {
        let data = []
        for(i=0;i<lcnt;i++) data[i] = line[i];
        const extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
        var count = data.length;
        var str = "";
        for (var index = 0;index < count;)
        {
            var ch = data[index++];
            if (ch & 0x80)
            {
                var extra = extraByteMap[(ch >> 3) & 0x07];
                if (!(ch & 0x40) || !extra || ((index + extra) > count))
                    return null;
                ch = ch & (0x3F >> extra);
                for (;extra > 0;extra -= 1)
                {
                    var chx = data[index++];
                    if ((chx & 0xC0) != 0x80)
                        return null;
                    ch = (ch << 6) | (chx & 0x3F);
                }
            }
            str += String.fromCharCode(ch);
        }
        return str;
    }