import {CloseOutlined} from '@ant-design/icons';
import {DocumentHead, Link} from '@elux/react-web';
import {Button} from 'antd';
import {FC, ReactNode, useMemo} from 'react';
import {GetClientRouter} from '@/Global';
import styles from './index.module.less';

export interface Props {
  className?: string;
  title?: string;
  subject?: string;
  children?: ReactNode;
  showBrand?: boolean;
  maskClosable?: boolean;
  closeButton?: boolean;
  mask?: boolean;
  size?: 'max' | 'auto';
  footer?: boolean | ReactNode;
}

const goBack = () => GetClientRouter().back(1, 'window');

const Component: FC<Props> = ({
  className = '',
  title,
  subject,
  showBrand,
  children,
  footer,
  maskClosable = true,
  closeButton = true,
  mask,
  size = 'auto',
}) => {
  const footerArea: ReactNode = useMemo(() => {
    return (
      footer && (
        <div className="footer">
          {footer === true ? (
            <Link to={1} action="back" target="window">
              <Button type="primary">确定</Button>
            </Link>
          ) : (
            footer
          )}
        </div>
      )
    );
  }, [footer]);

  return (
    <>
      <div className={`${styles.root} ${showBrand ? 'show-brand' : ''} size-${size} ${className}`}>
        {title && <DocumentHead title={title} />}
        <div className="control">{closeButton && <CloseOutlined onClick={goBack} />}</div>
        {showBrand && (
          <div className="brand">
            Elux-管理系统<span className="ver"> V1.0</span>
          </div>
        )}
        <div className="content">
          {subject && <h2 className="subject">{subject}</h2>}
          {children}
          {footerArea}
          <div></div>
        </div>
      </div>
      {!!mask && <Link disabled={!maskClosable} to={1} action="back" target="window" className={styles.mask}></Link>}
    </>
  );
};

export default Component;
