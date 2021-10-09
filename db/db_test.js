const Runtime = java.lang.Runtime;
const SQLiteDatabase = android.database.sqlite.SQLiteDatabase;

const Decrypt = Bridge.getScopeOf("decrypt");

///777 permission
Runtime.getRuntime().exec("su -c \"\"chmod -R 777 /data/data/com.kakao.talk").waitFor();

let db = null;
let db2 = null;

function updateDB() {
    db = SQLiteDatabase.openDatabase("/data/data/com.kakao.talk/databases/KakaoTalk.db", null, SQLiteDatabase.CREATE_IF_NECESSARY);
    db2 = SQLiteDatabase.openDatabase("/data/data/com.kakao.talk/databases/KakaoTalk2.db", null, SQLiteDatabase.CREATE_IF_NECESSARY);
}
updateDB();


function getChatJson () {
    let chatdata = db.rawQuery("SELECT * FROM chat_logs", null);
    chatdata.moveToLast();

    //message keys
    let keys = ["_id", "id", "type", "chat_id", "user_id", "message", "attachment", "created_at", "deleted_at", "client_message_id", "prev_id", "referer", "supplement", "v"];

    let json = {};
    for (i in keys) json[keys[i]] = chatdata.getString(i);
    user_id = json["user_id"];
    enc = JSON.parse(json["v"]).enc;
    json["message"] = Decrypt.decrypt(user_id, enc, json["message"]);

    //attachment
    //메세지가 길어져서 더보기에 있는 경우 그 메세지와
    //사진, 파일등 정보가 담겨있음
    //사진의 경우 URL로 바로 볼 수 있고, 파일은 URL이 있지만 다운법은 모르겠음
    if(json["attachment"] != null) json["attachment"] = Decrypt.decrypt(user_id, enc, json["attachment"]);
    
    return json;
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    let chatdata = db.rawQuery("SELECT * FROM chat_logs", null);
    chatdata.moveToLast();

    chat_data = getChatJson();

    str = JSON.stringify(chat_data, null, 4);
    replier.reply(str);
}