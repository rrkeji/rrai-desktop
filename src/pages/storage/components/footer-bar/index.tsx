import React from 'react';
import { history, useLocation, useParams } from 'umi';

import styles from './index.less';

export const FooterBar = (props: any) => {
  const params: any = useParams();

  const location: any = useLocation();

  return <div className={styles.container}></div>;
};

export default FooterBar;
