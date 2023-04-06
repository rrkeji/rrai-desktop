import { wxCloudRequest } from '@/utils/wx-cloud-request';

export const messageSecCheck = async (msg: string) => {
  //进行安全检测
  let res = await wxCloudRequest({
    "path": "/wx/msg/sec_check",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      content: msg
    }
  });
  console.log(res.data);
  return res.data;
}

/**
 * 
 * @param args 
 */
export const createPromptToServer = async (args: {
  ai_type: string,
  prompts: Array<string>,
  title: string,
  images?: Array<string>,
  purpose?: string,
  tags: Array<string>,
  examples?: string,
}) => {
  let res = await wxCloudRequest({
    "path": "/prompts/create",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      ai_type: args.ai_type,
      prompts: args.prompts,
      title: args.title,
      images: args.images,
      purpose: args.purpose,
      tags: args.tags.join(','),
      examples: args.examples,
    }
  });
  console.log(res.data);
  return res.data;
}