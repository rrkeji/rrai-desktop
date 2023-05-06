import { invoke } from '@tauri-apps/api/tauri'

export class SQLite {
    path: string

    constructor(path: string) {
        this.path = path
    }

    static async open(path: string): Promise<SQLite> {
        let res = await invoke<string>('plugin:rrai-sqlite|open', { path });
        console.log(res);
        return new SQLite(path);
    }

    async close(): Promise<boolean> {
        return await invoke('plugin:rrai-sqlite|close', { path: this.path })
    }

    async execute(sql: string, values?: Record<string, any>): Promise<boolean> {
        return values ? await invoke('plugin:rrai-sqlite|execute', { path: this.path, sql, args: values }) : await invoke('plugin:rrai-sqlite|execute_sql', { path: this.path, sql })
    }

    async queryWithArgs<T>(sql: string, values?: Record<string, any>): Promise<T> {
        return await invoke('plugin:rrai-sqlite|query_with_args', { path: this.path, sql, args: values ?? {} })
    }
}

export default SQLite;