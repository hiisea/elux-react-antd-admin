import {getFormDecorators} from '@elux-admin-antd/stage/utils/tools';
import {Dispatch, connectStore} from '@elux/react-web';
import {Button, Form, Input, Modal} from 'antd';
import {FC, useCallback, useEffect} from 'react';
import {APPState, GetActions} from '@/Global';
import {Tab} from '../../entity';

interface HFormData {
  title: string;
}

const formDecorators = getFormDecorators<HFormData>({
  title: {rules: [{required: true, message: '请输入书签名'}]},
});

const {admin: adminActions} = GetActions('admin');

export interface StoreProps {
  tabEdit?: Tab;
}
function mapStateToProps(appState: APPState): StoreProps {
  const {tabEdit} = appState.admin!;
  return {
    tabEdit,
  };
}
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({dispatch, tabEdit}) => {
  const [form] = Form.useForm();

  const onSubmit = useCallback(
    (values: HFormData) => {
      const {title} = values;
      dispatch(adminActions.updateTab({...tabEdit!, title}));
    },
    [dispatch, tabEdit]
  );

  const onCancel = useCallback(() => {
    dispatch(adminActions.closeTabEditor());
  }, [dispatch]);

  useEffect(() => {
    tabEdit && form.setFieldsValue({title: tabEdit?.title});
  }, [form, tabEdit]);

  return (
    <Modal title="收藏书签" visible={!!tabEdit} onCancel={onCancel} width={300} footer={null}>
      <Form form={form} layout="horizontal" onFinish={onSubmit}>
        <Form.Item {...formDecorators.title}>
          <Input allowClear placeholder="请输入书签名" />
        </Form.Item>
        <Form.Item>
          <div className="g-control">
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connectStore(mapStateToProps)(Component);
