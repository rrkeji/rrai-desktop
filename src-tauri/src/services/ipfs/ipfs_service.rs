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

use crate::services::EnableManagedService;
use async_trait::async_trait;

pub struct IpfsService {}

#[async_trait]
impl EnableManagedService for IpfsService {
    async fn start(&self) {
        //
        let (mut rx, mut child) = tauri::api::process::Command::new_sidecar("ipfs")
            .expect("failed to create `ipfs` binary command")
            .args(["daemon"])
            .spawn()
            .expect("Failed to spawn sidecar");

        // read events such as stdout
        while let Some(event) = rx.recv().await {
            if let tauri::api::process::CommandEvent::Stdout(line) = event {
                tracing::debug!("IPFS:{}", line);
            }
        }
    }
}
