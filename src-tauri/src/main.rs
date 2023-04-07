// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

mod commands;

fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();
    tracing::info!("RRAI 启动...");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::system::cmds_system_process_exec
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
