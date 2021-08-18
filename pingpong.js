const Key = "Basic a2V5OmY4Yzc0ZWRjOTA5ODllMTZhOTA3Y2E3YjYwNWQwODE2"; // Key


function PingPong(query, sessionId) {

try {
        var data = {
                "request": {
                "query": String(query)
                }
        };

        result = JSON.parse(org.jsoup.Jsoup.connect("https://builder.pingpong.us/api/builder/6097e9a0e4b091a94bc419e3/integration/v0.2/custom/"+sessionId)
                                .header("Authorization", Key)
                                .header("Content-Type", "application/json")
                                .requestBody(JSON.stringify(data))
                                .ignoreContentType(true).ignoreHttpErrors(true).post().text());
        return JSON.stringify(result);
        try {
        return(result.response.replies[0].text);
        } catch (e) {
        return(result.response.replies.text);
        }
} catch(e) {return("에러 : " + e);}
}

