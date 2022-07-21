//import {useUpdateItem} from '@elux-admin-antd/stage/utils/resource';
import {ListSearch as MemberListSearch, Role, Status} from '@elux-admin-antd/member/entity';
import MSelect from '@elux-admin-antd/stage/components/MSelect';
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
  title: {label: '标题', rules: [{required: true, message: '请输入标题'}]},
  summary: {label: '摘要', rules: [{required: true, message: '请输入摘要'}]},
  content: {label: '内容', rules: [{required: true, message: '请输入内容'}]},
  editors: {label: '责任编辑', rules: [{required: true, message: '请选择责任编辑'}]},
});

interface Props {
  dispatch: Dispatch;
  itemDetail: ItemDetail;
}

const {article: articleActions} = GetActions('article');

const Component: FC<Props> = ({itemDetail, dispatch}) => {
  const [form] = Form.useForm();
  const goBack = useCallback(() => GetClientRouter().back(1, 'window'), []);
  //const {loading, onFinish} = useUpdateItem(itemDetail.id, dispatch, articleActions);

  const onFinish = useCallback(
    (values: UpdateItem) => {
      const id = itemDetail.id;
      if (id) {
        dispatch(articleActions.updateItem!(id, values));
      } else {
        dispatch(articleActions.createItem!(values));
      }
    },
    [dispatch, itemDetail.id]
  );
  const onReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  return (
    <Form layout="horizontal" {...formItemLayout} form={form} initialValues={itemDetail} onFinish={onFinish}>
      <FormItem {...fromDecorators.editors}>
        <MSelect<MemberListSearch>
          placeholder="请选择责任编辑"
          selectorPathname="/admin/member/list/selector"
          fixedSearch={{role: Role.责任编辑, status: Status.启用}}
          limit={[1, 2]}
          returnArray
          showSearch
        ></MSelect>
      </FormItem>
      <FormItem {...fromDecorators.title}>
        <Input allowClear placeholder="请输入" />
      </FormItem>
      <FormItem {...fromDecorators.summary}>
        <Input.TextArea rows={4} allowClear placeholder="请输入" />
      </FormItem>
      <FormItem {...fromDecorators.content}>
        <Input.TextArea rows={20} allowClear placeholder="请输入" />
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
