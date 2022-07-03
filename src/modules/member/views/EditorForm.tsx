import {getFormDecorators} from '@elux-admin-antd/stage/utils/tools';
import {exportView} from '@elux/react-web';
import {Button, Form, Input, Select} from 'antd';
import {FC, memo, useCallback, useState} from 'react';
import {GetClientRouter} from '@/Global';
import {DGender, DRole, DStatus, ItemDetail, UpdateItem} from '../entity';

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
  name: {rules: [{required: true, message: '请输入用户名'}]},
  nickname: {rules: [{required: true, message: '请输入呢称'}]},
  role: {rules: [{required: true, message: '请选择角色'}]},
  gender: {rules: [{required: true, message: '请选择性别'}]},
  email: {rules: [{required: true, type: 'email', message: '请输入Email'}]},
  status: {rules: [{required: true, message: '请选择用户状态'}]},
});

interface Props {
  itemDetail: ItemDetail;
}

const Component: FC<Props> = ({itemDetail}) => {
  const [form] = Form.useForm();

  const id = itemDetail.id;

  const [loading, setLoading] = useState(false);

  const back = useCallback(() => GetClientRouter().back(1, 'window'), []);

  const onSubmit = useCallback(
    (values: UpdateItem) => {
      const {onSuccess} = (GetClientRouter().runtime.payload || {}) as {onSuccess?: (id: string, data: UpdateItem) => Promise<void>};
      if (onSuccess) {
        setLoading(true);
        onSuccess(id, values)
          .then(() => back())
          .catch(() => setLoading(false));
      } else {
        back();
      }
    },
    [id, back]
  );

  const onReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  return (
    <Form layout="horizontal" {...formItemLayout} form={form} initialValues={itemDetail} onFinish={onSubmit}>
      <FormItem label="用户名" {...fromDecorators.name}>
        <Input disabled={!!itemDetail.id} allowClear placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="呢称" {...fromDecorators.nickname}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem label="角色" {...fromDecorators.role}>
        <Select allowClear placeholder="请选择" options={DRole.options} />
      </FormItem>
      <FormItem label="性别" {...fromDecorators.gender}>
        <Select allowClear placeholder="请选择" options={DGender.options} />
      </FormItem>
      <FormItem label="Email" {...fromDecorators.email}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem label="状态" {...fromDecorators.status}>
        <Select allowClear placeholder="请选择用户状态" options={DStatus.options} />
      </FormItem>
      <div className="g-form-actions">
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
        <Button type="dashed" onClick={onReset}>
          重置
        </Button>
        <Button onClick={back}>取消</Button>
      </div>
    </Form>
  );
};

export default exportView(memo(Component));
