import { useEffect, useState } from "react";
import { history, useLocation } from 'umi';
import { Spin } from 'antd';
import { Browser } from '@/components/index';
import { authGetInforByToken } from '@/services/index';
import { getToken, setToken, isLogin, setLocalValue } from '@/utils/index';

import styles from './index.less';
import { setContextValue } from "@/tauri";

const APPID = "wxd2ed8df26eea65be";

const BASE_REDIRECT_URL = "https://rrai.idns.link/api/wx/login/notify";

export default function LoginPage() {

  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);

  const [toLogin, setToLogin] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const call = async () => {
      let token = getToken();
      if (!token || token == '') {
        setToLogin(true);
        setLoading(false);
        return;
      }
      //判断是否有token，并且token是否有效
      let res = await authGetInforByToken(token);
      console.log(res);
      if (res && res.openid) {
        setContextValue("rrai_token", token);
        setLocalValue("rrai_web_openid", res.openid);
        setLocalValue("rrai_unionid", res.unionid);
        setLocalValue("rrai_web_appid", res.appid);
        history.push('/art');
      }
    };

    call();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin tip="加载中" size="large">
          {/* <div className={styles.content} /> */}
        </Spin>
      </div>
    );
  }

  if (toLogin) {
    //https://www.idns.link/rrai/web_proxy/index.html#/wx_login_proxy?key=token&token=sasdfasdfasdf
    let redirectUrl = `${BASE_REDIRECT_URL}`;
    let origin = window.location.origin;
    let src = '';
    if (origin.indexOf('http') == 0) {
      //DEBUG
      let localUrl = origin + '/#/tklogin';
      let state = `${encodeURIComponent(localUrl)}`;
      src = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    } else {
      src = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=snsapi_login&state=`;
    }
    //
    console.log(src);
    window.location.href = src;

    return (
      <div className={styles.container}>
        <Spin tip="跳转到微信" size="large">
        </Spin>
      </div>
    );
  } else {
    //
    return (
      <div className={styles.container}>
        <Spin tip="检查是否需要登录" size="large">
          {/* <div className={styles.content} /> */}
        </Spin>
      </div>
    );
  }
}
