const M = Bridge.getScopeOf("module");
const AS = Bridge.getScopeOf("autoselfcheck")

var loop=0;
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if(sender=="나태양"&&msg=="!시작")
    {
      replier.reply("시작합니다");
        var hour, min, sec;
        var morning=false, launch=false, dinner=false;
        loop=1;
        while(loop)
        {
          let today = new Date();
          hour = today.getHours();
          min = today.getMinutes();
          day=today.getDay();
          if(day!=0&&day!=6){
          if(hour==7&&min>=50&&!morning)
          {
            try{
            morning=true;
            replier.reply(AS.Autoselfcheck_Function());
            replier.reply(M.Meal_Function(0,0,0));
            replier.reply(M.Timetable_Function(0));
            dinner=false;
            }catch(e){
              replier.reply("에러");
              Log.debug(e);
            }
          }
          else if(hour==12&&min>=0&&!launch) {replier.reply(M.Meal_Function(0,2,0));morning=false;launch=true;}
          else if(hour==17&&min>=10&&!dinner) {replier.reply(M.Meal_Function(0,3,0));launch=false;dinner=true;}
          }
          Log.debug(M.numberPad(String(hour),2) + M.numberPad(String(min),2));
          java.lang.Thread.sleep(1000*60);
        }
    }
    else if(sender=="나태양"&&msg=="!멈춰")
    {
        while(loop) loop=0;
        replier.reply("정지합니다");
    }
}