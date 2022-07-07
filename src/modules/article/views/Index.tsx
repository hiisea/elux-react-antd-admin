import DialogPage from '@elux-admin-antd/stage/components/DialogPage';
import {FC, memo} from 'react';
import ListTable from './ListTable';

const Component: FC = () => {
  return (
    <DialogPage subject="文章列表" mask>
      <div className="g-dialog-content" style={{width: 900, height: 560}}>
        <ListTable />
      </div>
    </DialogPage>
  );
};

export default memo(Component);
