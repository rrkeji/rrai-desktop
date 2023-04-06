import { wxCloudRequest } from '@/utils/wx-cloud-request';
import { formatTime } from '../utils/utils';

export interface RewardLogEntity {
  id: number,
  user_id: string,
  amount: number,
  is_reward: boolean,
  reason: string,
  ref_id: number,
  ref_str_id: string,
  create_time: number,
  update_time: number,
  create_time_str: string,
  update_time_str: string,
}
const convertRewardLogEntity = (item: any): any => {
  //时间
  item.create_time_str = formatTime(new Date(item.create_time * 1000));
  item.update_time_str = formatTime(new Date(item.update_time * 1000));
  //事件
  return item;
}

export const searchRewardLogs = async (page: number, pageSize: number, keywords?: string, startDate?: string, endDate?: string): Promise<any> => {

  let res = await wxCloudRequest({
    "path": "/reward/logs",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": page,
      "page_size": pageSize,
      "conditions": {
        "keywords": (!keywords || keywords.trim() == '') ? undefined : keywords,
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    res.data.data = res.data.data.map((item) => convertRewardLogEntity(item));
    return res.data;
  }
};

export const updateUserConfig = async (config: { avatar?: string, nickname?: string }): Promise<any> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/user/config",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": config
  });
  const app = getApp<IAppOption>();
  if (app) {
    app.refreshUserConfig();
  }
  console.log(res.data);
  return res.data;
}

export const rewardAdOrderCreate = async (): Promise<string | null> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/reward/ad_order/create",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {}
  });
  console.log(res.data);
  return res.data.uuid;
}


export const rewardAdOrderCash = async (orderNo: string): Promise<any> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/reward/ad_order/cash",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      order_no: orderNo
    }
  });
  console.log(res.data);
  return res.data;
}

export const rewardUserSummaryToday = async (): Promise<any> => {
  //请求剩余次数等
  let res = await wxCloudRequest({
    "path": "/reward/user_summary/today",
    "header": {
      "content-type": "application/json"
    },
    "method": "GET",
  });
  console.log(res.data);
  let summary = {
    "is_reward_0": 0,
    "is_reward_1": 0
  };
  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].is_reward == 1) {
      summary.is_reward_1 = res.data[i].amount;
    }
    if (res.data[i].is_reward == 0) {
      summary.is_reward_0 = res.data[i].amount;
    }
  }
  console.log(summary);
  return summary;
}
