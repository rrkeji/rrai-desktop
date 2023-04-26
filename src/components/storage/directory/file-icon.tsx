import React from 'react';

export const DirectorySvg = (props: { className: string; color: string }) => (
  <svg
    className={props.className}
    viewBox="0 0 1260 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="8206"
    width="200"
    height="200"
  >
    <path
      d="M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 0 0 486.794 0H88.747A88.747 88.747 0 0 0 0 88.747v846.506A88.747 88.747 0 0 0 88.747 1024H1171.56a88.747 88.747 0 0 0 88.747-88.747V246.285a88.747 88.747 0 0 0-88.747-88.747z m-1082.814 0V88.747h398.047l22.055 68.791z"
      fill={props.color}
      p-id="8207"
    ></path>
  </svg>
);

export const CommonFileSvg = (props: { className: string; color: string }) => (
  <svg
    className={props.className}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="9086"
    width="200"
    height="200"
  >
    <path
      d="M36.197719 837.475285a186.768061 186.768061 0 0 0 186.524714 186.524715h578.555134a186.646388 186.646388 0 0 0 186.524714-186.524715v-650.95057A186.646388 186.646388 0 0 0 801.277567 0H222.722433A186.768061 186.768061 0 0 0 36.197719 186.524715z m83.832699 0v-650.95057a102.813688 102.813688 0 0 1 102.692015-102.692015h578.555134a102.935361 102.935361 0 0 1 102.813688 102.692015v650.95057a102.935361 102.935361 0 0 1-102.813688 102.692015H222.722433a102.813688 102.813688 0 0 1-102.692015-102.692015z"
      fill={props.color}
      p-id="9087"
    ></path>
    <path
      d="M222.722433 306.737643H812.471483a41.855513 41.855513 0 0 0 0-83.711027H222.722433a41.855513 41.855513 0 0 0 0 83.711027zM222.722433 565.657795H812.471483a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327zM222.722433 824.577947h597.171103a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327z"
      fill={props.color}
      p-id="9088"
    ></path>
  </svg>
);

export const getFileSvg = (
  fileName: string,
  props: { className: string; color: string },
) => {
  //获取到文件的后缀
  if (fileName.indexOf('.') < 0) {
    return <CommonFileSvg {...props}></CommonFileSvg>;
  }
  //
  var fileExtension = fileName
    .substring(fileName.lastIndexOf('.') + 1)
    .toLocaleLowerCase();

  if (fileExtension === '.png') {
  }

  return <CommonFileSvg {...props}></CommonFileSvg>;
};
