import React from 'react';
import classnames from 'classnames';
import { Row, Col, Select } from 'antd';
const { Option } = Select;

import styles from './image-select.less';

interface ImageSelectOptionProps {
    className?: string;
    value: string;
    selected: boolean;
    icon: React.ReactNode,
    title: React.ReactNode | string,
    onClick?: (value: string) => void;
}

const ImageSelectOption: React.FC<ImageSelectOptionProps> = ({ className, selected, icon, title, value, onClick }) => {

    return (
        <div className={classnames(styles.option, className, selected && styles.selected)} onClick={() => {
            onClick && onClick(value);
        }}>
            <div className={classnames(styles.icon)}>{icon}</div>
            <div className={classnames(styles.title)}>{title}</div>
        </div>
    );
};

export interface ImageSelectProps {
    className?: string;
    items: Array<{
        key: string;
        data: any,
        value: React.ReactNode | string,
    }>;
    value: string;
    onValueChange?: (value: string) => Promise<void> | void;
}

export const ImageSelect: React.FC<ImageSelectProps> = ({ className, items, value, onValueChange }) => {

    return (
        <Select className={classnames(styles.container, className)} value={value} onChange={(val) => {
            onValueChange && onValueChange(val);
        }}>
            {
                items && items.map((item, index) => {
                    return (
                        <Option
                            key={index}
                            value={item.key}
                        >
                            {item.value}
                        </Option>
                    );
                })
            }
        </Select>
    );
};

export default ImageSelect;