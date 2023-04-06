import { uuid } from 'uuidv4';

export const getUuid = (spilt: boolean): string => {
  //
  let res = uuid();
  if (!spilt) {
    res = res.replaceAll('-', '');
  }
  return res;
};

export const logout = () => {
  clearLocalValue('rrai_token');
};

export const isLogin = (): boolean => {
  let token = getLocalValue('rrai_token');
  console.log(token,'ssss');
  if (token) {
    return true;
  }
  //从缓存中获取到
  return false;
};

export const setToken = (token: string) => {
  setLocalValue('rrai_token', token);
};

export const getToken = (): string | null => {
  let token = getLocalValue('rrai_token');
  if (token) {
    return token;
  }
  //从缓存中获取到
  return null;
};

export const getUidFromFileName = (filename: string): string => {
  //
  return filename.substr(0, filename.indexOf('.'));
};
///////////////////////////////////////////////////////////////////////////////////////////////////
export const getValue = (
  options: { [key: string]: any },
  key: string,
  defaultValue?: any,
): any => {
  let v = options[key];
  if (v === undefined || v === null) {
    return defaultValue !== undefined ? defaultValue : undefined;
  }
  return v;
};

export const getValueByPath = (
  options: { [key: string]: any },
  path: string,
  defaultValue?: any,
): any => {
  //
  if (!options) {
    return defaultValue;
  }
  //
  if (path.indexOf('.') == 0) {
    path = path.substr(1);
  }

  if (path.indexOf('.') < 0) {
    return getValue(options, path, defaultValue);
  }
  //截取第一个.之前的
  let parentKey = path.substr(0, path.indexOf('.'));
  let key = path.substr(path.indexOf('.') + 1);

  return getValueByPath(options[parentKey], key, defaultValue);
};

export const getValueNumberByPath = (
  options: { [key: string]: any },
  path: string,
  defaultValue?: any,
): any => {
  //
  if (!options) {
    return defaultValue;
  }
  //
  if (path.indexOf('.') == 0) {
    path = path.substr(1);
  }

  if (path.indexOf('.') < 0) {
    return getNumberValue(options, path, defaultValue);
  }
  //截取第一个.之前的
  let parentKey = path.substr(0, path.indexOf('.'));
  let key = path.substr(path.indexOf('.') + 1);

  return getValueByPath(options[parentKey], key, defaultValue);
};

export const getValueBooleanByPath = (
  options: { [key: string]: any },
  path: string,
  defaultValue?: any,
): any => {
  //
  if (!options) {
    return defaultValue;
  }
  //
  if (path.indexOf('.') == 0) {
    path = path.substr(1);
  }

  if (path.indexOf('.') < 0) {
    return getBooleanValue(options, path, defaultValue);
  }
  //截取第一个.之前的
  let parentKey = path.substr(0, path.indexOf('.'));
  let key = path.substr(path.indexOf('.') + 1);

  return getValueBooleanByPath(options[parentKey], key, defaultValue);
};

export const getNumberValue = (
  options: { [key: string]: any },
  key: string,
  defaultValue?: number,
): number => {
  let v = options[key];
  if (v === undefined || v === null) {
    return defaultValue !== undefined ? defaultValue : 0;
  }
  if (typeof v === 'string') {
    if (v.indexOf('.') >= 0) {
      return parseFloat(v);
    } else {
      return parseInt(v);
    }
  }
  return v;
};
export const getBooleanValue = (
  options: { [key: string]: any },
  key: string,
  defaultValue?: boolean,
): boolean => {
  let v = options[key];
  if (v === undefined || v === null) {
    return defaultValue !== undefined ? defaultValue : false;
  }
  if (typeof v === 'boolean') {
    return !!v;
  } else if (typeof v === 'string') {
    if (v.toLowerCase() == 'true') {
      return true;
    } else {
      return false;
    }
  }
  return !!v;
};

///////////////////////////////////////////////////////////////////////////////////////////////////
declare global {
  interface Window {
    observerOnEvent: any;
    wasm_bindgen: any;
    vm_wasm_start: any;
    vm_wasm_launch: any;
    vm_wasm_update: any;
    observerSendEvent: any;
  }
}
export const observerSendEvent = (src: string, code: string, value: string) => {
  //发送消息
  if (window.observerSendEvent) {
    window.observerSendEvent(src, code, value);
  }
};

export const triggerObserverCanvasEvent = (
  src: string,
  code: string,
  value: string,
) => {
  if (window && window.observerOnEvent) {
    window.observerOnEvent(src, code, value);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////

export const setLocalValue = (key: string, value: string) => {
  if (value === null || value === undefined) {
    return;
  }
  localStorage.setItem(key, value);
};

export const getLocalValue = (key: string) => {
  return localStorage.getItem(key);
};

export const getLocalValueByDefault = (def: string, key: string): string => {
  let res = localStorage.getItem(key);
  if (res == null) {
    return def;
  }
  return res;
};

export const clearLocalValue = (key: string) => {
  return localStorage.removeItem(key);
};
///////////////////////////////////////////////////////////////////////////////////////////////////

export const colorHex = (that: string) => {
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(that)) {
    var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    var strHex = '#';
    for (var i = 0; i < aColor.length; i++) {
      var hex = Number(aColor[i]).toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = that;
    }
    return strHex;
  } else if (reg.test(that)) {
    var aNum = that.replace(/#/, '').split('');
    if (aNum.length === 6) {
      return that;
    } else if (aNum.length === 3) {
      var numHex = '#';
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i];
      }
      return numHex;
    }
  }
  return that;
};

export const colorHex2Int = (that: string) => {
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(that)) {
    var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    var strHex = '0x';
    for (var i = 0; i < aColor.length; i++) {
      var hex = Number(aColor[i]).toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = that;
    }
    return parseInt(strHex, 16);
  } else if (reg.test(that)) {
    var aNum = that.replace(/#/, '').split('');
    if (aNum.length === 6) {
      return parseInt(that.replace(/#/, '0x'), 16);
    } else if (aNum.length === 3) {
      var numHex = '0x';
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i];
      }
      return parseInt(numHex, 16);
    }
  }
  return parseInt(that.replace(/#/, '0x'), 16);
};

///////////////////////////////////////////////////////////////////////////////////////////////////
const typeString: string =
  'Boolean Number String Function Array Date RegExp Object Error Symbol';
const class2type: any = {};

typeString.split(' ').forEach((type) => {
  class2type[`[object ${type}]`] = type.toLowerCase();
});

export function type(object: any) {
  const type = class2type.toString.call(object);
  if (object === null) return object + '';
  if (Number.isNaN(object)) return 'NaN';

  const isObject = typeof object === 'object';
  const isFn = typeof object === 'function';
  return isObject || isFn ? class2type[type] || 'object' : typeof object;
}

export const is = {
  primitive(tar: any): tar is string | number {
    return ['string', 'number'].includes(type(tar));
  },
  array(tar: any): tar is any[] {
    return type(tar) === 'array';
  },
  num(tar: any): tar is number {
    return type(tar) === 'number';
  },
  str(tar: any): tar is string {
    return type(tar) === 'string';
  },
  obj(tar: any): tar is object {
    return type(tar) === 'object';
  },
  fn(tar: any): tar is (...data: any) => any {
    return type(tar) === 'function';
  },
  undef(tar: any): tar is undefined {
    return type(tar) === 'undefined';
  },
  def(tar: any) {
    return !is.undef(tar);
  },
  null(tar: any): tar is null {
    return type(tar) === 'null';
  },
  empty(tar: any): boolean {
    const t = type(tar);
    switch (t) {
      case 'object':
        return Object.keys(tar).length === 0;
      case 'array':
        return tar.length === 0;
      case 'string':
        return !tar.trim();
      case 'undefined':
      case 'null':
      case 'NaN':
      case 'boolean':
        return true;
      default:
        return false;
    }
  },
  Nil(tar: any): tar is null | undefined {
    return ['null', 'undefined'].includes(type(tar));
  },
  NaN(tar: any): boolean {
    return type(tar) === 'NaN';
  },
};


export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return (
    [year, month, day].map(formatNumber).join('-')
  )
}


const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export const wxuuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("").replace("-", "").replace("\-", "");
  return uuid
}

// base64转blob
export function base64ToBlob(base64: string, mime: string) {
  let bstr = atob(base64)
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}
// blob转file
export function blobToFile(theBlob: any, fileName: string) {
  return new File([theBlob], fileName);
}
