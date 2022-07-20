import {AliwangwangFilled, LockOutlined, UserOutlined} from '@ant-design/icons';
import {Dispatch, Link, connectStore} from '@elux/react-web';
import {Button, Checkbox, Form, Input} from 'antd';
import {FC, useCallback} from 'react';
import {APPState, GetActions} from '@/Global';
import DialogPage from '../../components/DialogPage';
import {RegisterParams} from '../../entity';
import {LoginUrl} from '../../utils/const';
import {getFormDecorators} from '../../utils/tools';
import styles from './index.module.less';

interface HFormData extends Required<RegisterParams> {
  confirm: string;
  agreement: boolean;
}

const initialValues: Partial<HFormData> = {
  username: '',
  password: '',
  confirm: '',
  agreement: false,
};

const agreementChecked = (rule: any, value: string) => {
  if (!value) {
    return Promise.reject('您必须同意注册协议!');
  }
  return Promise.resolve();
};

const fromDecorators = getFormDecorators<HFormData>({
  username: {rules: [{required: true, message: '请输入用户名!', whitespace: true}]},
  password: {rules: [{required: true, message: '请输入密码!', whitespace: true}]},
  agreement: {valuePropName: 'checked', rules: [{validator: agreementChecked}]},
  confirm: {
    rules: [
      {required: true, message: '请再次输入密码!'},
      ({getFieldValue}) => ({
        validator(rule, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject('2次密码输入不一致!');
        },
      }),
    ],
    dependencies: ['password'],
  },
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
      dispatch(stageActions.registry(values));
    },
    [dispatch]
  );

  return (
    <DialogPage title="用户注册" subject="用户注册" maskClosable={false} showBrand>
      <div className={`${styles.root} g-dialog-content`}>
        <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
          <Form.Item {...fromDecorators.username}>
            <Input size="large" allowClear prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item {...fromDecorators.password}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item {...fromDecorators.confirm}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="确认密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item style={{marginBottom: 10}}>
            <Form.Item {...fromDecorators.agreement} noStyle>
              <Checkbox>我已阅读并同意</Checkbox>
            </Form.Item>
            <Link to="/stage/agreement" action="push" target="window">
              注册协议
            </Link>
          </Form.Item>
          <Form.Item>
            <div className="g-control">
              <Button size="large" type="primary" htmlType="submit">
                注册
              </Button>
              <Link to={1} action="back" target="page">
                <Button size="large">取消</Button>
              </Link>
            </div>
          </Form.Item>
        </Form>
        <div className="footer">
          <AliwangwangFilled /> <span>已注册用户？</span>
          <Link to={LoginUrl(fromUrl)} action="relaunch" target="window">
            登录
          </Link>
        </div>
      </div>
    </DialogPage>
  );
};

//connectRedux中包含了exportView()的执行
export default connectStore(mapStateToProps)(Component);
