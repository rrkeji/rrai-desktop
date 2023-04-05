import { useEffect } from "react";
import { history } from 'umi';

import { Browser } from '@/components/index';

const APPID = "wxd2ed8df26eea65be";

const REDIRECT_URL = "https://www.idns.link/rrai/proxy/wx/login/notify";

export default function LoginPage() {
  useEffect(() => {

    setTimeout(() => {
      // history.push('/home');
    }, 100);

  }, []);

  //https://www.idns.link/rrai/web_proxy/index.html#/wx_login_proxy?key=token&token=sasdfasdfasdf

  return (
    <Browser src={`https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&scope=snsapi_login&state=rrai_desktop#wechat_redirect`}
      receiveMessage={(origin, type, data) => {
        console.log(origin, type, data);
      }}></Browser>
  );
}
