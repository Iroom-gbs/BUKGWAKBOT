importClass(org.jsoup.Jsoup);
const M = Bridge.getScopeOf("module");
const AS = Bridge.getScopeOf("autoselfcheck")
const K = Bridge.getScopeOf("KakaoLink");
const Kakao = K.Kakao


const FS = FileStream;
//////////가위바위보//////////
function RSP(input)
{
    Math.rands
    let r = (Math.floor(Math.random() * 3))+1;
    let input_num = 0, result = "";
    switch(input) {
        case "가위": input_num = 1; break;
        case "바위": input_num = 2; break;
        case "보": input_num = 3; break;
        default: return "!가위바위보 [가위/바위/보]";
    }
    switch(r) {
        case 1: result = "가위"; break;
        case 2: result = "바위"; break;
        case 3: result = "보"; break;
    }
    switch((input_num - r + 3) % 3) {
        case 0: result += "!\n비겼습니다."; break;
        case 1: result += "!\n졌어요ㅠㅠ"; break;
        case 2: result += "!\n이겼다!"; break;
    }
    return result;
}

//////////랜덤숫자//////////
function RandNum(s,e)
{
    if(isNaN(s)==false&&isNaN(e)==false)
    {
      if(parseInt(s)<=parseInt(e)) return String((Math.floor(Math.random() * (e-s+1))+parseInt(s)));
    else return "시작 숫자가 끝나는 숫자 이하여야 합니다.";
    }
    return "!랜덤숫자 [시작숫자] [끝숫자]\n형식으로 입력하세요";
}

//////////랜덤목록//////////
function RandList(n)
{
    if(isNaN(n)==true) return "!랜덤목록 [갯수]";
    var arr = new Array();
    for(i=1;i<=n;i++) arr[i-1]=i;
    arr.sort(function(){return Math.random() - Math.random();});
    var result="랜덤목록 결과\n"+ "\u200b".repeat(500);
    for(i=1;i<=n;i++) result+=String(i) + " : " + String(arr[i-1]) + "\n";
    return result;
}

//////////랜덤목록//////////
function Dice()
{
    dice = ["","⚀","⚁","⚂","⚃","⚄","⚅"];
    result = Math.floor(Math.random() * 5) + 1;
    return dice[result];
}

function LOLHistory(name, room)
{
    if(!name) return "소환사명을 입력하세요.";
    let url = Jsoup.connect("https://www.op.gg/summoner/userName="+encodeURI(name)).get();

    try {
        let username = url.select("div.Information > span.Name").text();
        if(!username) return "소환사를 찾을 수 없습니다.";
        let profileimage = "https:" + url.select("img.ProfileImage").attr("src");
        let lastupdate = url.select("div.Header > div.LastUpdate > span").text();
        let userlevel = url.select("div.ProfileIcon > span").text();

        let solorank_tier = url.select("div.TierRank").text();
        let solorank_tierimage = "https:" + url.select("div.SummonerRatingMedium > div > img.Image").attr("src");
        if(solorank_tier=="Unranked") {
            let solorank_win = "-";
            let solorank_losses = "-";
            let solorank_winratio = "-";
        }
        let solorank_win = url.select("div.TierInfo > span.WinLose > span.wins").text();
        let solorank_losses = url.select("div.TierInfo > span.WinLose > span.losses").text();
        let solorank_winratio = url.select("div.TierInfo > span.WinLose > span.winratio").text().replace("Win Ratio ","");
        
        let freerank_tier = url.select("div.sub-tier__rank-tier").text();
        let freerank_tierimage = "https:" + url.select("div.sub-tier > img").attr("src");
        if(freerank_tier=="Unranked") {
            let freerank_tierimage = "https://opgg-static.akamaized.net/images/medals/default.png";
            let freerank_winloss = "-";
            let freerank_winratio = "-";
        }
        else {
            let freerank_winloss = url.select("div.sub-tier > div > div.sub-tier__league-point > span").text();
            let freerank_winratio = url.select("div.sub-tier > div > div.sub-tier__gray-text").text().replace("Win Rate ","");
        }
        
        Kakao.send(room,{
            link_ver : "4.0",
            template_id : 54842,
            template_args : {
            header : "OP.GG 전적검색",
            name : encodeURI(username),

            title1 : username,
            des1 : userlevel + "레벨",
            image1 : profileimage,

            title2 : "솔로랭크 : "+solorank_tier,
            des2 :  solorank_win+" "+solorank_losses + "(" + solorank_winratio+")",
            image2 : solorank_tierimage,

            title3 : "자유랭크 : " +freerank_tier,
            des3 : freerank_winloss.substring(2,freerank_winloss.length) + "(" + freerank_winratio+")",
            image3 : freerank_tierimage,

            updated : lastupdate,
            }
        }, "custom");
        return "성공";
    } catch(e) {
        Log.debug(e);
        return "소환사를 찾을 수 없습니다."
    }
}


//////////op.gg갱신//////////
/*
https://cafe.naver.com/nameyee/27089
©민초단
*/
function opggupdate(nickname) {

    try{
        userNum=Number(org.jsoup.Jsoup.connect("https://www.op.gg/summoner/userName="+encodeURI(nickname)).get().toString().split("data-summoner-id=\"")[1].split("\"")[0]);
        org.jsoup.Jsoup.connect("https://www.op.gg/summoner/ajax/renew.json/").data("summonerId",userNum).post();
        return "3~20초내에 갱신 됩니다.";
    }catch(e){
        if(e.toString().startsWith("TypeError")) {
            return "유저가 존재하지 않습니다!";
        } else {
            return "최근에 갱신했습니다.";
        }
    }
}

//////////끄투긴단어//////////
function Kkutu_Long(c)
{
    result = '"'+c+'"로 시작하는 긴 단어\n----------';
    LongWords = (FS.read("/sdcard/BUKGWAKBOT/long.txt")).split("\n");
    for(i=0;i<LongWords.length;i++)
    {
        if(LongWords[i][0]>c)
        {
            if(result) return result;
            return '"'+c+'"로 시작하는 긴 단어가 없습니다. ';
        }
        if(LongWords[i][0]==c) result+="\n"+LongWords[i];
    }
    return result;
}

//초성 구하기
/*
https://cafe.naver.com/nameyee/32601
© 임지혁
MIT License
*/
function cho_hangul(str) {
    cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    result = "";
    for(i=0;i<str.length;i++) {
        code = str.charCodeAt(i)-44032;
        if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
        else result += str.charAt(i);
    }
    return result;
}