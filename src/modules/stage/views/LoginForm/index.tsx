import {AlipayCircleOutlined, AliwangwangFilled, DingtalkCircleFilled, LockOutlined, MobileFilled, UserOutlined} from '@ant-design/icons';
import {Dispatch, Link, connectStore} from '@elux/react-web';
import {Button, Checkbox, Form, Input} from 'antd';
import {FC, useCallback} from 'react';
import {APPState, GetActions} from '@/Global';
import DialogPage from '../../components/DialogPage';
import {LoginParams} from '../../entity';
import {getFormDecorators} from '../../utils/tools';
import styles from './index.module.less';

type HFormData = Required<LoginParams>;

const initialValues: Partial<HFormData> = {
  username: 'admin',
  password: '123456',
  keep: false,
};

const fromDecorators = getFormDecorators<HFormData>({
  username: {rules: [{required: true, message: '请输入用户名!', whitespace: true}]},
  password: {rules: [{required: true, message: '请输入密码!', whitespace: true}]},
  keep: {valuePropName: 'checked'},
});

const {stage: stageActions} = GetActions('stage');

interface StoreProps {
  fromUrl?: string;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {fromUrl} = appState.stage!;
  return {
    fromUrl,
  };
}

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({fromUrl = '', dispatch}) => {
  const [form] = Form.useForm();
  const onSubmit = useCallback(
    (values: HFormData) => {
      const result = dispatch(stageActions.login(values)) as Promise<void>;
      result.catch(({message}) => {
        form.setFields([{name: 'password', errors: [message]}]);
      });
    },
    [dispatch, form]
  );
  const onCancel = useCallback(() => {
    dispatch(stageActions.cancelLogin());
  }, [dispatch]);

  return (
    <DialogPage title="用户登录" subject="用户登录" maskClosable={false} showBrand>
      <div className={`${styles.root} g-dialog-content`}>
        <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
          <Form.Item {...fromDecorators.username}>
            <Input size="large" allowClear prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item {...fromDecorators.password}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item style={{marginBottom: 10}}>
            <Form.Item {...fromDecorators.keep} noStyle>
              <Checkbox>记住登录</Checkbox>
            </Form.Item>
            <Link className="btn-forgot" to={`/stage/forgetPassword?from=${fromUrl}`} action="push" target="page">
              忘记密码？
            </Link>
          </Form.Item>
          <Form.Item>
            <div className="g-control">
              <Button size="large" type="primary" htmlType="submit">
                登录
              </Button>
              <Button size="large" onClick={onCancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div className="footer">
          <Link to={`/stage/registry?from=${fromUrl}`} action="push" target="page">
            <AliwangwangFilled /> <span>注册新用户</span>
          </Link>
          <div className="other-login">
            其它登录方式：
            <a title="手机登录">
              <MobileFilled />
            </a>
            <a title="钉钉登录">
              <DingtalkCircleFilled />
            </a>
            <a title="支付宝登录">
              <AlipayCircleOutlined />
            </a>
          </div>
        </div>
      </div>
    </DialogPage>
  );
};

export default connectStore(mapStateToProps)(Component);
