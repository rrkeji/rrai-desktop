import { useEffect } from "react";
import { history } from 'umi';

import { Browser } from '@/components/index';

const APPID = "wxd2ed8df26eea65be";

const REDIRECT_URL = "https://www.idns.link/rrai/wx/login/notify";

export default function LoginPage() {
  useEffect(() => {

    setTimeout(() => {
      // history.push('/home');
    }, 100);

  }, []);
  return (
    <Browser src={`https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&scope=snsapi_login&state=rrai_desktop#wechat_redirect`}></Browser>
  );
}
