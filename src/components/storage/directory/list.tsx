import React, { useRef, useState } from 'react';
import Icon from '@ant-design/icons';
import classnames from 'classnames';
import { Space, Table } from 'antd';
import { DirectorySvg, getFileSvg } from './file-icon';
import { FilePanel } from '../file-panel';
import { deleteFile, updateFile } from '@/tauri/storage/index';
import styles from './list.less';

export const FileEntryInDirectory = (props: any) => {
  //isDir false 文件 true 文件夹
  return (
    <div className={styles.fileEntry}>
      <div className={styles.fileIconContainer}>
        {props.isDir ? (
          <DirectorySvg
            className={classnames(styles.fileIcon, styles.fileDirIcon)}
            color={'#FFD23D'}
          />
        ) : (
          getFileSvg(props.fileName, {
            className: styles.fileIcon,
            color: '#FFD23D',
          })
        )}
      </div>
      <div className={styles.fileName}>{props.fileName}</div>
    </div>
  );
};

export const FileListLayout = (props: {
  fileId: number;
  files: any;
  current: Array<number>;
  pathStack: Array<string>;
  onCurrentChange: (current: Array<number>, path: Array<string>) => void;
  onSelected: (select: Array<string>, selectedIndexs?: Array<number>) => void;
  className?: string;
}) => {
  const ref = useRef<any>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);

  const [selectedFile, setSelectedFile] = useState<any>();

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const columns: any = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      copyable: true,
      ellipsis: true,
      render: (text: string, record: any) => (
        <FileEntryInDirectory {...record}></FileEntryInDirectory>
      ),
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      copyable: true,
      ellipsis: true,
      render: (text: string, record: any) => {
        if (record.isDir) {
          return <Space size="middle">-</Space>;
        } else {
          let size = 0;
          try {
            size = parseInt(record.fileSize);
          } catch (e) {
            console.error(e);
          }
          //装换为M或者G
          let sizeStr = '-';
          if (size < 1024) {
            sizeStr = size + '';
          } else if (size < 1024 * 1024) {
            sizeStr = (size / 1024).toFixed(2) + 'K';
          } else {
            sizeStr = (size / (1024 * 1024)).toFixed(2) + 'M';
          }
          return (
            <Space size="middle" className={styles.fileSize}>
              {sizeStr}
            </Space>
          );
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'opertate',
      key: 'opertate',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              const call = async () => {
                //刷新列表
                await deleteFile(record.id);
                props.onCurrentChange([...props.current], [...props.pathStack]);
              };
              call();
            }}
          >
            删除
          </a>
          <a
            onClick={() => {
              //
              setDrawerVisible(true);
            }}
          >
            详情
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className={classnames(styles.container, props.className)}>
      <Table
        rowSelection={
          {
            // selectedRowKeys,
            // onChange: () => { }
          }
        }
        onRow={(record) => {
          return {
            onClick: (event) => {
              setSelectedFile(record);
            }, // 点击行
            onDoubleClick: (event) => {
              //进入下一层
              if (record.isDir) {
                //
                props.onCurrentChange(
                  [...props.current, record.id],
                  [...props.pathStack, record.fileName],
                );
              } else {
                //文件的预览界面
              }
            },
            onContextMenu: (event) => { },
            onMouseEnter: (event) => { }, // 鼠标移入行
            onMouseLeave: (event) => { },
          };
        }}
        columns={columns}
        dataSource={props.files}
        size="small"
        rowKey="id"
        pagination={false}
      />
      <FilePanel
        {...selectedFile}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
      ></FilePanel>
    </div>
  );
};

export default FileListLayout;
