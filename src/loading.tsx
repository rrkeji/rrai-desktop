import { setContextValue } from "./tauri";
import { getToken } from "./utils";


let started: boolean = false;

(async () => {
    if (started) {
        return;
    }
    console.log('--------init-------');
    //
    let token = getToken();
    if (token) {
        setContextValue('rrai_token', token);
    }
    //
    started = true;
})();



export const Loading = () => {

    return (
        <>
        </>
    );
};

export default Loading;