import React from 'react';
import classnames from 'classnames';
import { Row, Col } from 'antd';

import styles from './card-select.less';

interface CardSelectOptionProps {
    className?: string;
    value: string;
    selected: boolean;
    icon: React.ReactNode,
    title: React.ReactNode | string,
    onClick?: (value: string) => void;
}

const CardSelectOption: React.FC<CardSelectOptionProps> = ({ className, selected, icon, title, value, onClick }) => {

    return (
        <div className={classnames(styles.option, className, selected && styles.selected)} onClick={() => {
            onClick && onClick(value);
        }}>
            <div className={classnames(styles.icon)}>{icon}</div>
            <div className={classnames(styles.title)}>{title}</div>
        </div>
    );
};

export interface CardSelectProps {
    className?: string;
    items: Array<{
        value: string;
        icon: React.ReactNode,
        title: React.ReactNode | string,
    }>;
    value: string;
    onValueChange?: (value: string) => Promise<void> | void;
}

export const CardSelect: React.FC<CardSelectProps> = ({ className, items, value, onValueChange }) => {

    return (
        <Row className={classnames(styles.container, className)} gutter={[18, 18]}>
            {
                items && items.map((item, index) => {
                    return (
                        <Col
                            key={index}>
                            <CardSelectOption
                                className={classnames(styles.item)}
                                value={item.value}
                                selected={item.value === value}
                                icon={item.icon}
                                title={item.title}
                                onClick={(value) => {
                                    onValueChange && onValueChange(value);
                                }}
                            ></CardSelectOption>
                        </Col>
                    );
                })
            }
        </Row>
    );
};

export default CardSelect;