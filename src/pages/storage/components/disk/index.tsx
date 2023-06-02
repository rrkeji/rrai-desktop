import React, { useState, useEffect } from 'react';

import { FileListLayout, FileGridLayout } from '../directory/index';
import { Breadcrumb, Button } from 'antd';
import { FileEntity, FileProvider } from '../file-provider';

import styles from './index.less';

export interface StorageDiskProps {
  provider: FileProvider;
  parentId: number;
  onParentChange: (parentId: number) => any;
  version: number;
  options: {
    layout: 'list' | 'grid';
    [key: string]: string
  };
}

export const StorageDisk: React.FC<StorageDiskProps> = ({ provider, options, parentId, onParentChange, version }) => {

  const { layout, category } = options;

  //当前选中的文件
  let [selected, setSelected] = useState<number>(0);
  //
  let [files, setFiles] = useState<Array<FileEntity>>([]);

  let [current, setCurrent] = useState<number[]>([0]);

  const [pathStack, setPathStack] = useState<Array<string>>(['/']);

  const [lastTime, setLastTime] = useState<number>(new Date().getTime());

  //
  useEffect(() => {
    if (!provider) {
      return;
    }
    //获取文件列表
    provider.listFiles(parentId, {}).then((values) => {
      setFiles(values);
    }).catch((err) => {
      console.log(err);
    });
  }, [provider, parentId, lastTime, category, version]);

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
              onParentChange(ids[ids.length - 1]);
              setCurrent(ids);
              setPathStack(titles);
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
          {showBreadcrumb(current, pathStack)}
        </Breadcrumb>
      </div>

      <div>
        {
          layout === 'list' && <FileListLayout
            className={styles.directory}
            parentId={parentId}
            provider={provider}
            files={files}
            selected={selected}
            onFileSelected={(fileId, file) => {
              setSelected(fileId);
            }}
            onFileEntry={(fileId, file) => {
              onParentChange(fileId);
              setCurrent(current.concat([fileId]));
              setPathStack(pathStack.concat([file.fileName]));
            }}
          ></FileListLayout>
        }
        {
          layout === 'grid' && <FileGridLayout
            className={styles.directory}
            parentId={parentId}
            provider={provider}
            files={files}
            selected={selected}
            onFileSelected={(fileId, file) => {
              setSelected(fileId);
            }}
            onFileEntry={(fileId, file) => {
              onParentChange(fileId);
              setCurrent(current.concat([fileId]));
              setPathStack(pathStack.concat([file.fileName]));
            }}
          ></FileGridLayout>
        }
      </div>
    </div>
  );
};

export default StorageDisk;
