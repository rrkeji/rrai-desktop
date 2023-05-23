import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface TaskLogViewProps {
    className?: string;
    lineClassName?: string;
    logs: Array<string>;
}

export const TaskLogView: React.FC<TaskLogViewProps> = ({ className, logs, lineClassName }) => {
    return (
        <div className={classnames(styles.container, className)}>
            {
                logs && logs.map((line, index) => {
                    return (
                        <div key={index} className={classnames(styles.line, lineClassName)}>
                            {line}
                        </div>
                    );
                })
            }
        </div>
    );
};

export default TaskLogView;