import {useUpdateItem} from '@elux-admin-antd/stage/utils/resource';
import {getFormDecorators} from '@elux-admin-antd/stage/utils/tools';
import {Dispatch, exportView} from '@elux/react-web';
import {Button, Form, Input} from 'antd';
import {FC, memo, useCallback} from 'react';
import {GetActions, GetClientRouter} from '@/Global';
import {ItemDetail, UpdateItem} from '../entity';

const FormItem = Form.Item;

export const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 19,
  },
};

const fromDecorators = getFormDecorators<UpdateItem>({
  title: {rules: [{required: true, message: '请输入标题'}]},
  summary: {rules: [{required: true, message: '请输入摘要'}]},
  content: {rules: [{required: true, message: '请输入内容'}]},
  editors: {rules: [{required: true, message: '请选择责任编辑'}]},
});

interface Props {
  listUrl: string;
  dispatch: Dispatch;
  itemDetail: ItemDetail;
}

const {article: articleActions} = GetActions('article');

const Component: FC<Props> = ({itemDetail, dispatch, listUrl}) => {
  const [form] = Form.useForm();
  const goBack = useCallback(() => GetClientRouter().back(1, 'window', null, listUrl), [listUrl]);
  const {loading, onFinish} = useUpdateItem(itemDetail.id, dispatch, articleActions, goBack);

  const onReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  return (
    <Form layout="horizontal" {...formItemLayout} form={form} initialValues={itemDetail} onFinish={onFinish}>
      <FormItem label="责任编辑" {...fromDecorators.editors}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem label="标题" {...fromDecorators.title}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem label="摘要" {...fromDecorators.summary}>
        <Input.TextArea rows={4} allowClear placeholder="请输入" />
      </FormItem>
      <FormItem label="内容" {...fromDecorators.content}>
        <Input.TextArea rows={20} allowClear placeholder="请输入" />
      </FormItem>

      <div className="g-form-actions">
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
        <Button type="dashed" onClick={onReset}>
          重置
        </Button>
        <Button onClick={goBack}>取消</Button>
      </div>
    </Form>
  );
};

export default exportView(memo(Component));
