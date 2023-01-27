const { KakaoApiService, KakaoLinkClient } = require('kakaolink')

const Kakao = new KakaoLinkClient();

KakaoApiService.createService().login({
    email: 'email',
    password: 'password',
    keepLogin: true,
}).then(e => {
    Kakao.login(e, {
        apiKey: 'd1b87ff979264dd8186e3dda6e5d0524',
        url: 'https://gbs.wiki'
    });
}).catch(e => {
    throw e;
});