import React, { useState, useEffect } from 'react';
import { Drawer, Button, Row, Col, Space, Radio, Divider } from 'antd';
import { DownloadOutlined, AppstoreOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { fileDownload } from '@/utils';
import { UrlViewer } from '@/components/viewer/index';

import styles from './index.less';
import { getContent } from '@/tauri/storage/index';

export const FilePanel = (props: {
  id: number;
  parentId: number;
  fileHash: string;
  fileType: string;
  fileName: string;
  fileSize: string;
  category: string;
  visible: boolean;
  onClose: () => void;
}) => {
  const [radioValue, setRadioValue] = useState<string>('detail');

  const [preview, setPreview] = useState<any>();

  const getFileName = (file: any) => {
    if (file && file.fileName) {
      return file.fileName;
    }
    console.log(file);
    return '文件详情';
  };

  return (
    <Drawer
      className={classnames(styles.container)}
      title={getFileName(props)}
      placement="right"
      width={'80%'}
      onClose={props.onClose}
      visible={props.visible}
      extra={
        <div className={classnames(styles.tools)}>
          <div
            className={classnames(styles.button)}
            onClick={() => {
              //下载文件
              const call = async () => {
                let content = await getContent(props.fileHash);
                if (content != null) {
                  fileDownload(content, props.fileName, props.fileType);
                }
              };
              call();
            }}
          >
            <DownloadOutlined className={classnames(styles.download)} />
          </div>
        </div>
      }
    >
      <UrlViewer className={classnames()} url={`rrfile://ipfs/${props.fileHash}?filename=${props.fileName}`} fileType={props.fileType}></UrlViewer>
    </Drawer>
  );
};

export default FilePanel;
