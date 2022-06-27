import {DocumentHead} from '@elux/react-web';
import {FC, ReactNode, useCallback} from 'react';
import {useRouter} from '@/Global';
import styles from './index.module.less';

export interface Props {
  className?: string;
  title?: string;
  banner?: string;
  children?: ReactNode;
}

const Component: FC<Props> = ({className = '', title, banner, children}) => {
  const router = useRouter();
  const onBack = useCallback(() => router.back(1), [router]);
  return (
    <div style={{paddingTop: 45}}>
      <div className={`${styles.root} ${className}`}>
        {title && <DocumentHead title={title} />}
        {banner && (
          <div className="banner">
            <div className="logo">
              Elux-管理系统<span className="ver"> V1.0</span>
            </div>
            <h2 className="title">{banner}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Component;
