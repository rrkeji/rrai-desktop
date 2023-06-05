import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { FileListLayout, FileGridLayout } from '../directory/index';
import { Breadcrumb, Button, Pagination, Divider, Spin } from 'antd';
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
  const [selected, setSelected] = useState<number>(0);
  //
  const [files, setFiles] = useState<Array<FileEntity>>([]);

  const [current, setCurrent] = useState<number[]>([0]);

  const [pathStack, setPathStack] = useState<Array<string>>(['/']);

  const [lastTime, setLastTime] = useState<number>(new Date().getTime());

  const [page, setPage] = useState<number>(1);

  const [pageSize, setPageSize] = useState<number>(5);

  const [total, setTotal] = useState<number>(0);

  const [keywords, setKeywords] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const refresh = (parentId: number, category: string, pageSize: number, page: number, keywords: string) => {
    if (!provider) {
      return;
    }
    setLoading(true);
    //获取文件列表
    provider.listFiles(parentId, {
      category: category,
      page: page,
      pageSize: pageSize,
      keyword: keywords
    }).then((values) => {
      setFiles(values);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      //TODO
      setLoading(false);
    });
  };

  //
  useEffect(() => {

    refresh(parentId, category, pageSize, page, keywords);
  }, [provider, parentId, lastTime, category, version, pageSize, page, keywords]);

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
  if (loading) {
    return (
      <div className={classnames(styles.container, styles.loading_container)}>
        <Spin></Spin>
      </div>
    );
  }

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
        <Divider></Divider>
        <Pagination
          total={total}
          current={page}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onChange={(newPage, nePpageSize) => {
            console.log(newPage, nePpageSize);
            refresh(parentId, category, nePpageSize, newPage, keywords);
          }}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
          }} />
      </div>
    </div>
  );
};

export default StorageDisk;
