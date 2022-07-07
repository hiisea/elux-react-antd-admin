import DateTime from '@elux-admin-antd/stage/components/DateTime';
import DialogPage from '@elux-admin-antd/stage/components/DialogPage';
import {exportView} from '@elux/react-web';
import {Descriptions, Skeleton} from 'antd';
import {FC, memo} from 'react';
import {DStatus, ItemDetail} from '../entity';

const DescriptionsItem = Descriptions.Item;

interface Props {
  listUrl: string;
  itemDetail?: ItemDetail;
}

const Component: FC<Props> = ({itemDetail, listUrl}) => {
  return (
    <DialogPage title="文章详情" subject="文章详情" backOverflowRedirect={listUrl} mask>
      <div className="g-dialog-content" style={{width: 800}}>
        {itemDetail ? (
          <Descriptions bordered column={2}>
            <DescriptionsItem label="标题" span={2}>
              {itemDetail.title}
            </DescriptionsItem>
            <DescriptionsItem label="作者">{itemDetail.author.name}</DescriptionsItem>
            <DescriptionsItem className="g-items" label="责任编辑">
              {itemDetail.editors.map((editor) => (
                <a key={editor.id}>{editor.name}</a>
              ))}
            </DescriptionsItem>
            <DescriptionsItem label="状态">{DStatus.valueToLabel[itemDetail.status]}</DescriptionsItem>
            <DescriptionsItem label="发布时间">
              <DateTime date={itemDetail.createdTime} />
            </DescriptionsItem>
            <DescriptionsItem label="摘要" span={2}>
              {itemDetail.summary}
            </DescriptionsItem>
            <DescriptionsItem label="内容" span={2}>
              {itemDetail.content}
            </DescriptionsItem>
          </Descriptions>
        ) : (
          <Skeleton active />
        )}
      </div>
    </DialogPage>
  );
};

export default exportView(memo(Component));
