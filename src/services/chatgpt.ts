
export const runAssistant = async (
    messages: Array<{
        role: 'assistant' | 'system' | 'user',
        content: string
    }>,
    onBeforeRequest: () => void,
    onMessage: (message: string) => Promise<void>,
    onFinish: (result: boolean, message: string) => Promise<void>) => {

    let modelTemperature = .8;
    let modelMaxResponseTokens = 4000;

    const payload: any = {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: modelTemperature,
        max_tokens: modelMaxResponseTokens,
    };

    console.log(payload.messages, '====');

    try {

        const requestWebsocket = (payload: any): Promise<any> => {

            return new Promise((resolve, reject) => {
                let websocket = new WebSocket('wss://wsschat.idns.link/desktop/');

                //调用接口
                let incrementalText = '';
                //payload.messages[payload.messages.length - 1].content
                websocket.onopen = (evt) => {
                    console.log(evt);
                    setTimeout(() => {
                        websocket.send(JSON.stringify({
                            cmd: "ChatGPT_Text",
                            args: {
                                "prompt": payload.messages,
                                "temperature": 0
                            }
                        }));
                    }, 2000);
                };
                websocket.onclose = function (evt) {
                };
                websocket.onmessage = function (res) {
                    let messageStr = res.data;
                    console.log('接收到的数据:', messageStr, typeof (messageStr));
                    if (!messageStr) {
                        console.error("messageStr为空");
                        return;
                    }
                    let messageObj: any = {};
                    try {
                        messageObj = JSON.parse(messageStr);
                    } catch (error) {
                        console.error("解析json失败");
                        return;
                    }
                    if (messageObj.cmd === 'Error') {
                        //错误
                        resolve(messageStr);
                        return;
                    } else if (messageObj.cmd === 'Response' && messageObj.src !== '') {
                        //普通的命令返回
                        try {
                            //调用处理函数
                            resolve(incrementalText);
                        } catch (error) {
                            console.log(error);
                        }
                    } else if (messageObj.cmd === 'Stream' && messageObj.message !== '') {
                        //Stream
                        try {
                            //调用处理函数
                            incrementalText += messageObj.message;
                            onMessage(incrementalText);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                };
                websocket.onerror = function (evt) {
                    reject();
                };
            });
        };
        onBeforeRequest();
        try {
            let res = await requestWebsocket(payload);
            console.log(res);
            if (res && res.length > 0) {
                //保存消息
                console.log(res);
            } else {

            }
            //完成
            onFinish(true, res);
        } catch (error: any) {
            console.log('错误:', error);
            //完成
            onFinish(false,'');
        }
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            // expected, the user clicked the "stop" button
        } else {
            // TODO: show an error to the UI
            console.error('Fetch request error:', error);
        }
        console.log('错误2:', error);
        //完成
        onFinish(false,'');
    }
};
