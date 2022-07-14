import {Link} from '@elux/react-web';
import {Button, Result} from 'antd';
import {FC, memo} from 'react';

export interface Props {
  message?: string;
}

const Component: FC<Props> = ({message = '(404) 没有找到相关内容!'}) => {
  return (
    <Result
      status="404"
      title="出错啦！"
      subTitle={message}
      extra={
        <Link to={1} action="back" target="page">
          <Button type="primary">返回</Button>
        </Link>
      }
    />
  );
};

export default memo(Component);
