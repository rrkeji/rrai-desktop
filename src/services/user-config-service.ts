import { wxCloudRequest } from '@/utils/wx-cloud-request';

export const getUserConfig = async (): Promise<{ times: number, user_id: string, avatar: string, nickname: string, checkin: string, vip: number, recharge: number } | null> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/user/config",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": {}
  });
  console.log(res.data);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
}
