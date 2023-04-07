import { systemProcessExec } from '@/tauri/index';



export const checkPython3 = async (): Promise<boolean | null> => {

    let res = await systemProcessExec("python3 --version");

    //
    return true;
}