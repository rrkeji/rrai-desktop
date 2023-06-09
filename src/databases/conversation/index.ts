
export * from './types';

import V1 from './1.0.1';
import V2 from './1.0.2';

import { mergeDbVersion, DatabaseVersionSql } from '../db-version';

export const CONVERSATION_DB_NAME = "./conversation.sqlite";

const versions: Array<DatabaseVersionSql> = [V1, V2];

export const init_conversation = async () => {

    await mergeDbVersion(CONVERSATION_DB_NAME, versions);
};