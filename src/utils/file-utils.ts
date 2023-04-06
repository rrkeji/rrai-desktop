// const byteFile = await getAsByteArray(file)
export async function getAsByteArray(file: File): Promise<Uint8Array | null> {
  let res = await readFile(file);
  if (res == null) {
    return null;
  }
  if (typeof res == 'string') {
    return null;
  }
  return new Uint8Array(res);
}

export function readFile(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    // Create file reader
    let reader = new FileReader();

    // Register event listeners
    reader.addEventListener('loadend', (e) => {
      if (e.target == null) {
        resolve(null);
      } else {
        resolve(e.target.result);
      }
    });
    reader.addEventListener('error', reject);

    // Read file
    reader.readAsArrayBuffer(file);
  });
}

export const fileDownload = (
  content: any,
  fileName: string,
  fileType: string,
) => {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = fileName;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content], { type: fileType });
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

export const getFileCategory = (type: string): string => {
  if (!type || type == '') {
    return '';
  }
  if (type.match('image') != null) {
    return 'IMAGE';
  }
  if (type.match(/(word|txt|text|pdf|xls)/) != null) {
    return 'DOCUMENT';
  }
  if (type.match(/video/) !== null) {
    return 'VIDEO';
  }
  if (type.match(/audio/) !== null) {
    return 'AUDIO';
  }
  return '';
};
