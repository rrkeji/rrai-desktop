use rusqlite::{types::Value as SqliteValue, Connection, OpenFlags, ToSql};
use std::{collections::HashMap, sync::Mutex};
use tauri::{
    command,
    plugin::{Builder, TauriPlugin},
    Manager, Runtime, State,
};

use serde::{Serialize, Serializer};
use serde_json::{json, Value as JsonValue};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),
    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),
    #[error("database {0} not opened")]
    DatabaseNotOpened(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

type Result<T> = std::result::Result<T, Error>;

#[derive(Default)]
struct SqliteMap(Mutex<HashMap<String, Connection>>);

#[command]
async fn open(state: State<'_, SqliteMap>, path: String) -> Result<bool> {
    //到当前用户的目录的.rrai路径
    let mut storage_path = crate::utils::rrai_home_path()?.join("sqlite");
    storage_path.push(path.clone());

    let prefix = storage_path.parent().unwrap_or(storage_path.as_path());
    std::fs::create_dir_all(prefix).map_err(|err| anyhow::anyhow!(err))?;

    let connection = Connection::open(&storage_path)?;
    state.0.lock().unwrap().insert(path.clone(), connection);
    Ok(true)
}

#[command]
async fn open_with_flags(state: State<'_, SqliteMap>, path: String, iflags: i32) -> Result<bool> {
    let flags = OpenFlags::default();

    let connection = Connection::open_with_flags(&path, flags)?;
    state.0.lock().unwrap().insert(path.clone(), connection);
    Ok(true)
}

#[command]
async fn close(state: State<'_, SqliteMap>, path: String) -> Result<bool> {
    let mut map = state.0.lock().unwrap();
    let connection = map
        .get_mut(&path)
        .ok_or(Error::DatabaseNotOpened(path.clone()))?;
    drop(connection);
    map.remove(&path);
    Ok(true)
}

#[command]
async fn execute_sql(state: State<'_, SqliteMap>, path: String, sql: String) -> Result<usize> {
    let mut map = state.0.lock().unwrap();
    let connection = map.get_mut(&path).ok_or(Error::DatabaseNotOpened(path))?;

    let res = connection.execute(sql.as_str(), [])?;
    Ok(res)
}

#[command]
async fn execute_batch(state: State<'_, SqliteMap>, path: String, sql: String) -> Result<bool> {
    let mut map = state.0.lock().unwrap();
    let connection = map.get_mut(&path).ok_or(Error::DatabaseNotOpened(path))?;

    let res = connection.execute_batch(sql.as_str())?;
    Ok(true)
}

#[command]
async fn execute(
    state: State<'_, SqliteMap>,
    path: String,
    sql: String,
    args: JsonValue,
) -> Result<usize> {
    let mut map = state.0.lock().unwrap();
    let conn = map.get_mut(&path).ok_or(Error::DatabaseNotOpened(path))?;

    let mut args_sqlite_values = HashMap::<String, SqliteValue>::new();
    let mut named_args: Vec<(&str, &dyn ToSql)> = vec![];

    if let JsonValue::Object(json_value) = args {
        for (k, v) in json_value {
            args_sqlite_values.insert(
                k.clone(),
                super::rusqlite_utils::value_to_rusqlite_value(&v)?,
            );
            //
        }
    }

    for (k, v) in &args_sqlite_values {
        named_args.push((k, v as &dyn ToSql));
    }

    let res = conn.execute(sql.as_str(), &*named_args)?;
    return Ok(res);
}

#[command]
async fn query_with_args(
    state: State<'_, SqliteMap>,
    path: String,
    sql: String,
    args: JsonValue,
) -> Result<Vec<HashMap<String, JsonValue>>> {
    let mut map = state.0.lock().unwrap();
    let conn = map.get_mut(&path).ok_or(Error::DatabaseNotOpened(path))?;

    let mut stmt = conn.prepare(sql.as_str())?;

    let mut names: Vec<String> = Vec::new();
    for name in stmt.column_names() {
        names.push(name.to_string());
    }

    let mut args_sqlite_values = HashMap::<String, SqliteValue>::new();
    let mut named_args: Vec<(&str, &dyn ToSql)> = vec![];

    if let JsonValue::Object(json_value) = args {
        for (k, v) in json_value {
            args_sqlite_values.insert(
                k.clone(),
                super::rusqlite_utils::value_to_rusqlite_value(&v)?,
            );
        }
    }

    for (k, v) in &args_sqlite_values {
        named_args.push((k, v as &dyn ToSql));
    }

    let schema_iter = stmt.query_map(&*named_args, |row| {
        super::rusqlite_utils::rusqlite_row_to_map(row, &names)
            .map_err(|_e| rusqlite::Error::ExecuteReturnedResults)
    })?;

    let mut result = Vec::<HashMap<String, JsonValue>>::new();

    for table_result in schema_iter {
        if let Ok(row_value) = table_result {
            //
            result.push(row_value);
        }
    }
    Ok(result)
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("sqlite")
        .invoke_handler(tauri::generate_handler![
            open,
            open_with_flags,
            query_with_args,
            close,
            execute_sql,
            execute_batch,
            execute
        ])
        .setup(|app| {
            app.manage(SqliteMap::default());
            Ok(())
        })
        .build()
}
