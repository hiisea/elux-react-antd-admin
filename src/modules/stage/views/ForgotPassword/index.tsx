import {LockOutlined, MobileOutlined, NumberOutlined} from '@ant-design/icons';
import {Dispatch, Link, connectRedux} from '@elux/react-web';
import {Button, Form, Input} from 'antd';
import {FC, useCallback, useEffect, useState} from 'react';
import DialogPage from '@/components/DialogPage';
import {GetActions} from '@/Global';
import {getFormDecorators} from '@/utils/tools';
import {ResetPasswordParams} from '../../entity';
import styles from './index.module.less';

interface FormData extends Required<ResetPasswordParams> {
  confirm: string;
}

const initialValues: Partial<FormData> = {
  phone: '',
  password: '',
  confirm: '',
  captcha: '',
};

const fromDecorators = getFormDecorators<FormData>({
  phone: {rules: [{required: true, message: '请输入注册手机号!', whitespace: true}]},
  password: {rules: [{required: true, message: '请输入新密码!', whitespace: true}]},
  captcha: {rules: [{required: true, message: '请输入短信验证码!', whitespace: true}]},
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

const Component: FC<{dispatch: Dispatch}> = ({dispatch}) => {
  const [form] = Form.useForm();
  const [countDown, setCountDown] = useState(0);
  const sendCaptcha = useCallback(async () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      form.setFields([{name: 'phone', errors: ['请输入手机号!']}]);
    } else {
      await dispatch(stageActions.sendCaptcha({phone}));
      setCountDown(60);
    }
  }, [dispatch, form]);

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => setCountDown(countDown - 1), 1000);
    }
  }, [countDown]);
  const onSubmit = useCallback(
    (values: FormData) => {
      dispatch(stageActions.resetPassword(values));
    },
    [dispatch]
  );

  return (
    <DialogPage className={styles.root} title="忘记密码" banner="忘记密码">
      <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
        <Form.Item {...fromDecorators.phone}>
          <Input size="large" allowClear prefix={<MobileOutlined />} placeholder="注册手机" />
        </Form.Item>
        <Form.Item {...fromDecorators.password}>
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="新密码" autoComplete="new-password" />
        </Form.Item>
        <Form.Item {...fromDecorators.confirm}>
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="确认密码" autoComplete="new-password" />
        </Form.Item>
        <Form.Item>
          <Form.Item {...fromDecorators.captcha} noStyle>
            <Input size="large" prefix={<NumberOutlined />} placeholder="短信验证码" style={{width: 220}} />
          </Form.Item>
          <Button size="large" className="btn-send-captcha" disabled={!!countDown} onClick={sendCaptcha}>
            {countDown ? `${countDown}秒后重试` : '发送验证码'}
          </Button>
        </Form.Item>
        <Form.Item>
          <div className="g-control">
            <Button size="large" type="primary" htmlType="submit">
              修改
            </Button>
            <Link to={1} action="back">
              <Button size="large">取消</Button>
            </Link>
          </div>
        </Form.Item>
      </Form>
    </DialogPage>
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux()(Component);
