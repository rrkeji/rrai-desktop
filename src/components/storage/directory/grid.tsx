import React, { useRef, useState } from 'react';
import Icon from '@ant-design/icons';
import classnames from 'classnames';
import { DirectorySvg, getFileSvg } from './file-icon';

import styles from './grid.less';

export const FileEntryInDirectory = (props: {
  id: number;
  fileHash: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isDir: true;
  parentId: number;
  current: Array<number>;
  pathStack: Array<any>;
  onCurrentChange: (current: Array<number>, path: Array<string>) => void;
}) => {
  return (
    <div
      className={styles.fileEntry}
      onDoubleClick={() => {
        //进入下一层
        if (props.isDir) {
          //
          props.onCurrentChange(
            [...props.current, props.id],
            [...props.pathStack, props.fileName],
          );
        } else {
          //文件的预览界面
        }
      }}
    >
      <div className={styles.fileIconContainer}>
        {props.isDir ? (
          <DirectorySvg className={styles.fileIcon} color={'#FFD23D'} />
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

export const FileGridLayout = (props: {
  fileId: number;
  files: any;
  current: Array<number>;
  pathStack: Array<any>;
  onCurrentChange: (current: Array<number>, path: Array<string>) => void;
  onSelected: (select: Array<string>, selectedIndexs?: Array<number>) => void;
  className?: string;
}) => {
  return (
    <div className={classnames(styles.container, props.className)}>
      {props.files.map((file: any, index: number) => (
        <FileEntryInDirectory
          key={index}
          {...file}
          current={props.current}
          pathStack={props.pathStack}
          onCurrentChange={props.onCurrentChange}
        />
      ))}
    </div>
  );
};

export default FileGridLayout;
