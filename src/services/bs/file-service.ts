import { wxCloudRequest } from '@/utils/wx-cloud-request';

export const uploadFileGetTempUrl = async (filePath: string, cloudPath: string): Promise<{ fileId: string, fileTempUrl: string } | null> => {
  // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
  // 微信本地文件，通过选择图片，聊天文件等接口获取
  let res: ICloud.UploadFileResult = await wx.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: filePath,
  });
  console.log(res.fileID);

  //通过 fileID 获取到临时的 URL
  let fileTemp = await getTempFileURLByFileId([res.fileID]);
  console.log(fileTemp);

  if (fileTemp.length > 0) {
    return {
      fileId: fileTemp[0].fileID,
      fileTempUrl: fileTemp[0].tempFileURL
    };
  } else {
    return null;
  }
};

export const getTempFileURLByFileId = async (fileList: Array<string>): Promise<Array<{
  fileID: string
  tempFileURL: string
  maxAge: number
  status: number
  errMsg: string
}>> => {
  let fileTemp: ICloud.GetTempFileURLResult = await wx.cloud.getTempFileURL({
    fileList: fileList
  });
  //{tempFileURL}
  // console.log(fileTemp.fileList);
  return fileTemp.fileList;
};