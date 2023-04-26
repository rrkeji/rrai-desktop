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
  title: string,
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

        <Upload {...uploadProps}>
          <div className={classnames(styles.item, styles.upload)}>
            <UploadOutlined className={classnames(styles.icon)} />
            上传
          </div>
        </Upload>
        <div
          className={classnames(styles.item, styles.mkdir)}
          onClick={onMkdir}
        >
          <FolderAddOutlined className={classnames(styles.icon)} />
          新建文件夹
        </div>
      </div>
      <div className={styles.right}>
        <div className={classnames(styles.item)}>
          <div
            className={classnames(
              styles.layout,
              styles.list_layout,
              layout === 'list' ? styles.selected : undefined,
            )}
            onClick={() => {
              onLayoutChange('list');
            }}
          >
            <UnorderedListOutlined className={classnames(styles.icon)} />
          </div>
          <div
            className={classnames(
              styles.layout,
              styles.grid_layout,
              layout === 'grid' ? styles.selected : undefined,
            )}
            onClick={() => {
              onLayoutChange('grid');
            }}
          >
            <AppstoreOutlined className={classnames(styles.icon)} />
          </div>
        </div>
        <div
          className={classnames(styles.item, styles.refresh)}
          onClick={onRefresh}
        >
          <ReloadOutlined className={classnames(styles.icon)} />
        </div>
      </div>
    </div>
  );
};

export default StorageHeaderBar;
