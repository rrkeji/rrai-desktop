use std::process::Command;

#[tauri::command]
pub async fn cmds_system_process_exec(command: String) -> Result<(Option<i32>, String), String> {
    //
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .arg("/C")
            .arg(command)
            .output()
            .map_err(|err| format!("调用命令失败:{}", err))?
    } else {
        Command::new("sh")
            .arg("-c")
            .arg(command)
            .output()
            .map_err(|err| format!("调用命令失败:{}", err))?
    };

    let status = output.status;
    let stdout = output.stdout;
    let stderr = output.stderr;

    if status.success() {
        Ok((status.code(), String::from_utf8_lossy(&stdout).to_string()))
    } else {
        Ok((status.code(), String::from_utf8_lossy(&stderr).to_string()))
    }
}
