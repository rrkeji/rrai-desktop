// 每隔5秒向服务端发送消息"ping",服务端接收到消息后给我们回个话"pong"
// 如果超过5秒服务端还没回复“pong”，则认为连接断开的（将启动重连）
class HeartCheck {
  pongTime = 10 * 1000; //30秒接收心跳
  pingTime = (10 * 1000 / 10) * 8;//30秒向服务器发送心跳
  timeoutObj: any = 0;//Ping定时器
  serverTimeoutObj: any = 0;//Pong定时器

  getSocket: () => any = () => {
    return null;
  };

  constructor(getSocketFunc: () => any) {
    this.getSocket = getSocketFunc;
  }

  destory() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
  }

  PingStart() {
    var self = this;
    clearTimeout(this.timeoutObj);
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      if (self.getSocket() != null && self.getSocket().readyState ==
        self.getSocket().OPEN) {
        self.getSocket().send({ data: JSON.stringify({ "cmd": "Ping" }) })
        self.PingStart();
      } else {
        console.log('----');
        self.PingStart();
      }
    }, this.pingTime) //10秒发送一次心跳
  }
  PongStart() {
    var self = this;
    clearTimeout(this.serverTimeoutObj);
    self.serverTimeoutObj = setTimeout(function () { //如果超过一定时间还没重置，说明后端主动断开了
      if (self.getSocket() != null) {
        //console.log("服务器30秒没有响应，关闭连接")
        self.getSocket().close();
      }
    }, self.pongTime)
  }
}

export class ReconnectWebsocket {
  //
  websocket: any = null;

  //
  isSending: boolean = false;

  //
  timeoutHandle: any = 0;

  //
  destoryFlag: boolean = false;

  //
  options: {
    onMessage: (cmd: string, data: any, code?: number) => void;
    onOpen?: (res: any) => void;
    onError?: (res: any) => void;
    onClose?: (res: any) => void;
    userId: string;
  } | null = null;
  //
  heartCheck: HeartCheck | null = null;

  constructor(options1: {
    onMessage: (cmd: string, data: any, code?: number) => void;
    onOpen?: (res: any) => void;
    onError?: (res: any) => void;
    onClose?: (res: any) => void;
    userId: string;
  }) {
    console.log(options1);
    this.options = options1;
    this.heartCheck = new HeartCheck(() => {
      return this.getSocket();
    });
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      this.socketInit(true);
    }, 10);
  }
  getSocket = () => {
    return this.websocket;
  }

  isOnline(): boolean {
    return this.websocket !== null && this.websocket.readyState === this.websocket.OPEN;
  }

  async socketInit(reconnection = false) {
    if (this.destoryFlag) {
      return;
    }

    if (this.websocket == null) {
      // const { socketTask } = await wx.cloud.connectContainer({
      //   "service": "chat",
      //   "path": "/"
      // })
      // this.websocket = socketTask;
      this.websocket = new WebSocket('wss://wsschat.idns.link');

      this.websocket.onopen = (res: any) => {
        console.log('onOpen', res);
        this.options!.onOpen && this.options!.onOpen(res);
        this.websocket.send({ data: JSON.stringify({ "cmd": "Ping" }) })
        this.heartCheck!.PingStart();
        //打开心跳检测
        this.heartCheck!.PongStart();
      };

      this.websocket.onerror = (err: any) => {
        this.options!.onError && this.options!.onError(err);
        console.log(err);
      };

      this.websocket.onmessage = (res: any) => {
        try {
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
          if (messageObj.src === 'Ping') {
            //心跳报文不处理
          } else if (messageObj.cmd === 'Error') {
            //错误
            this.options!.onError && this.options!.onError(messageStr);
          } else if (messageObj.cmd === 'Response' && messageObj.src !== '') {
            //普通的命令返回
            try {
              //调用处理函数
              this.options!.onMessage(messageObj.src, messageObj.message, messageObj.code);
            } catch (error) {
              console.log(error);
            }
          } else if (messageObj.cmd === 'Stream' && messageObj.message !== '') {
            //Stream
            try {
              //调用处理函数
              this.options!.onMessage('Stream', messageObj.message);
            } catch (error) {
              console.log(error);
            }
          }

          if (this.websocket != null) {
            //拿到任何消息都说明当前连接是正常的 心跳检测重置
            this.heartCheck!.PingStart();
            this.heartCheck!.PongStart();
          }
        } catch (e) {
          console.log(e);
          this.options!.onError && this.options!.onError(e);
        }
      };

      this.websocket.onclose = (res: any) => {
        //console.log("Connection closed.");
        this.options!.onClose && this.options!.onClose(res);
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = setTimeout(() => {
          this.socketInit();
        }, 1000);
      };
    } else {
      //状态判断
      switch (this.websocket.readyState) {
        case this.websocket.CONNECTING: //表示正在连接。
          //console.log("正在连接");
          break;
        case this.websocket.OPEN: //表示连接成功，可以通信了。
          //console.log("已经连接");
          break;
        case this.websocket.CLOSING: //表示连接正在关闭。
          //console.log("正在关闭,1秒后再次尝试连接");
          clearTimeout(this.timeoutHandle);
          this.timeoutHandle = setTimeout(() => {
            this.socketInit();
          }, 1000);
          break;
        case this.websocket.CLOSED: //表示连接已经关闭，或者打开连接失败
          //console.log("已经关闭,再次连接");
          this.websocket = null;
          this.socketInit(true);
          break;
        default:
          // this never happens
          break;
      }
    }
  }

  destory() {
    this.destoryFlag = true;
    this.heartCheck?.destory();
    clearTimeout(this.timeoutHandle);
  }

  /**
   * 
   * @param command 
   * @param data 
   */
  sendCommand = (command: string, data: any): number => {
    if (this.websocket.readyState === this.websocket.OPEN) {
      if (this.isSending) {
        console.log('正在发送...');
        return 1;
      }
      this.isSending = true;
      try {
        this.websocket.send({
          data: JSON.stringify({
            cmd: command,
            args: data
          })
        });
      } catch (e) {
        console.log(e);
        this.isSending = false;
        //发送失败
        return 2;
      }
      this.isSending = false;
      return 0;
    } else {
      console.log('链接未打开...');
      return 3;
    }
  }
}