import React, { useState, useEffect, useCallback } from 'react';
import { history, useLocation, useParams } from 'umi';
import { SideList, SideListItem, } from '@/components/index';
import {
  FileEntity,
  createDir,
  addContent,
  createFile,
  updateFile,
} from '@/tauri/storage/index';
import { StorageDisk, StorageHeaderBar } from '@/components/storage';
import { getAsByteArray, getFileCategory } from '@/utils';
import { LeftSider } from './left-sider';
import classnames from 'classnames';
import styles from './index.less';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  EllipsisOutlined,
  CustomerServiceOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  PlaySquareOutlined,
  FilePdfOutlined,
  PictureOutlined,
} from '@ant-design/icons';

import { Button, Divider, Empty, RadioChangeEvent } from 'antd';
import { datasetRowsSearchByModelId } from '@/tauri/idns/index';
import { Modal, Input, Radio, Card, Typography, Tabs, Skeleton, Pagination, Spin } from 'antd';
import { ipfsStringContentByCid } from '@/tauri/idns/index';

const { Title, Paragraph } = Typography;

import HPG_PNG from '@/assets/hbg.png';

const { Search } = Input;

const ALL_CATEGORIES = [
  {
    title: '所有文件',
    category: '',
    icon: <PictureOutlined />,
  },
  {
    title: '图片',
    category: 'IMAGE',
    icon: <PictureOutlined />,
  },
  {
    title: '模型',
    category: 'AIMODEL',
    icon: <VideoCameraOutlined />,
  },
  {
    title: '文档',
    category: 'DOCUMENT',
    icon: <FilePdfOutlined />,
  },
  {
    title: '视频',
    category: 'VIDEO',
    icon: <VideoCameraOutlined />,
  },
  {
    title: '音频',
    category: 'AUDIO',
    icon: <CustomerServiceOutlined />,
  },
  {
    title: '其他',
    category: 'OTHERS',
    icon: <EllipsisOutlined />,
  },
];

export default function DiscoveryPage() {

  const [active, setActive] = useState<'local' | 'cloud'>('local');

  const [loading, setLoading] = useState<boolean>(false);

  const [layout, setLayout] = useState<string>('list');

  const [lastTime, setLastTime] = useState<number>(new Date().getTime());

  const [visible, setVisible] = useState<boolean>(false);

  const [dirName, setDirName] = useState<string>('');

  const [currentId, setCurrentId] = useState<number>(0);

  const [current, setCurrent] = useState<Array<number>>([0]);

  const [category, setCategory] = useState<string | null>(null);

  const [pathStack, setPathStack] = useState<Array<string>>(['/']);

  useEffect(() => {
    //
  }, [active]);


  const onMkdir = useCallback(() => {
    //创建文件夹
    setVisible(true);
  }, []);

  const uploadProps = {
    name: 'file',
    action: async (file: File) => {
      //上传到IPFS， 并获取到CID
      let bytes = await getAsByteArray(file);
      if (bytes != null) {
        let res = await addContent(bytes);
        console.log(res);
        if (res != null) {
          let request = new FileEntity();
          request.setParentId(currentId);
          request.setFileHash(res);
          request.setFileName(file.name);
          // request.setFileSize(file.size);
          request.setFileType(file.type);
          request.setIsDir(false);
          request.setCategory(getFileCategory(file.type));

          console.log(request, 'upload file');

          let insertFileResponse = await createFile(request);
          console.log(insertFileResponse);
          setLastTime(new Date().getTime());
        }
        return res;
      }
      return null;
    },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log('uploading', info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        //{code:0,message:'',data:[cid]}
        console.log('done.....', info);
        //当前的目录，进行添加

        // message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
          <StorageHeaderBar
            className={styles.header}
            layout={layout}
            uploadProps={uploadProps}
            onMkdir={onMkdir}
            onLayoutChange={(layout: string) => {
              setLayout(layout);
            }}
            onRefresh={() => {
              setLastTime(new Date().getTime());
            }}
          ></StorageHeaderBar>
        </div>
      </div>
      <div className={classnames(styles.content)}>
        <div data-tauri-drag-region className={styles.left}>
          <SideList className={styles.side}>
            {
              ALL_CATEGORIES && ALL_CATEGORIES.map((item: any, index: number) => {
                return (
                  <SideListItem
                    key={index}
                    className={classnames(styles.side_item)}
                    active={item.category === category}
                    title={item.title}
                    avatar={item.icon}
                    avatarBackground={'#dedede'}
                    timestamp={''}
                    rightBar={
                      <div></div>
                    }
                    onClick={() => {
                      //
                      setCategory(item.category);
                    }}
                  ></SideListItem>
                );
              })
            }
          </SideList>
        </div>
        <div className={classnames(styles.center)}>
          <StorageDisk
            fileId={currentId}
            current={current}
            pathStack={pathStack}
            layout={layout}
            category={category}
            lastTime={lastTime}
            onCurrentChange={(current: Array<number>, items: Array<any>) => {
              setCurrentId(current[current.length - 1]);
              setCurrent(current);
              setPathStack(items);
              setLastTime(new Date().getTime());
            }}
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
          //发送后台请求，新建文件夹
          setLoading(true);
          setVisible(false);
          const call = async () => {
            let currentPathItem = pathStack[pathStack.length - 1];
            //创建文件夹，先插入一个file item， 然后修改当前文件夹
            let res = await createDir(currentId, dirName);
            console.log(res);
            //修改当前的文件夹
            if (res) {
              // //上传完文件要更新父对象中的值
              setLastTime(new Date().getTime());
            }
            setLoading(false);
          };
          call();
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

