import React from 'react';
import { Button, Radio, Upload, Switch } from 'antd';
import classnames from 'classnames';
import {
  EllipsisOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  DownloadOutlined,
  FolderAddOutlined,
  PlusOutlined,
  UploadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import styles from './index.less';

export interface StorageHeaderBarProps {
  className?: string,
  setSettingsShown?: () => void,
  menuFolded?: boolean,
  setMenuFold?: () => void,
  layout: string;
  uploadProps: any;
  onMkdir: () => void;
  onLayoutChange: (layout: string) => void;
  onRefresh: () => void;
}


export const StorageHeaderBar: React.FC<StorageHeaderBarProps> = ({
  layout,
  className,
  uploadProps,
  onMkdir,
  onLayoutChange,
  onRefresh,
  menuFolded,
  setMenuFold,
  setSettingsShown,
}) => {
  return (
    <div data-tauri-drag-region className={classnames(styles.container, className)}>
      <div data-tauri-drag-region className={classnames(styles.left)}>
        {
          menuFolded === undefined || setMenuFold === undefined ? (
            ''
          ) : (
            <div className={classnames(styles.button, styles.left_button)} onClick={() => {
              setMenuFold && setMenuFold();
            }}>
              {menuFolded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          )
        }
      </div>
      <div className={styles.right}>
        <Upload {...uploadProps}>
          <div className={classnames(styles.button, styles.right_button)} onClick={() => { }}>
            <UploadOutlined />
          </div>
        </Upload>
        <div className={classnames(styles.button, styles.right_button)} onClick={onMkdir}>
          <FolderAddOutlined />
        </div>

        <div className={classnames(styles.button, styles.right_button,
          layout === 'list' ? styles.selected : undefined,)} onClick={() => {
            onLayoutChange('list');
          }}>
          <AppstoreOutlined />
        </div>
        <div className={classnames(styles.button, styles.right_button,
          layout === 'grid' ? styles.selected : undefined,)} onClick={() => {
            onLayoutChange('grid');
          }}>
          <AppstoreOutlined />
        </div>
        <div className={classnames(styles.button, styles.right_button)} onClick={onRefresh}>
          <ReloadOutlined />
        </div>
        {
          setSettingsShown && <div className={classnames(styles.button, styles.right_button)} onClick={setSettingsShown}>
            <EllipsisOutlined />
          </div>
        }
      </div>
    </div>
  );
};

export default StorageHeaderBar;
