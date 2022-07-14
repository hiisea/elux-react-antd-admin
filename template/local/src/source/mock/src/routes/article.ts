import {Router} from 'express';
import {database} from '../database';
import type {IAlterItems, ICreateItem, IGetItem, IGetList, ListItem, Status} from '@elux-admin-antd/article/entity';

type Query<T> = {[K in keyof T]: string};

const router = Router();

router.get('/', function ({query}: {query: Query<IGetList['Request']>}, res, next) {
  const {pageCurrent, pageSize, title, author, editor, status, sorterField, sorterOrder} = {
    pageCurrent: parseInt(query.pageCurrent || '1'),
    pageSize: parseInt(query.pageSize || '10'),
    title: query.title || '',
    author: (query.author || '').split(',', 1)[0],
    editor: (query.editor || '').split(',', 1)[0],
    status: query.status || '',
    sorterField: query.sorterField || '',
    sorterOrder: query.sorterOrder || '',
  };

  const start = (pageCurrent - 1) * pageSize;
  const end = start + pageSize;

  const dataMap = database.articles;
  let listData = Object.keys(dataMap)
    .reverse()
    .map((id) => {
      return dataMap[id];
    });

  if (title) {
    listData = listData.filter((item) => item.title.includes(title));
  }
  if (author) {
    listData = listData.filter((item) => item.author.split(',', 1)[0] === author);
  }
  if (editor) {
    listData = listData.filter(
      (item) => item.editors[0].split(',', 1)[0] === editor || (item.editors[1] && item.editors[1].split(',', 1)[0] === editor)
    );
  }
  if (status) {
    listData = listData.filter((item) => item.status === status);
  }

  if (sorterField === 'createdTime') {
    if (sorterOrder === 'ascend') {
      listData.sort((a: ListItem, b: ListItem) => {
        return a.createdTime - b.createdTime;
      });
    } else if (sorterOrder === 'descend') {
      listData.sort((a, b) => {
        return b.createdTime - a.createdTime;
      });
    }
  }
  if (sorterField === 'author') {
    if (sorterOrder === 'ascend') {
      listData.sort((a: ListItem, b: ListItem) => {
        return a.author.split(',')[1].charCodeAt(0) - b.author.split(',')[1].charCodeAt(0);
      });
    } else if (sorterOrder === 'descend') {
      listData.sort((a, b) => {
        return b.author.split(',')[1].charCodeAt(0) - a.author.split(',')[1].charCodeAt(0);
      });
    }
  }

  const result: IGetList['Response'] = {
    listSummary: {
      pageCurrent,
      pageSize,
      totalItems: listData.length,
      totalPages: Math.ceil(listData.length / pageSize),
    },
    list: listData.slice(start, end).map((item) => ({...item, summary: '', content: ''})),
  };

  setTimeout(() => res.json(result), 500);
});

router.get('/:id', function ({params}: {params: IGetItem['Request']}, res, next) {
  const {id} = params;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    const result: IGetItem['Response'] = item;
    setTimeout(() => res.json(result), 500);
  }
});

router.put('/:id', function ({params, body}: {params: {id: string}; body: IAlterItems['Request']['data']}, res, next) {
  const ids = params.id.split(',');
  ids.forEach((id) => {
    const item = database.articles[id];
    if (item) {
      Object.assign(item, body);
    }
  });
  setTimeout(() => res.json({}), 500);
});

router.post('/', function ({body}: {body: ICreateItem['Request']}, res, next) {
  const id = (Object.keys(database.articles).length + 1).toString();
  const members = database.members;
  const memberId = Object.keys(database.members).pop() as string;
  const author = members[memberId];
  database.articles[id] = {...body, author: [author.id, author.name].join(','), createdTime: Date.now(), status: 'pending' as Status, id};
  author.articles++;
  const result: ICreateItem['Response'] = {id};
  setTimeout(() => res.json(result), 500);
});

router.delete('/:id', function ({params}: {params: {id: string}}, res, next) {
  const ids = params.id.split(',');
  ids.forEach((id) => {
    delete database.articles[id];
  });
  setTimeout(() => res.json({}), 500);
});

export default router;
