import {ArrowLeftOutlined, CloseOutlined, ReloadOutlined} from '@ant-design/icons';
import {DocumentHead, Link} from '@elux/react-web';
import {Tooltip} from 'antd';
import {FC, ReactNode, useMemo} from 'react';
import styles from './index.module.less';

export interface Props {
  className?: string;
  title?: string;
  subject?: string;
  children?: ReactNode;
  showBrand?: boolean;
  showControls?: boolean;
  maskClosable?: boolean;
  mask?: boolean;
  size?: 'max' | 'auto';
  backOverflowRedirect?: string;
}

const Component: FC<Props> = (props) => {
  const {className = '', title, subject, showBrand, children, maskClosable = true, mask, backOverflowRedirect, size = 'auto'} = props;
  const showControls = props.showControls !== undefined ? props.showControls : !showBrand;

  const controls = useMemo(() => {
    return showControls ? (
      <div className="control">
        <Tooltip title="后退">
          <Link to={1} action="back" target="page" overflowRedirect={backOverflowRedirect}>
            <ArrowLeftOutlined />
          </Link>
        </Tooltip>
        <Tooltip title="刷新">
          <Link to={0} action="back" target="page" refresh>
            <ReloadOutlined />
          </Link>
        </Tooltip>
        <Tooltip title="关闭">
          <Link to={1} action="back" target="window" overflowRedirect={backOverflowRedirect}>
            <CloseOutlined />
          </Link>
        </Tooltip>
      </div>
    ) : null;
  }, [backOverflowRedirect, showControls]);

  return (
    <>
      <div className={`${styles.root} ${showBrand ? 'show-brand' : ''} size-${size} ${className}`}>
        {title && <DocumentHead title={title} />}
        {controls}
        {showBrand && (
          <div className="brand">
            Elux-管理系统<span className="ver"> V1.0</span>
          </div>
        )}
        <div className="content">
          {subject && <h2 className="subject">{subject}</h2>}
          {children}
        </div>
      </div>
      {!!mask && (
        <Link disabled={!maskClosable} className={styles.mask} to={1} action="back" target="window" overflowRedirect={backOverflowRedirect}></Link>
      )}
    </>
  );
};

export default Component;
