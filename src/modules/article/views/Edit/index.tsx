import {Dispatch, DocumentHead, Link, exportView} from '@elux/react-web';
import {FC, memo, useMemo, useState} from 'react';
import {Modules} from '@/Global';
import {ItemDetail} from '../../entity';
import styles from './index.module.less';

interface Props {
  itemDetail?: ItemDetail;
  dispatch: Dispatch;
}

const Component: FC<Props> = ({itemDetail, dispatch}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  useMemo(() => {
    setTitle(itemDetail?.title || '');
    setSummary(itemDetail?.summary || '');
    setContent(itemDetail?.content || '');
  }, [itemDetail]);

  const onSubmit = () => {
    if (!title || !summary || !content) {
      setErrorMessage('请输入文章标题、摘要、内容');
    } else {
      const item = {id: itemDetail!.id, title, summary, content};
      if (item.id) {
        dispatch(Modules.article.actions.updateItem(item));
      } else {
        dispatch(Modules.article.actions.createItem(item));
      }
    }
  };

  return (
    <div className={`${styles.root} g-page-dialog`}>
      <DocumentHead title="编辑文章" />
      <h2>编辑文章</h2>
      <div className="g-form">
        <div className="item">
          <div className="item">标题</div>
          <div className="item">
            <input
              name="title"
              className="g-input"
              type="text"
              placeholder="请输入"
              onChange={(e) => setTitle(e.target.value.trim())}
              value={title}
            />
          </div>
        </div>
        <div className="item">
          <div className="item">摘要</div>
          <div className="item">
            <textarea
              name="summary"
              className="g-input"
              placeholder="请输入"
              rows={2}
              onInput={(e) => setSummary(e.target['value'].trim())}
              value={summary}
            />
          </div>
        </div>
        <div className="item item-last">
          <div className="item">内容</div>
          <div className="item">
            <textarea
              name="content"
              className="g-input"
              placeholder="请输入"
              rows={10}
              onInput={(e) => setContent(e.target['value'].trim())}
              value={content}
            />
          </div>
        </div>
        <div className="item item-error">
          <div className="item"></div>
          <div className="item">{errorMessage}</div>
        </div>
      </div>
      <div className="g-control">
        <button type="submit" className="g-button primary" onClick={onSubmit}>
          提 交
        </button>
        <Link className="g-button" to={1} action="back" target="window">
          取 消
        </Link>
      </div>
    </div>
  );
};

export default exportView(memo(Component));
