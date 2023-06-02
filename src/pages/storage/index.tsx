import React, { useState, useEffect, useCallback } from 'react';
import { history, useLocation, useParams } from 'umi';
import { SideList, SideListItem, } from '@/components/index';
import classnames from 'classnames';
import styles from './index.less';

import {
  Input,
  Button, Divider, Empty, Modal, RadioChangeEvent,
  Radio, Card, Typography, Tabs, Skeleton, Pagination, Spin
} from 'antd';
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
import { FileCategories, StorageDisk, StorageHeaderBar, StorageHeaderIconItem } from './components/index';

import HPG_PNG from '@/assets/hbg.png';
import { FileProvider } from './components/file-provider';

export default function StoragePage() {

  const [active, setActive] = useState<'local' | 'cloud'>('local');

  const [loading, setLoading] = useState<boolean>(false);

  const [provider, setProvider] = useState<FileProvider>(new FileProvider('local'));

  const [visible, setVisible] = useState<boolean>(false);

  const [parentId, setParentId] = useState<number>(0);

  const [version, setVersion] = useState<number>(new Date().getTime());

  const [dirName, setDirName] = useState<string>('');

  useEffect(() => {
    //
    if (provider.getProviderType() !== active) {
      setProvider(new FileProvider(active));
    }
  }, [active]);

  const createDir = useCallback(async (dirName: string) => {
    //创建文件夹
    let res = await provider.createDir(parentId, dirName);
    console.log(res);
    return res
  }, [provider, parentId]);

  return (
    <div className={classnames(styles.container)}>
      <div data-tauri-drag-region className={classnames(styles.header)}>
        <div data-tauri-drag-region className={classnames(styles.left)}>
          <Radio.Group
            options={[
              { label: '软软IPFS', value: 'local' },
              { label: '软盘PINS', value: 'cloud' },
            ]}
            onChange={({ target: { value } }: RadioChangeEvent) => {
              setActive(value);
            }}
            value={active}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <div data-tauri-drag-region className={classnames(styles.center)}>

        </div>
        <div data-tauri-drag-region className={classnames(styles.right)}>
          <StorageHeaderBar className={styles.headerbar}>
            {
              active === 'local' && (
                <>
                  <StorageHeaderIconItem
                    icon={<FolderAddOutlined />}
                    onClick={() => {
                      setVisible(true);
                    }}
                  ></StorageHeaderIconItem>

                  <StorageHeaderIconItem
                    icon={<ReloadOutlined />}
                    onClick={() => { }}
                  ></StorageHeaderIconItem>
                </>
              )
            }
            {
              active === 'cloud' && (
                <>
                </>
              )
            }
          </StorageHeaderBar>
        </div>
      </div>
      <div className={classnames(styles.content)}>
        <div data-tauri-drag-region className={styles.left}>
          <SideList className={styles.side}>
            <FileCategories category={''} onCategoryChange={async () => { }}></FileCategories>
          </SideList>
        </div>
        <div className={classnames(styles.center)}>
          <StorageDisk
            options={{
              layout: 'list'
            }}
            parentId={parentId}
            onParentChange={(id) => {
              setParentId(id);
            }}
            provider={provider}
            version={version}
          ></StorageDisk>
        </div>
      </div>
      <Modal
        title="新建文件夹"
        visible={visible}
        onOk={() => {
          //参数的校验
          if (!dirName) {
            alert('名称不能为空!');
            return;
          }
          if (dirName === '' || dirName.trim() === '') {
            alert('名称不能为空!');
            return;
          }
          createDir(dirName).then((res) => {
            setVersion(new Date().getTime());
            //发送后台请求，新建文件夹
            setLoading(true);
            setVisible(false);
          }).catch(() => {
            //发送后台请求，新建文件夹
            setLoading(true);
            setVisible(false);
          });
        }}
        onCancel={() => {
          setVisible(false);
        }}
        cancelText={'取消'}
        okText={'添加'}
      >
        <Input
          placeholder={'请输入文件夹的名称'}
          value={dirName}
          onChange={(e: any) => {
            setDirName(e.target.value);
          }}
        ></Input>
      </Modal>
    </div>
  );
}

