

import { DatabaseVersionSql } from '../db-version';

const v2: DatabaseVersionSql = {
    version: 2,
    before: async (): Promise<any> => {

        return;
    },
    ddl: [
        "ALTER TABLE conversation ADD `is_shared` INTEGER DEFAULT 0;",
        "ALTER TABLE conversation ADD `shared_message_id` TEXT DEFAULT '';",
        "ALTER TABLE messages ADD `is_shared` INTEGER DEFAULT 0;",
        "ALTER TABLE messages ADD `shared_message_id` TEXT DEFAULT '';",
    ],
    after: async (): Promise<any> => {

        return;
    }
};
export default v2;