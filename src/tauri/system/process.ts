


import { invoke } from '@tauri-apps/api/tauri';


export const systemProcessExec = async (command: string): Promise<{ code: number, stdout: string, stderr: string } | null> => {

    let response = await invoke("cmds_system_process_exec", {
        command: command
    });

    console.log(response);

    return null;
}