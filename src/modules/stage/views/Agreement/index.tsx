import {Dispatch, Link, connectRedux} from '@elux/react-web';
import {Button} from 'antd';
import {FC, memo} from 'react';
import DialogPage from '@/components/DialogPage';
import styles from './index.module.less';

const Component: FC = () => {
  return (
    <DialogPage className={styles.root} title="用户协议" banner="用户协议">
      <div>
        您在使用百度公司提供的各项服务之前，请您务必审慎阅读、充分理解本协议各条款内容，特别是以粗体标注的部分，包括但不限于免除或者限制责任的条款。如您不同意本服务协议及/或随时对其的修改，您可以主动停止使用百度公司提供的服务；您一旦使用百度公司提供的服务，即视为您已了解并完全同意本服务协议各项内容，包括百度公司对服务协议随时所做的任何修改，并成为我们的用户。
        <p>您使用部分百度产品或服务时需要注册百度帐号，当您注册和使用百度帐号时应遵守下述要求：</p>
        1.
        用户注册成功后，百度公司将给予每个用户一个用户帐号，用户可以自主设置帐号密码。该用户帐号和密码由用户负责保管；用户应当对以其用户帐号进行的所有活动和事件负法律责任。
        <br />
        2.
        您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，除百度平台的具体产品对帐户有单独的注册要求外，您可获得百度平台（baidu.com网站及客户端）帐号并成为百度用户，可通过百度帐户使用百度平台的各项产品和服务。
        <br />
        3.
        为了方便您在百度产品中享有一致性的服务，如您已经在某一百度产品中登录百度帐号，在您首次使用其他百度产品时可能同步您的登录状态。此环节并不会额外收集、使用您的个人信息。如您想退出帐号登录，可在产品设置页面退出登录。
        <br />
        4.
        百度帐号（即百度用户ID）的所有权归百度公司，用户按注册页面引导填写信息，阅读并同意本协议且完成全部注册程序后，即可获得百度帐号并成为用户。用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。如果因注册信息不真实或更新不及时而引发的相关问题，百度公司不负任何责任。您可以通过百度帐号设置页面查询、更正您的信息，百度帐号设置页面地址：
        5.
        百度帐号（即百度用户ID）的所有权归百度公司，用户按注册页面引导填写信息，阅读并同意本协议且完成全部注册程序后，即可获得百度帐号并成为用户。用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。如果因注册信息不真实或更新不及时而引发的相关问题，百度公司不负任何责任。您可以通过百度帐号设置页面查询、更正您的信息，百度帐号设置页面地址：
      </div>
      <div className="footer">
        <Link to={1} action="back">
          <Button size="large" type="primary">
            确定
          </Button>
        </Link>
      </div>
    </DialogPage>
  );
};

export default memo(Component);
