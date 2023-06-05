import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface TaskLogViewProps {
    className?: string;
    lineClassName?: string;
    logs: Array<string>;
    title?: string;
}

export const TaskLogView: React.FC<TaskLogViewProps> = ({ className, logs, title, lineClassName }) => {
    return (
        <div className={classnames(styles.container, className)}>
            {
                title && (
                    <div>{title}</div>
                )
            }
            {
                logs && logs.map((line, index) => {
                    return (
                        <div key={index} className={classnames(styles.line, lineClassName)}>
                            {index}.{line}
                        </div>
                    );
                })
            }
        </div>
    );
};


export default TaskLogView;