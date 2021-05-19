        importClass(org.jsoup.Jsoup);

        const Url = "https://builder.pingpong.us/api/builder/6097e9a0e4b091a94bc419e3/integration/v0.2/custom/";

        let User = "Basic a2V5OmY4Yzc0ZWRjOTA5ODllMTZhOTA3Y2E3YjYwNWQwODE2";

        function PingPong(sender,msg){

                let jsondata = '{ "request": { "query": '+msg+' } }';
                Url += btoa(sender);

                try{
                        var data = JSON.parse(Jsoup.connect(Url)
                                                .header("Authorization",User)
                                                .header("Content-Type","application/json")
                                                .requestBody(JSON.stringify({"request":{"query":msg}}))
                                                .ignoreContentType(true).ignoreHttpErrors(true)
                                                .post().text());

                        if(!data.response.replies) throw("a");
                        var ans_cnt = (data.response.replies).length;
                        var rand = Math.floor(Math.random() * ans_cnt);
                        return data.response.replies[rand%ans_cnt].text;
                }catch(e){return e};
        }
                

        function btoa(str){
            android.util.Base64.encodeToString(java.lang.String(str).getBytes("UTF-8"),android.util.Base64.DEFAULT).trim()
        }