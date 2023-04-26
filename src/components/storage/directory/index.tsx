import React from 'react';
import Icon from '@ant-design/icons';
import classnames from 'classnames';

import { FileListLayout } from './list';
import { FileGridLayout } from './grid';

import styles from './index.less';

export const Directory = (props: {
  fileId: number;
  layout: string;
  files: any;
  currentPath: string;
  current: Array<number>;
  pathStack: Array<string>;
  onCurrentChange: (current: Array<number>, path: Array<string>) => void;
  onSelected: (select: Array<string>, selectedIndexs?: Array<number>) => void;
  className?: string;
}) => {
  return (
    <div className={classnames(styles.container, props.className)}>
      {props.layout === 'list' ? (
        <FileListLayout className={styles.content} {...props}></FileListLayout>
      ) : (
        <FileGridLayout className={styles.content} {...props}></FileGridLayout>
      )}
    </div>
  );
};

export default Directory;
