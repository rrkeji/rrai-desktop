import React from 'react';
import classnames from 'classnames';
import RRAI_MINIPROGRAM_PNG from '@/assets/images/rrai_miniprogram.jpeg';
import IDNS_GZH_QRCODE from '@/assets/images/idns_gzh_qrcode.jpg';

import styles from './index.less';

export interface MiniProgramPageProps {

}

export const MiniProgramPage: React.FC<MiniProgramPageProps> = ({ }) => {
  return (
    <div className={classnames(styles.container)}>
      <div className={classnames(styles.list_item)}>
        <img className={classnames(styles.logo)} src={RRAI_MINIPROGRAM_PNG}></img>
        <div>软软AI微信小程序</div>
        <div>

        </div>
      </div>

      <div className={classnames(styles.list_item)}>
        <img className={classnames(styles.logo)} src={IDNS_GZH_QRCODE}></img>
        <div>IDNS软软公众账号</div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default MiniProgramPage;