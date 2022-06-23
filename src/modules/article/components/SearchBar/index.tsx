import {FC, memo, useCallback, useState} from 'react';
import styles from './index.module.less';

interface Props {
  keyword: string;
  onSubmit: (keyword: string) => void;
  onCreate: () => void;
}

const Component: FC<Props> = ({keyword, onSubmit, onCreate}) => {
  const [keywordProp, setKeywordProp] = useState(keyword);
  const [keywordInput, setKeywordInput] = useState(keyword);
  if (keyword !== keywordProp) {
    setKeywordProp(keyword);
    setKeywordInput(keyword);
  }
  const onSubmitHandler = useCallback(() => {
    onSubmit(keywordInput);
  }, [keywordInput, onSubmit]);
  const onCreateHandler = useCallback(() => {
    onCreate();
  }, [onCreate]);

  return (
    <div className={styles.root}>
      <input
        className="keyword"
        name="keyword"
        type="text"
        placeholder="请输入搜索关键字..."
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value.trim())}
      />
      <button className="search" onClick={onSubmitHandler}>
        搜索
      </button>
      <div className="add" onClick={onCreateHandler}>
        +新增
      </div>
    </div>
  );
};

export default memo(Component);
