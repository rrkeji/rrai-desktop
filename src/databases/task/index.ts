
export * from './types';

import V1 from './1.0.1';

import { mergeDbVersion, DatabaseVersionSql } from '../db-version';

export const TASKS_DB_NAME = "./tasks.sqlite";

const versions: Array<DatabaseVersionSql> = [V1];

export const init_tasks = async () => {

    await mergeDbVersion(TASKS_DB_NAME, versions);
};