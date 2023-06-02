import React from 'react';
import classnames from 'classnames';
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
import { SideList, SideListItem, } from '@/components/index';
import styles from './index.less';

export interface FileCategoriesProps {
    className?: string;
    category: string;
    onCategoryChange: (category: string) => Promise<any>
}

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

export const FileCategories: React.FC<FileCategoriesProps> = ({ className, category, onCategoryChange }) => {
    return (
        <div className={classnames(styles.container, className)}>
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
                                onCategoryChange(item.category);
                            }}
                        ></SideListItem>
                    );
                })
            }
        </div>
    );
};

export default FileCategories;