import { wxCloudRequest } from '@/utils/wx-cloud-request';
import { formatDate } from '../utils/utils';

export interface PromptEntity {
  id: number,
  prompts: Array<string>,
  images: Array<string>,
  ai_type: string,
  args: string,
  create_time_str: string,
  update_time_str: string,
  user_id: string,
  title: string,
  tags: Array<string>,
  recommend: boolean,
  purpose: string,
  examples: string,
}

export enum InteracteField {
  ThumbsUp = "thumbs_up",
  ThumbsDown = "thumbs_down",
  View = "view",
  Favorite = "favorite",
}

export interface PromptsCategory {
  id: number,
  category: string,
  icon: string,
  ctype: string,
}


const convertPromptEntity = (item: any): any => {
  //tags
  let tags = item.tags.split(',');
  item.tags = tags.filter((str) => str != '');
  //prompts
  let prompts = item.prompts;
  try {
    item.prompts = JSON.parse(prompts);
  } catch (error) {
  }
  //images
  let images = item.images;
  item.images = JSON.parse(images);
  //时间
  item.create_time_str = formatDate(new Date(item.create_time * 1000));
  item.update_time_str = formatDate(new Date(item.update_time * 1000));
  //事件
  return item;
}

export const getPromptsCategories = async (): Promise<Array<PromptsCategory>> => {
  let res = await wxCloudRequest({
    "path": "/prompts_category/categories",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": 1,
      "page_size": 1000
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data.data.map((item: any) => {
      item.title = item.category;
      return item;
    })
  }
};


export const getTagsByCategory = async (category: string): Promise<Array<any>> => {
  let res = await wxCloudRequest({
    "path": "/prompts_category/search_by_category",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": 1,
      "page_size": 10,
      "conditions": {
        "category": category
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data.data;
  }
};

export const addPromptTag = async (tag: string, category: string) => {

  let res = await wxCloudRequest({
    "path": "/prompts_category/tag/create",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "tag": tag,
      "category": category,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    return res.data;
  }
}

export const searchPrompts = async (page: number, pageSize: number, aiType: string, keywords?: string, category?: string): Promise<any> => {

  let res = await wxCloudRequest({
    "path": "/prompts/prompts",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": page,
      "page_size": pageSize,
      "conditions": {
        "ai_type": aiType,
        "keywords": (!keywords || keywords.trim() == '') ? undefined : keywords,
        "category": '全部'
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    res.data.data = res.data.data.map((item) => convertPromptEntity(item));
    return res.data;
  }
};

export const getPromptById = async (promptId: number): Promise<any> => {

  let res = await wxCloudRequest({
    "path": "/prompts/byid/" + promptId,
    "header": {
      "content-type": "application/json"
    },
    "method": "GET",
    "data": {
      "page": 1,
      "page_size": 10,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return convertPromptEntity(res.data);
  }
}


export const searchUserPrompts = async (page: number, pageSize: number, keywords?: string, category?: string): Promise<any> => {

  let res = await wxCloudRequest({
    "path": "/prompts/user_prompts",
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": page,
      "page_size": pageSize,
      "conditions": {
        "keywords": keywords,
        "category": category
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    res.data.data = res.data.data.map((item) => convertPromptEntity(item));
    return res.data;
  }
};


export const promptsInteractionByUserid = async (promptId: number) => {

  let res = await wxCloudRequest({
    "path": "/prompts_user/interaction/byuserid/" + promptId,
    "header": {
    },
    "method": "GET",
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  }
};

export const promptsInteractionById = async (promptId: number) => {

  let res = await wxCloudRequest({
    "path": "/prompts_user/interaction/byid/" + promptId,
    "header": {
    },
    "method": "GET",
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  }
};

export const userPromptsInteracte = async (promptId: number, field: InteracteField, value: boolean) => {

  let res = await wxCloudRequest({
    "path": "/prompts_user/interacte/" + promptId,
    "header": {
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "field": field,
      "value": value ? 1 : 0,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    return res.data;
  }
}