const M = Bridge.getScopeOf("module");
const AS = Bridge.getScopeOf("autoselfcheck")

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

function RandNum(s,e)
{
    if(isNaN(s)==false&&isNaN(e)==false)
    {
      if(parseInt(s)<=parseInt(e)) return String((Math.floor(Math.random() * (e-s+1))+parseInt(s)));
    else return "시작 숫자가 끝나는 숫자 이하여야 합니다.";
    }
    return "!랜덤숫자 [시작숫자] [끝숫자]\n형식으로 입력하세요";
}

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