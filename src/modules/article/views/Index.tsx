import DialogPage from '@elux-admin-antd/stage/components/DialogPage';
import {connectStore} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import ListTable from './ListTable';

interface StoreProps {
  prefixPathname: string;
  curRender?: string;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, curRender} = state.article!;
  return {prefixPathname, curRender};
};

const selection = {limit: -1};

const Component: FC<StoreProps> = ({prefixPathname, curRender}) => {
  return (
    <DialogPage subject="文章列表" mask>
      <div className="g-dialog-content" style={{width: 900, height: 560}}>
        <ListTable listPathname={`${prefixPathname}/list/${curRender}`} selection={selection} />
      </div>
    </DialogPage>
  );
};

export default connectStore(mapStateToProps)(Component);
