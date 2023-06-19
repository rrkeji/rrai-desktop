import React, { useState } from 'react';
import classnames from 'classnames';
import {
  LightFilter,
  ProForm,
  ProFormDateRangePicker,
  ProFormRadio,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox
} from '@ant-design/pro-components';
import styles from './index.less';
import { Card, Modal } from 'antd';
import { ipfsCreateWithContent, datasetCreateByModelId, datasetCreateRow } from '@/tauri/index';

export interface SettingsFeedbackPageProps {

}

interface DataItem {
  question: string;
  contacts: string;
}

const FEEDBACK_MODEL_ID = "f3c58db534b64864a3154e93e0852a7b";

const FEEDBACK_DATASET_ID = "67795ce4da2f48f49e52787c060dfbae";


export const SettingsFeedbackPage: React.FC<SettingsFeedbackPageProps> = ({ }) => {

  const [loading, setLoading] = useState<boolean>(false);
  //
  return (
    <div className={classnames(styles.container)}>
      <Card>
        <ProForm<DataItem>
          loading={loading}
          onFinish={async (values: any) => {
            console.log(values);
            //长度限制
            if (!values.question || values.question.length <= 0) {
              return;
            }
            setLoading(true);
            // 保存
            //获取datasetId
            let datasetId = FEEDBACK_DATASET_ID;
            //创建dataset row
            try {
              await datasetCreateRow(datasetId, '', JSON.stringify(values), 'RRAI,');
              Modal.success({
                content: '发送成功',
                onOk: () => {
                  setLoading(false);
                }
              });
            } catch (err) {
              setLoading(false);
            }
            return true;
          }}
        >
          <ProFormText colSize={24}
            fieldProps={
              {
                showCount: true,
                maxLength: 100
              }
            } name="contacts" label="联系方式(选填,便于我们与你联系)" />
          <ProFormTextArea
            required
            fieldProps={
              {
                showCount: true,
                allowClear: true,
                maxLength: 200
              }
            }
            colSize={24}
            name="question"
            label="请描述具体问题"
            initialValue=""
          />

        </ProForm>
      </Card>
    </div>
  );
};

export default SettingsFeedbackPage;