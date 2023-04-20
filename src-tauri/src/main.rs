// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

mod commands;
mod plugins;
mod utils;

use std::error::Error;
use tauri::Manager;
use window_shadows::set_shadow;
fn main() -> Result<(), Box<dyn Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();
    tracing::info!("RRAI 启动...");

    // let (mut rx, mut child) = tauri::api::process::Command::new_sidecar("ipfs")
    //     .expect("failed to create `ipfs` binary command")
    //     .args(["daemon"])
    //     .spawn()
    //     .expect("Failed to spawn sidecar");

    // tauri::async_runtime::spawn(async move {
    //     // read events such as stdout
    //     while let Some(event) = rx.recv().await {
    //         if let tauri::api::process::CommandEvent::Stdout(line) = event {
    //             tracing::debug!("IPFS:{}", line);
    //         }
    //     }
    // });

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
        .plugin(plugins::sqlite::init())
        .invoke_handler(tauri::generate_handler![
            commands::system::cmds_system_process_exec
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
