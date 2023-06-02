import React, { useRef, useState } from 'react';
import Icon from '@ant-design/icons';
import classnames from 'classnames';
import { DirectorySvg, getFileSvg } from './file-icon';
import { FileEntity, FileProvider } from '../file-provider';
import styles from './grid.less';

export interface FileGridLayoutProps {
  className?: string;
  provider: FileProvider;
  parentId: number;
  selected: number;
  files: FileEntity[];
  onFileSelected?: (fileId: number, file: FileEntity) => any;
  onFileEntry: (fileId: number, file: FileEntity) => any;
}


export const FileGridLayout: React.FC<FileGridLayoutProps> = ({ className, provider, files, onFileSelected, onFileEntry }) => {

  return (
    <div className={classnames(styles.container, className)}>
      {
        files.map((file: FileEntity, index: number) => {
          return (
            <div
              className={styles.fileEntry}
              onDoubleClick={() => {
                //进入下一层
                if (file.isDir) {
                  //
                } else {
                  //文件的预览界面
                }
              }}
            >
              <div className={styles.fileIconContainer}>
                {file.isDir ? (
                  <DirectorySvg className={styles.fileIcon} color={'#FFD23D'} />
                ) : (
                  getFileSvg(file.fileName, {
                    className: styles.fileIcon,
                    color: '#FFD23D',
                  })
                )}
              </div>
              <div className={styles.fileName}>{file.fileName}</div>
            </div>
          );
        })
      }
    </div>
  );
};

export default FileGridLayout;
