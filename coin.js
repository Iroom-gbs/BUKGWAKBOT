/**
 * Author: hegelty(naver@hegelty.me)
 * Date: 2022-05-14
 * Description: RIGHTEOUS KakaoTalk Bot
 * Copyright (c) 2022 hegelty
 * All rights reserved.
 * 
 * 1. KakaoLink.js 파일에 있는 소스코드를 KakaoLink라는 이름의 봇을 생성하여 그 안에 넣습니다.
 * 2. 봇을 하나 더 생성한 후 이 코드를 넣습니다.
 * 3. KakaoLink를 먼저 컴파일합니다.(킬 필요 없음)
 * 4. 이 봇을 실행시킵니다.
 */

importClass(org.jsoup.Jsoup)
var Kakao = Bridge.getScopeOf("KakaoLink").Kakao;
const Lw = "\u200b".repeat(500);
var last_news_id = 0;
var room = "";

function showCoinPrice(coin_name) {
    let names = {}, symbol_to_korean_name = {}, korean_name_to_symbol = {};
    let symbol = "";
    try {
        names = JSON.parse(Jsoup.connect("https://api.upbit.com/v1/market/all") //업비트 api
                                .ignoreContentType(true).get().text());
        for(let i in names) { //이름 수만큼 반복
            let korean_name = names[i].korean_name; //한글 이름
            symbol_to_korean_name[names[i].market.split('-')[1]] = korean_name; //키값이 심볼, 값이 한글 이름
            korean_name_to_symbol[korean_name] = names[i].market.split('-')[1]; //키값이 한글 이름, 값이 심볼
        }
    } catch(e) { //에러 발생시
        return "error(" + e.lineNumber + "): " + e; 
    }

    coin_name = coin_name.trim().toUpperCase(); //입력받은 코인 이름 전후 공백 제거 후 모두 대문자로 변경
    if(coin_name in korean_name_to_symbol) { //해당 이름이 한글 이름 목록에 있을 시
        symbol = korean_name_to_symbol[coin_name]; //심볼을 가져옴
    }
    else if(coin_name in symbol_to_korean_name) { //해당 이름이 심볼 목록에 있을 시
        symbol = coin_name; //입력받은 값을 심볼로 설정
        coin_name = symbol_to_korean_name[coin_name]; //한글 이름을 가져옴
    }
    else {
        return coin_name + "을 찾을 수 없습니다. 지원하는 코인 목록을 보려면 /코인 을 입력하세요."
    }
    price_data = JSON.parse(Jsoup.connect("https://api.upbit.com/v1/ticker?markets=KRW-" + symbol) //업비트 API에 원화-코인 시세 조회
                                    .ignoreContentType(true).get().text())[0]; //첫번째 항목 선택

    let trade_date_kst = price_data.trade_date_kst.toString(); //기준날짜
    let trade_time_kst = price_data.trade_time_kst.toString(); //기준시간
    let opening_price = price_data.opening_price; //당일시가
    let high_price = price_data.high_price; //당일고가
    let low_price = price_data.low_price; //당일저가
    let trade_price = price_data.trade_price; //현재시세
    let signed_change_price = price_data.signed_change_price; //변동시세
    let signed_change_rate = price_data.signed_change_rate; //변동률
    
    return"❗️ " + coin_name + "(" + symbol + ") 시세정보 ❗️\n"
            + "▪️ " + trade_date_kst.substr(0,4) + "-" + trade_date_kst.substr(4,2) + "-" + trade_date_kst.substr(6,2) + " " + trade_time_kst.substr(0,2) + ":" + trade_time_kst.substr(2,2) + " 기준 ◾️\n"
            + "✅️ 현재시세 : " + thousand_separator(trade_price) + "원\n"
            + "✅️ 변동시세 : " + thousand_separator(signed_change_price) + "원\n"
            + "✅️ 당일시가 : " + thousand_separator(opening_price) + "원\n"
            + "📈 당일고가 : " + thousand_separator(high_price) + "원\n"
            + "📉 당일저가 : " + thousand_separator(low_price) + "원\n"
            + "📊 변동률 : " + "(" + (signed_change_rate * 100).toFixed(2) + "%)";
}

function showGIMP(coin_name) {
    if(!coin_name) coin_name = "비트코인"; //입력이 없을 시 기본 이름을 비트코인으로 설정
    //아래부터는 위 showCoinPrice 함수와 동일하게 작동함
    let names = {}, symbol_to_korean_name = {}, korean_name_to_symbol = {};
    let symbol = "";
    try {
        names = JSON.parse(Jsoup.connect("https://api.upbit.com/v1/market/all")
                                .ignoreContentType(true).get().text());
        for(let i in names) {
            let korean_name = names[i].korean_name;
            symbol_to_korean_name[names[i].market.split('-')[1]] = korean_name;
            korean_name_to_symbol[korean_name] = names[i].market.split('-')[1];
        }
    } catch(e) {
        return "error(" + e.lineNumber + "): " + e; 
    }

    coin_name = coin_name.trim().toUpperCase();
    if(coin_name in korean_name_to_symbol) {
        symbol = korean_name_to_symbol[coin_name];
    }
    else if(coin_name in symbol_to_korean_name) {
        symbol = coin_name;
        coin_name = symbol_to_korean_name[coin_name];
    }
    else {
        return coin_name + "을 찾을 수 없습니다. 지원하는 코인 목록을 보려면 /코인 을 입력하세요."
    }
    let won_data = JSON.parse(Jsoup.connect("https://api.upbit.com/v1/ticker?markets=KRW-" + symbol)
                                    .ignoreContentType(true).get().text())[0];
    let won_price = Number(won_data.trade_price); //원화 가격

    try {
        let usd_price = Number(JSON.parse(Jsoup.connect("https://api.binance.com/api/v3/ticker/price") //바이낸스에서 코인 가격 조회
                                        .data("symbol", symbol + "USDT").ignoreContentType(true).get().text()).price); //코인-USDT간 가격 조회
        let currency = Number(JSON.parse(Jsoup.connect("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD") //달러 환율 조회
                                        .ignoreContentType(true).get().text())[0].basePrice); //환율
        return "❗️ " + coin_name + "(" + symbol + ") 김프 정보 ❗️\n"
                + "✅️ 업비트 시세 : " + thousand_separator(won_price) + "원\n"
                + "✅️ 바이낸스 시세 : " + usd_price.toFixed(1) + "달러(" + thousand_separator((usd_price*currency).toFixed(0)) + "원)\n"
                + "📊 김프 : " + ((won_price/(usd_price*currency)-1) * 100).toFixed(3) + "%)";
    } catch(e) {
        return coin_name + "의 김프 정보를 조회할 수 없습니다.."
    }
}

function thousand_separator(num) { //1000 단위로 콤마 찍기
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function newsSender() {
    //날짜와 시간 정보를 가지고 있는 Date 객체를 생성후, 시간과 분을 저장한다.
    let today = new Date();
    let hour = today.getHours();
    let min = today.getMinutes();
    Log.d(hour+":"+min);

    //6:00분에 작동
    if(hour==6 && min==00) {
        //카카오링크 다시 로그인
        Api.reload("kakaoLink");
        //로그인 될 때까지(3초) 대기
        java.lang.Thread.sleep(1000*3);
        Log.d("카링 리로드 완료");

        //카카오링크 다시 불러오기
        Kakao = Bridge.getScopeOf("KakaoLink").Kakao;
    }
    //7:00분에 작동
    if(hour==7 && min ==0) {
        sendCoinnessNewsList(room);
    }
    //8시에서 20시 사이, 20분 간격으로 작동
    else if((hour>=8&&hour<=20) && min % 20 == 0) {
        sendCoinnessNewsList(room);
    }
    //21시에서 3시 사이 매번 작동
    else if(hour<=3||hour>=21) {
        sendCoinnessNews(room);
    }
}

function sendCoinnessNewsList(room) {
    let news_data = JSON.parse(Jsoup.connect("https://api.coinness.live/feed/v1/articles?limit=5&section=latest") //코인니스 뉴스 API
                                    .ignoreContentType(true) //JSON 형식 응답을 받아오기 위함
                                    .get().text()) //받아온 내용에서 text 추출
                                    .sort((a, b) => { //id 내림차순 정렬
                                        a = a.id;
                                        b = b.id;
                                        if (a < b) return 1;
                                        if (a > b) return -1;
                                        return 0;
                                    });;
    let template_args = { //카카오링크 템플릿 인자
        "header":"코인니스 뉴스"
    }
    for(let i=0;i<5;i++) { //뉴스 5개
        template_args["title"+(i+1)] = news_data[i].title;
        template_args["detail"+(i+1)] = news_data[i].description;
        template_args["image"+(i+1)] = news_data[i].thumbnailImage;
    }
    Kakao.send(room,{ //카카오링크 보내기
        link_ver : "4.0",
        template_id : 76267 ,
        template_args : template_args
    }, "custom");
}

function sendCoinnessNews(room) {
    let news_data = JSON.parse(Jsoup.connect("https://api.coinness.live/feed/v1/articles?limit=5&section=latest") //코인니스 뉴스 API
                                    .ignoreContentType(true) //JSON 형식 응답을 받아오기 위함
                                    .get().text()) //받아온 내용에서 text 추출
                                    .sort((a, b) => { //id 내림차순 정렬
                                        a = a.id;
                                        b = b.id;
                                        if (a < b) return 1;
                                        if (a > b) return -1;
                                        return 0;
                                    });;
    if(last_news_id==0) { //최초 실행시
        last_news_id = news_data[0].id; //현재 최신 뉴스의 id를 저장
    }
    for(let i=0;i<10;i++) { //최근 10개 뉴스
        if(news_data[i].id<=last_news_id) break; //뉴스 id가 마지막으로 보냈던 뉴스 id보다 작으면 더이상 보내지 않음
        Kakao.send(room,{ //카카오링크 보내기
            link_ver : "4.0",
            template_id : 76268,
            template_args : {
                "title" : news_data[i].title,
                "detail": news_data[i].description,
                "image": news_data[i].thumbnailImage
            }
        }, "custom");
    }
    last_news_id = news_data[0].id; //현재 최신 뉴스의 id를 저장
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
    if(msg == "/코인니스 시작") {
        room = room;
        setInterval(newsSender, 1000*60); //60초마다 newsSender 함수 실행
        replier.reply("뉴스 기능이 활성화되었습니다.");
    }
    else if(msg == "/코인니스 중지") {
        clearInterval(); //인터벌 중지(이지만 알 수 없는 오류가 있음)
        replier.reply("뉴스 기능이 중지되었습니다.");
    }
    if (msg[0] == ".") replier.reply(showCoinPrice(msg.substr(1))); //코인 가격 출력
    else if (msg[0] == "/") { //슬래시로 시작할때
        switch(msg.substr(1).split(" ")[0]) { //첫번째 글자 지우고 스페이스바 기준 나누기
            case "도움말":
                replier.reply("📈소으코인 BOT 도움말📉\n" + Lw + "\n"
                            + "() : 선택  [] : 필수\n"
                            + "💠코인💠\n"
                            + "▶️ .코인이름|심볼: 해당 코인의 시세 정보를 보여줍니다.\n"
                            + "▶️ /김프 (코인이름): 해당 코인의 김프 정보를 보여줍니다.\n"
                            + "▶️ /코인니스: 코인니스 뉴스를 보여줍니다.\n"
                            + "\n💠기타💠\n"
                            + "▶️ /정보: 소으코인 BOT 정보\n"
                            + "▶️ /상태: 소으코인 BOT 상태\n"
                            + "▶️ /문의: 봇 관련 문의/건의하기" );
                break;
            case "정보":
                replier.reply("📈소으코인 BOT 정보📉\n"
                            + "▶️ 소으코인 BOT v0.1\n"
                            + "▶️ 문의: /문의" );
                break;
            case "상태":
                replier.reply("📈소으코인 BOT 상태📉\n"
                            + "\n▶ 안드로이드버전 : " + Device.getAndroidVersionName()
                            + "\n\n▶ 배터리 : " + Device.getBatteryLevel()
                            + "%\n▶ 배터리 온도 : " + Device.getBatteryTemperature()/10
                            + "°c\n▶ 충전여부 : "+Device.isCharging()
                            + "\n▶ 전압상태 : " + Device.getBatteryVoltage());                
                break;
            case "문의":
                replier.reply("문의하기: 문의 링크 적어주세요");
                break;
            case "김프":
                replier.reply(showGIMP(msg.split(" ")[1]));
                break;
        }
    }
}