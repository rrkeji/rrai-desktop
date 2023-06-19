import React from 'react';
import classnames from 'classnames';
import { Card, Descriptions, Modal } from 'antd';
import styles from './index.less';

export interface SettingsAboutPageProps {

}

export const SettingsAboutPage: React.FC<SettingsAboutPageProps> = ({ }) => {

  //
  return (
    <div className={classnames(styles.container)}>
      <Card>
        <div className={classnames(styles.content)}>
          <Descriptions title={'关于我们'} layout={'horizontal'} column={1}>
            <Descriptions.Item label="">{'软软AI'}</Descriptions.Item>
            <Descriptions.Item label="简介">{'软软AI是一个AI智能体验馆。'}</Descriptions.Item>
            <Descriptions.Item label="官方网址" >{'https://rrai.idns.link'}</Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </div>
  );
};

export default SettingsAboutPage;