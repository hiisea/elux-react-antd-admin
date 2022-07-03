import {useUpdateItem} from '@elux-admin-antd/stage/utils/resource';
import {getFormDecorators} from '@elux-admin-antd/stage/utils/tools';
import {Dispatch, exportView} from '@elux/react-web';
import {Button, Form, Input, Select} from 'antd';
import {FC, memo, useCallback} from 'react';
import {GetActions, GetClientRouter} from '@/Global';
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
  listUrl: string;
  dispatch: Dispatch;
  itemDetail: ItemDetail;
}

const {member: memberActions} = GetActions('member');

const Component: FC<Props> = ({itemDetail, dispatch, listUrl}) => {
  const [form] = Form.useForm();
  const goBack = useCallback(() => GetClientRouter().back(1, 'window', null, listUrl), [listUrl]);
  const {loading, onFinish} = useUpdateItem(itemDetail.id, dispatch, memberActions, goBack);

  const onReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  return (
    <Form layout="horizontal" {...formItemLayout} form={form} initialValues={itemDetail} onFinish={onFinish}>
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
        <Button onClick={goBack}>取消</Button>
      </div>
    </Form>
  );
};

export default exportView(memo(Component));
