// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

mod commands;
mod plugins;

use std::error::Error;
use tauri::Manager;
use window_shadows::set_shadow;
fn main() -> Result<(), Box<dyn Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();
    tracing::info!("RRAI 启动...");

    tauri::Builder::default()
        .setup(move |app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .plugin(plugins::sqlite::init())
        .invoke_handler(tauri::generate_handler![
            commands::system::cmds_system_process_exec
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
