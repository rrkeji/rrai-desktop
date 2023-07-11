

import { DatabaseVersionSql } from '../db-version';

const v1: DatabaseVersionSql = {
    version: 1,
    before: async (): Promise<any> => {

        return;
    },
    ddl: [
        "CREATE TABLE tasks (`id` INTEGER PRIMARY KEY, `category` TEXT DEFAULT '',  `task_type` TEXT DEFAULT '', `request_task_id` TEXT DEFAULT '', `name` TEXT DEFAULT '', `ability` TEXT DEFAULT '', `args` TEXT DEFAULT '', `result_code` INTEGER DEFAULT 0, `result` TEXT DEFAULT '', `cover_image` TEXT DEFAULT '',`stdout` TEXT DEFAULT '',`stderr` TEXT DEFAULT '', `progress` TEXT DEFAULT 0,`shared_message_id` TEXT DEFAULT '',`is_shared` INTEGER DEFAULT 0,`status` INTEGER DEFAULT 1,created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
        `
        CREATE TRIGGER tasks AFTER UPDATE  ON messages
        BEGIN
            UPDATE messages SET updated=CURRENT_TIMESTAMP WHERE id = new.id;
        END;
        `
    ],
    after: async (): Promise<any> => {

        return;
    }
};
export default v1;