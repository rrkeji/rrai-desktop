use anyhow::{anyhow, Result};
use rusqlite::{
    types::FromSql,
    types::Value as SqliteValue,
    types::ValueRef::{Blob, Integer, Null, Real, Text},
    Connection, Params, Row, ToSql,
};
use serde_json::{Number, Value};
use std::{collections::HashMap, sync::Mutex};

pub fn query_one_value<P, V>(connection: &Connection, sql: &str, p: P) -> Result<V>
where
    P: Params,
    V: FromSql,
{
    let mut stmt = connection.prepare(sql)?;

    let result_iter = stmt.query_map(p, |row| Ok(row.get(0)?))?;

    for result in result_iter {
        if let Ok(i32_temp) = result {
            //table
            return Ok(i32_temp);
        }
    }
    Err(anyhow!(""))
}

pub fn rusqlite_row_to_value(row: &Row<'_>, cnt: usize) -> Result<Vec<Value>> {
    let mut cols = Vec::<Value>::new();
    for i in 0..cnt {
        let rusqlite_value = row.get_ref_unwrap(i);
        let idns_value = match rusqlite_value {
            Null => Value::Null,
            Integer(i64_v) => Value::Number(Number::from(i64_v)),
            Real(f64_v) => Value::Number(Number::from_f64(f64_v).map_or(Number::from(0i64), |r| r)),
            Text(str_v) => Value::String(String::from_utf8(str_v.to_vec()).unwrap()),
            Blob(v) => Value::Null,
        };
        cols.push(idns_value);
    }

    return Ok(cols);
}

pub fn rusqlite_row_to_map(_row: &Row<'_>, names: &Vec<String>) -> Result<HashMap<String, Value>> {
    let mut row = HashMap::default();
    for (i, name) in names.iter().enumerate() {
        let rusqlite_value = _row.get_ref_unwrap(i);
        let v = match rusqlite_value {
            Real(f64_v) => Value::Number(Number::from_f64(f64_v).map_or(Number::from(0i64), |r| r)),
            Integer(i64_v) => Value::Number(Number::from(i64_v)),
            Text(str_v) => Value::String(String::from_utf8(str_v.to_vec()).unwrap()),
            Blob(v) => Value::Null,
            _ => Value::Null,
        };
        row.insert(name.to_owned(), v);
    }
    Ok(row)
}

pub fn value_to_rusqlite_value(json_value: &Value) -> Result<SqliteValue> {
    return Ok(match json_value {
        Value::Null => SqliteValue::Null,
        Value::Number(v) => {
            if v.is_f64() {
                SqliteValue::Real(v.as_f64().unwrap() as f64)
            } else if v.is_i64() {
                SqliteValue::Integer(v.as_i64().unwrap())
            } else if v.is_u64() {
                SqliteValue::Integer(v.as_u64().unwrap().try_into().unwrap())
            } else {
                SqliteValue::Integer(0)
            }
        }
        Value::String(string_v) => SqliteValue::Text(string_v.clone()),
        _ => SqliteValue::Null,
    });
}
