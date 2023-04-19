

let started: boolean = false;

(async () => {
    if (started) {
        return;
    }
    console.log('--------init-------');
    //
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