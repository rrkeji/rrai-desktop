import { useCallback, useEffect, useState } from 'react';

import { history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { queryDatasetRowById } from '@/tauri/idns/index';
import { Browser } from '@/components/index';

import { getLocalValue, setLocalValue } from '@/utils';

import styles from './index.less';
import { rrappDownload } from '@/tauri';

export const RrappPage = () => {

  const location = useLocation();

  const params = useParams<string>();

  const { datasetId, id } = params;


  const [rrappCid, setRrappCid] = useState<string | null>(null);

  if (!datasetId || !id) {
    return <>datasetId为空!</>
  }
  const refresh = async (datasetId: string, id: string) => {
    //根据数据集ID获取到内容id  CID
    let res = await queryDatasetRowById(datasetId, parseInt(id));

    if (res && res.row_cid) {
      let rrappCid: string = res.row_cid;

      // let down_res = await rrappDownload(rrappCid);
      console.log(rrappCid);
      setRrappCid(rrappCid);
    } else {
      setRrappCid(null);
    }
  };

  useEffect(() => {
    const call = async () => {
      refresh(datasetId, id);
    };
    call();
  }, [datasetId, id]);

  if (rrappCid == null) {
    return (
      <div className={styles.container}>
        <div data-tauri-drag-region className={styles.height24}></div>
        没有找到
      </div>
    );
  }
  return (
    <Browser className={styles.container} src={`rrapp://${rrappCid}/`}></Browser>
  );
}


export default RrappPage;