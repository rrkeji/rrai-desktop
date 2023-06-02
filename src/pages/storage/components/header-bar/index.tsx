import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

export type StorageHeaderBarProps = React.PropsWithChildren<{
  className?: string;
}>;

export const StorageHeaderBar: React.FC<StorageHeaderBarProps> = ({ className, children }) => {

  return (
    <div data-tauri-drag-region className={classnames(styles.container, className)}>
      {children}
    </div>
  );
};

export interface StorageHeaderItemProps {
  className?: string;
  icon: React.ReactNode;
  onClick: () => any;
  disabled?: boolean;
}

export const StorageHeaderIconItem: React.FC<StorageHeaderItemProps> = ({ className, icon, onClick, disabled }) => {

  return (
    <div className={classnames(styles.button)} onClick={onClick}>
      {icon}
    </div>
  );
};

export default StorageHeaderBar;
