

import { DatabaseVersionSql } from '../db-version';

const v1: DatabaseVersionSql = {
    version: 1,
    before: async (): Promise<any> => {

        return;
    },
    ddl: [
        "CREATE TABLE conversation (`id` INTEGER PRIMARY KEY, `uid` TEXT DEFAULT '', `category` TEXT DEFAULT '', `name` TEXT DEFAULT '', `avatar` TEXT DEFAULT '',`args` TEXT DEFAULT '{}', created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, unique(category,name));",
        "CREATE TABLE messages (`id` INTEGER PRIMARY KEY, `conversation_uid` TEXT DEFAULT '', `conversation_category` TEXT DEFAULT '',  `sender_type` TEXT DEFAULT '', `sender_id` TEXT DEFAULT '', `avatar` TEXT DEFAULT '', `bot_role` TEXT DEFAULT '',`model_id` TEXT DEFAULT '',`model_options` TEXT DEFAULT '',`text` TEXT DEFAULT '', `typing` TEXT DEFAULT 'false',`purpose_id` TEXT DEFAULT '', `tokens_count` INTEGER DEFAULT 0,created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP);",
        `
        CREATE TRIGGER conversation_updated AFTER UPDATE  ON conversation
        BEGIN
            UPDATE conversation SET updated=CURRENT_TIMESTAMP WHERE id = new.id;
        END;
        `,
        `
        CREATE TRIGGER messages_updated AFTER UPDATE  ON messages
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