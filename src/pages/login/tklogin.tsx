import { useEffect, useState } from "react";
import { history, useLocation } from 'umi';
import { Spin } from 'antd';
import { Browser } from '@/components/index';
import { authGetInforByToken } from '@/services/index';
import { getToken, setToken, isLogin } from '@/utils/index';

import styles from './tklogin.less';
import { setContextValue } from "@/tauri";

const parseSearch = (search: string): { [key: string]: any } => {
  let params: { [key: string]: any } = {};

  search.slice(1).split('&').forEach(item => {
    let temp = item.split('=');
    params[temp[0]] = decodeURIComponent(temp[1]);
  });
  return params;
}


export default function LoginPage() {

  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(location.search);
    let searchParams = parseSearch(window.location.search);
    console.log(searchParams);

    const token: string = searchParams["token"];
    if (!token) {
      //没有token
      setLoading(false);
      history.push('/login');
      return;
    }
    setLoading(false);
    setToken(token);
    setContextValue("rrai_token", token);
    history.push('/login');
  }, [location.search]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin tip="加载中" size="large">
          {/* <div className={styles.content} /> */}
        </Spin>
      </div>
    );
  }
  //
  return (
    <div className={styles.container}>
      <Spin tip="校验token" size="large">
        {/* <div className={styles.content} /> */}
      </Spin>
    </div>
  );
}
