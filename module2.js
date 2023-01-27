importClass(org.jsoup.Jsoup);
const FS = FileStream;

const K = Bridge.getScopeOf("Kaling");
const Kakao = K.Kakao


function showBOJUserInfo(handle, room) {
    let tier_table = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby", "Master"]
    let roman_num = ["I", "II", "III", "IV", "V"]
    let res = {}
    try {
        res = JSON.parse(Jsoup.connect("https://solved.ac/api/v3/user/show")
                    .data("handle", handle)
                    .ignoreContentType(true).get().text())


        let organizations = ""
        for (let i=0;i<res["organizations"].length;i++) {
            Log.d(res["organizations"][i]["name"])
            organizations += res["organizations"][i]["name"] + ((i==res["organizations"].length-1)?"":", ")
        }
        
        Kakao.sendLink(room, {
            template_id: 89209,
            template_args: {
                "handle": handle,
                "tier": tier_table[parseInt((res["tier"]-1)/5)]+" "+(res["tier"]==31?"":roman_num[(5-(res["tier"]-1)%5)-1]),
                "tier_image": "https://raw.githubusercontent.com/Iroom-gbs/BUKGWAKBOT/master/solvedac/"+String(res["tier"])+".png",
                "rating": res["rating"],
                "badge": res["badge"]["displayName"],
                "badge_image": res["badge"]["badgeImageUrl"],
                "exp": res["exp"],
                "solved": res["solvedCount"],
                "organizations": organizations
            }
        }, 'custom').then(e => {
            return 1
        }).catch(e => {
            Log.e(e);
            return {
                "handle": handle,
                "bio": res["bio"],
                "organizations": organizations,
                "badge": {
                    "name": res["badge"]["displayName"],
                    "url": ["displayName"]
                },
                "background": {
                    "name": res["background"]["displayName"],
                    "url": res["background"]["backgroundImageUrl"]
                },
                "profileImage": res["profileImageUrl"],
                "solved": res["solvedCount"],
                "voted": res["voteCount"],
                "exp": res["exp"],
                "rating": res["rating"],
                "tier": res["tier"],
                "tierName": tier_table[parseInt((res["tier"]-1)/5)]+" "+(res["tier"]==31?"":roman_num[(5-(res["tier"]-1)%5)-1]),
                "tierImage": "https://raw.githubusercontent.com/Iroom-gbs/BUKGWAKBOT/master/solvedac/"+String(res["tier"])+".png",
                "class": res["class"],
                "maxStreak": res["maxStreak"]
            }
        })
    } catch(e) {
        Log.e(e);
        return "핸들을 찾을 수 없습니다."
    }


}