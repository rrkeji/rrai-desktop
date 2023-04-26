import React, { useState, useEffect } from 'react';

import { listFiles, listFilesByCategory } from '@/tauri/storage/index';
import { Directory } from '../directory';
import { StorageHeaderBar } from '../header-bar';
import { Breadcrumb, Button } from 'antd';
import styles from './index.less';

export const StorageDisk = (props: {
  layout: string;
  category: string | null;
  fileId: number;
  current: Array<number>;
  pathStack: Array<string>;
  lastTime: number;
  onCurrentChange: (current: Array<number>, items: Array<string>) => void;
}) => {
  let [files, setFiles] = useState<
    Array<{
      id: number;
      fileHash: string;
      fileName: string;
      fileSize: number;
      fileType: string;
      isDir: true;
      parentId: number;
    }>
  >([]);

  useEffect(() => {
    //
    const call = async () => {
      let res;
      if (props.category === null) {
        res = await listFiles(props.fileId);
      } else {
        res = await listFilesByCategory(props.fileId, props.category, 10000);
      }

      if (res && res.length > 0) {
        let list = res
          .map((item: any) => {
            console.log(item);
            return {
              id: item.id,
              fileHash: item.file_hash,
              fileName: item.file_name,
              fileSize: 0,
              fileType: item.file_type,
              isDir: item.is_dir,
              parentId: item.parent_id,
            };
          })
          .sort((item1: any, item2: any) => {
            let is_dir = item1.isDir ? 1 : 0;
            let is_dir2 = item2.isDir ? 1 : 0;
            if (is_dir2 !== is_dir) {
              return is_dir2 - is_dir;
            }
            return item1.id - item2.id;
          });
        console.log('文件列表', list);
        setFiles(list);
      } else {
        setFiles([]);
      }
    };
    //
    call();
  }, [props.fileId, props.lastTime, props.category]);
  //

  const showBreadcrumb = (current: Array<number>, paths: Array<string>) => {
    if (!current) {
      return <></>;
    }
    return paths.map((item: any, index: number) => {
      //获取到path
      let ids = current.slice(0, index + 1);
      let titles = paths.slice(0, index + 1);

      let title = item;
      if (title == '/') {
        title = '全部文件';
      }
      return (
        <Breadcrumb.Item key={index}>
          <Button
            type={'link'}
            onClick={() => {
              props.onCurrentChange(ids, titles);
            }}
          >
            {title}
          </Button>
        </Breadcrumb.Item>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Breadcrumb>
          {showBreadcrumb(props.current, props.pathStack)}
        </Breadcrumb>
      </div>
      <Directory
        className={styles.directory}
        fileId={props.fileId}
        layout={props.layout}
        files={files}
        currentPath={''}
        current={props.current}
        pathStack={props.pathStack}
        onCurrentChange={(str: Array<number>, itemArray: Array<string>) => {
          //
          props.onCurrentChange(str, itemArray);
        }}
        onSelected={(
          selected: Array<string>,
          selectedIndexs?: Array<number>,
        ) => { }}
      ></Directory>
    </div>
  );
};

export default StorageDisk;
