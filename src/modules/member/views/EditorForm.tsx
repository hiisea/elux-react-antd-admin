// import {useUpdateItem} from '@elux-admin-antd/stage/utils/resource';
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
  name: {label: '用户名', rules: [{required: true, message: '请输入用户名'}]},
  nickname: {label: '呢称', rules: [{required: true, message: '请输入呢称'}]},
  role: {label: '角色', rules: [{required: true, message: '请选择角色'}]},
  gender: {label: '性别', rules: [{required: true, message: '请选择性别'}]},
  email: {label: 'Email', rules: [{required: true, type: 'email', message: '请输入Email'}]},
  status: {label: '状态', rules: [{required: true, message: '请选择用户状态'}]},
});

interface Props {
  dispatch: Dispatch;
  itemDetail: ItemDetail;
}

const {member: memberActions} = GetActions('member');

const Component: FC<Props> = ({itemDetail, dispatch}) => {
  const [form] = Form.useForm();
  const goBack = useCallback(() => GetClientRouter().back(1, 'window'), []);
  // const {loading, onFinish} = useUpdateItem(itemDetail.id, dispatch, memberActions);

  const onFinish = useCallback(
    (values: UpdateItem) => {
      const id = itemDetail.id;
      if (id) {
        dispatch(memberActions.updateItem(id, values));
      } else {
        dispatch(memberActions.createItem(values));
      }
    },
    [dispatch, itemDetail.id]
  );

  const onReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  return (
    <Form layout="horizontal" {...formItemLayout} form={form} initialValues={itemDetail} onFinish={onFinish}>
      <FormItem {...fromDecorators.name}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem {...fromDecorators.nickname}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem {...fromDecorators.role}>
        <Select allowClear placeholder="请选择" options={DRole.options} />
      </FormItem>
      <FormItem {...fromDecorators.gender}>
        <Select allowClear placeholder="请选择" options={DGender.options} />
      </FormItem>
      <FormItem {...fromDecorators.email}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem {...fromDecorators.status}>
        <Select allowClear placeholder="请选择" options={DStatus.options} />
      </FormItem>
      <div className="g-form-actions">
        <Button type="primary" htmlType="submit">
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
