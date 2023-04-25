// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

mod commands;
mod plugins;
mod services;
mod utils;

use std::error::Error;
use tauri::Manager;
use window_shadows::set_shadow;

fn main() -> Result<(), Box<dyn Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();
    tracing::info!("RRAI 启动...");

    //启动服务管理
    tauri::async_runtime::spawn(async move {
        //
        // let _ = services::MAIN_SERVICE_MANAGER.launch().await;
    });

    tauri::Builder::default()
        .setup(move |app| {
            // let window = app.get_window("main").unwrap();
            // set_shadow(&window, true).expect("Unsupported platform!");
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .plugin(rrai_desktop_sdk::plugins::appbox::init())
        .plugin(rrai_desktop_sdk::plugins::idns::init())
        .plugin(rrai_desktop_sdk::plugins::sqlite::init())
        .plugin(rrai_desktop_sdk::plugins::ipfs::init())
        .plugin(rrai_desktop_sdk::plugins::substrate::init())
        .invoke_handler(tauri::generate_handler![
            commands::system::cmds_system_process_exec
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
