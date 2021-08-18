importClass(org.jsoup.Jsoup);
const M = Bridge.getScopeOf("module");
const AS = Bridge.getScopeOf("autoselfcheck")
const K = Bridge.getScopeOf("KakaoLink");
const Kakao = K.Kakao


const FS = FileStream;
//////////가위바위보//////////
function RSP(input)
{
    var r;
    r = (Math.floor(Math.random() * 3))+1;

    if(input=="가위")
    {
        if(r==1) return "가위!\n비겼어요";
        else if(r==2) return "바위!\n내가 이김";
        else return "보!\n졌다...";
    }
    if(input=="바위")
    {
        if(r==1) return "가위!\n졌다...";
        else if(r==2) return "바위!\n비겼어요";
        else return "보!\n내가 이김";
    }
    if(input=="보")
    {
        if(r==1) return "가위!\n내가 이김";
        else if(r==2) return "바위!\n졌다...";
        else return "보!\n비겼어요";
    }
    else return "가위바위보 할줄 몰라요?\n!가위바위보 [가위/바위/보]";
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
    return result+dice[result];
}

function LOLHistory(name, room)
{
    if(!name) return "소환사명을 입력하세요.";
    var url = Jsoup.connect("https://www.op.gg/summoner/userName="+encodeURI(name)).get();

    try {
        var username = url.select("body > div.l-wrap.l-wrap--summoner > div.l-container > div > div > div.Header > div.Profile > div.Information > span").text();
        var profileimage = url.select("body > div.l-wrap.l-wrap--summoner > div.l-container > div > div > div.Header > div.Face > div > img").attr("src").text().replace("//","https://").replace("?image=q_auto:best&v=1","");
        var lastupdate = url.select("div.Header > div.LastUpdate > span").text();
        var userlevel = url.select("div.Header > div.Face > div > span").text();

        var solorank_tier = url.select("div.TierRankInfo > div.TierRank").text();
        var solorank_tierimage = "https://opgg-static.akamaized.net/images/medals/" + solorank_tier.substring(0,solorank_tier.length-2).toLowerCase() + "_" + solorank_tier[solorank_tier.length-1] + ".png";
        var solorank_win = url.select("div.TierInfo > span.WinLose > span.wins").text();
        var solorank_losses = url.select("div.TierInfo > span.WinLose > span.losses").text();
        var solorank_winratio = url.select("div.TierInfo > span.WinLose > span.winratio").text();
        if(solorank_tier=="Unranked") freerank_tierimage = "https://opgg-static.akamaized.net/images/medals/default.png";

        var freerank_tier = url.select("div.sub-tier > div > div.sub-tier__rank-tier").text();
        var freerank_tierimage = "https://opgg-static.akamaized.net/images/medals/" + freerank_tier.substring(0,freerank_tier.length-2).toLowerCase() + "_" + freerank_tier[freerank_tier.length-1] + ".png";
        var freerank_winloss = url.select("div.sub-tier > div > div.sub-tier__league-point > span").text();
        var freerank_winratio = url.select("div.sub-tier > div > div.sub-tier__gray-text").text();
        if(freerank_tier=="Unranked") freerank_tierimage = "https://opgg-static.akamaized.net/images/medals/default.png";

        Kakao.send(room,{
            link_ver : "4.0",
            template_id : 54842,
            template_args : {
            header : "OP.GG 전적검색",
            name : encodeURI(username),

            title1 : username,
            des1 : userlevel + "레벨(" + lastupdate+" 갱신)",
            image1 : profileimage,

            title2 : "솔로랭크 : "+solorank_tier,
            des2 :  solorank_win+solorank_losses + "(" + solorank_winratio+")",
            image2 : solorank_tierimage,

            title3 : "자유랭크 : " +freerank_tier,
            des3 : freerank_winloss.substring(2,freerank_winloss.length) + "(" + freerank_winratio+")",
            image3 : freerank_tierimage,
            }
        }, "custom");
        return profileimage;
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