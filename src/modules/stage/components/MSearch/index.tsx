import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Form} from 'antd';
import {memo, useCallback, useMemo, useState} from 'react';
import {SearchFromItems} from '../../utils/tools';
import styles from './index.module.less';

interface Props<TFormData> {
  className?: string;
  items: SearchFromItems<TFormData>;
  onSearch: (values: TFormData) => void;
  values: TFormData;
  fixedFields?: Partial<TFormData>; //固定搜索值
  senior?: number; //未展开时显示多少项
  cols?: number; //每行显示多少项
  expand?: boolean;
  onReset?: () => void;
}

function Component<TFormData>(props: Props<TFormData>) {
  const {className = '', items, onSearch, onReset, fixedFields, values, cols = 4} = props;
  const [expand, setExpand] = useState(!!props.expand);
  const list = useMemo(() => {
    return fixedFields ? items.filter((item) => fixedFields[item.name as string] === undefined) : items;
  }, [fixedFields, items]);
  const {senior = 4} = props;
  const shrink = expand ? list.length : senior;

  const {colWidth, arr} = useMemo(() => {
    const cWidth = parseFloat((100 / cols).toFixed(2));
    const cArr: number[] = [];
    let cur = 0;
    list.forEach((item) => {
      // eslint-disable-next-line no-control-regex
      const label = Math.ceil(item.label!.replace(/[^\x00-\xff]/g, 'aa').length / 2);
      const col = item.col || 1;
      if (cur + col > cols) {
        cur = 0;
      }
      item.cite = cur;
      if (label > (cArr[cur] || 0)) {
        cArr[cur] = label;
      }
      cur += col;
    });
    return {colWidth: cWidth, arr: cArr};
  }, [cols, list]);

  const fields = useMemo(() => {
    return values ? list.map(({name}) => ({name: name as string, value: values[name as string]})) : [];
  }, [list, values]);

  const onFinish = useCallback(
    (vals: TFormData) => {
      Object.assign(vals, fixedFields);
      onSearch(vals);
    },
    [fixedFields, onSearch]
  );
  const toggle = useCallback(() => {
    setExpand((_expand) => !_expand);
  }, []);
  return (
    <div className={styles.root + ' ' + className}>
      <Form layout="inline" onFinish={onFinish} fields={fields}>
        {list.map((item, index) => (
          <Form.Item
            name={item.name as string}
            rules={item.rules}
            style={{display: index >= shrink ? 'none' : 'flex', width: `${colWidth * (item.col || 1)}%`}}
            key={item.name as string}
            label={
              <span className="label" style={{width: `${arr[item.cite!]}em`}}>
                {item.label}
              </span>
            }
          >
            {item.formItem!}
          </Form.Item>
        ))}
        <div className="form-btns">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button onClick={onReset}>重置</Button>
          {list.length > senior && (
            <a className="expand" onClick={toggle}>
              {expand ? '收起' : '展开'} {expand ? <UpOutlined /> : <DownOutlined />}
            </a>
          )}
        </div>
      </Form>
    </div>
  );
}

export default memo(Component) as typeof Component;
