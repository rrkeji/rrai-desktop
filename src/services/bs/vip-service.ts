import { wxCloudRequest } from '@/utils/wx-cloud-request';

export const checkin = async (): Promise<{ code: number, amount: number } | null> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/user/vip/checkin",
    "header": {
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

export const getVipDetail = async (): Promise<Array<{ level: number, upgrade: number, checkin_reward: number, slogan: string, scope: string, detail: string, options: string }> | null> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/user/vip/vip_detail",
    "header": {
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