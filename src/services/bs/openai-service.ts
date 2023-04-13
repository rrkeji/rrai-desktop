export const openaiImagesGenerations = (prompt: string, success: (res: any) => void, fail: (err: any) => void) => {
  //
  // let res = await wxCloudRequest({
  //   "path": "/openai/images/generations",
  //   "header": {
  //     "X-WX-SERVICE": "rrai",
  //     "content-type": "application/json"
  //   },
  //   "method": "POST",
  //   "data": {
  //     prompt: prompt,
  //     size: '512x512',
  //     n: 2,
  //     response_format: 'url'
  //   }
  // });
  const app = getApp<IAppOption>();

  wx.request({
    url: 'https://www.idns.link/rrai/chatGPT/openai/images/generations',
    "header": {
      "content-type": "application/json",
      "x-wx-openid": app.globalData.userId,
    },
    "method": "POST",
    "data": {
      prompt: prompt,
      size: '512x512',
      n: 2,
      response_format: 'url'
    },
    success: success,
    fail: fail
  });
}