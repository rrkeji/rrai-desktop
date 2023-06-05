import { SQLite } from '@/tauri/sqlite/index';


export type DatabaseVersionSql = {
    version: number;
    before: () => Promise<any>;
    ddl: Array<string>;
    after: () => Promise<any>
};

export const getVersion = async (dbName: string): Promise<number> => {
    const dbversion = await SQLite.open(dbName);

    //查询是否有该表
    const rows = await dbversion.queryWithArgs<Array<{ count: number }>>("SELECT count(1) count FROM sqlite_master WHERE type='table' and name = 'databases_version' ");

    console.log(rows);
    if (!!rows && rows.length > 0 && rows[0].count > 0) {

    } else {
        //创建表
        await dbversion.execute(`CREATE TABLE databases_version (name TEXT, version INTEGER, unique(name));`)
    }

    //查询
    const versions = await dbversion.queryWithArgs<Array<{ version: number }>>("SELECT version FROM databases_version WHERE name = :name", { ':name': dbName });

    if (!!versions && versions.length > 0) {
        return versions[0].version;
    }

    return 0;
}

export const setVersion = async (dbName: string, version: number): Promise<boolean> => {
    const dbversion = await SQLite.open(dbName);

    //查询是否存在
    await dbversion.execute(`INSERT INTO databases_version (name, version)VALUES ('${dbName}', ${version}) ON CONFLICT(name) DO UPDATE SET version = ${version}`)
    return true;
}

/**
 * 
 * @param dbName 
 * @param versionList 
 */
export const mergeDbVersion = async (dbName: string, versionList: Array<DatabaseVersionSql>) => {

    //获取所有的版本，并排序
    let vlist = versionList.sort((v1, v2) => {
        return v1.version - v2.version;
    });

    let version = await getVersion(dbName);
    console.log(version, vlist);

    let db = await SQLite.open(dbName);

    let newVersion = version;

    for (let i = 0; i < vlist.length; i++) {
        let item = vlist[i];
        console.log('version....', item.version, version);
        if (item.version > version) {
            try {
                //before
                await item.before();
                //dll
                for (let j = 0; j < item.ddl.length; j++) {
                    let sql = item.ddl[j];
                    await db.execute(sql);
                }
                //after
                await item.after();
            } catch (error) {
                console.error(error);
            }
            newVersion = item.version;
        }
    }
    //设置为最新的版本
    setVersion(dbName, newVersion);
}