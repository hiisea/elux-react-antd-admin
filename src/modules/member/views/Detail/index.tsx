import DateTime from '@elux-admin-antd/stage/components/DateTime';
import DialogPage from '@elux-admin-antd/stage/components/DialogPage';
import {DocumentHead, Link, exportView} from '@elux/react-web';
import {Button, Descriptions, Skeleton} from 'antd';
import {FC, memo} from 'react';
import {DGender, DRole, DStatus, ItemDetail} from '../../entity';
import styles from './index.module.less';

const DescriptionsItem = Descriptions.Item;

interface Props {
  itemDetail?: ItemDetail;
}

const Component: FC<Props> = ({itemDetail}) => {
  return (
    <DialogPage title="用户详情" subject="用户详情" mask footer>
      <div className={`${styles.root} g-dialog-content`}>
        {itemDetail ? (
          <Descriptions bordered column={2}>
            <DescriptionsItem label="用户名">{itemDetail.name}</DescriptionsItem>
            <DescriptionsItem label="呢称">{itemDetail.nickname}</DescriptionsItem>
            <DescriptionsItem label="性别">{DGender.valueToLabel[itemDetail.gender]}</DescriptionsItem>
            <DescriptionsItem label="角色">{DRole.valueToLabel[itemDetail.role]}</DescriptionsItem>
            <DescriptionsItem label="发布文章">
              <a>{itemDetail.articles}</a>
            </DescriptionsItem>
            <DescriptionsItem label="状态">
              <span className={`g-${itemDetail.status}`}>{DStatus.valueToLabel[itemDetail.status]}</span>
            </DescriptionsItem>
            <DescriptionsItem label="Email">{itemDetail.email}</DescriptionsItem>
            <DescriptionsItem label="注册时间">
              <DateTime date={itemDetail.createdTime} />
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
