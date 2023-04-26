import React, { useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Button, Collapse, Tooltip, Divider } from 'antd';
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
import classnames from 'classnames';

import styles from './left-sider.less';

const { Panel } = Collapse;

export interface CategoryItemEntity {
  title: string;
  icon: any;
  category: string;
}

const ALL_CATEGORIES = [
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
    category: '',
    icon: <EllipsisOutlined />,
  },
];

export const LeftSider = (props: {
  className?: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) => {
  return (
    <div className={classnames(props.className, styles.container)}>
      <div>
        <GroupItem
          title={'全部文件'}
          groupClick={() => {
            props.onChange(null);
          }}
          value={props.value}
          items={ALL_CATEGORIES}
          itemClick={(value) => {
            props.onChange(value);
          }}
        ></GroupItem>
        {/* <Divider style={{ margin: '10px 0' }}></Divider> */}
        {/* <GroupItem
          title={'回收站'}
          groupClick={() => {
            setCategory(-1);
          }}
        ></GroupItem>
        <Divider style={{ margin: '10px 0' }}></Divider>
        <GroupItem
          title={'快捷访问'}
          groupClick={() => {
            setCategory(-1);
          }}
        ></GroupItem> */}
      </div>
      <div>&nbsp;</div>
    </div>
  );
};

const GroupItem = (props: {
  className?: string;
  title: any;
  groupClick?: () => void;
  value: string | null;
  items?: Array<CategoryItemEntity>;
  itemClick?: (index: string) => void;
  children?: any;
}) => {
  const [expand, setExpand] = useState<boolean>(true);

  return (
    <div className={classnames(props.className, styles.group_item)}>
      <div
        className={classnames(
          props.value === null ? styles.selected : undefined,
          styles.category_item,
        )}
      >
        <div
          className={styles.icon}
          onClick={(e) => {
            setExpand(!expand);
            e && e.preventDefault && e.preventDefault();
            return false;
          }}
        >
          {expand ? <CaretDownOutlined /> : <CaretRightOutlined />}
        </div>
        <div
          className={styles.title}
          onClick={() => {
            props.groupClick && props.groupClick();
          }}
        >
          {props.title}
        </div>
      </div>
      {expand &&
        props.items &&
        props.items.length > 0 &&
        props.items.map((item, index) => {
          return (
            <CategoryItem
              className={classnames(
                item.category == props.value ? styles.selected : undefined,
              )}
              categoryIndex={index}
              key={index}
              title={item.title}
              icon={item.icon}
              onClick={() => {
                props.itemClick && props.itemClick(item.category);
              }}
            ></CategoryItem>
          );
        })}
    </div>
  );
};

const CategoryItem = (props: {
  className?: string;
  categoryIndex: number;
  title?: any;
  icon?: any;
  onClick?: (index: number, item: any) => void;
}) => {
  return (
    <div
      className={classnames(props.className, styles.category_item)}
      onClick={() => {
        props.onClick && props.onClick(props.categoryIndex, props);
      }}
    >
      {!!props.icon ? <div className={styles.icon}>{props.icon}</div> : ''}
      {!!props.title ? <div className={styles.title}>{props.title}</div> : ''}
    </div>
  );
};

export default LeftSider;
