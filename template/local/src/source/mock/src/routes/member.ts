import {Router} from 'express';
import {database} from '../database';
import type {IAlterItems, ICreateItem, IGetItem, IGetList, ListItem} from '@elux-admin-antd/member/entity';

type Query<T> = {[K in keyof T]: string};

const router = Router();

router.get('/', function ({query}: {query: Query<IGetList['Request']>}, res, next) {
  const {pageCurrent, pageSize, name, nickname, role, status, email, sorterField, sorterOrder} = {
    pageCurrent: parseInt(query.pageCurrent || '1'),
    pageSize: parseInt(query.pageSize || '10'),
    name: query.name || '',
    nickname: query.nickname || '',
    role: query.role || '',
    status: query.status || '',
    email: query.email || '',
    sorterField: query.sorterField || '',
    sorterOrder: query.sorterOrder || '',
  };

  const start = (pageCurrent - 1) * pageSize;
  const end = start + pageSize;

  const dataMap = database.members;
  let listData = Object.keys(dataMap)
    .reverse()
    .map((id) => {
      return dataMap[id];
    });

  if (name) {
    listData = listData.filter((item) => item.name.includes(name));
  }
  if (nickname) {
    listData = listData.filter((item) => item.nickname.includes(nickname));
  }
  if (role) {
    listData = listData.filter((item) => item.role === role);
  }
  if (status) {
    listData = listData.filter((item) => item.status === status);
  }
  if (email) {
    listData = listData.filter((item) => item.email === email);
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
  if (sorterField === 'name') {
    if (sorterOrder === 'ascend') {
      listData.sort((a: ListItem, b: ListItem) => {
        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
      });
    } else if (sorterOrder === 'descend') {
      listData.sort((a, b) => {
        return b.name.charCodeAt(0) - a.name.charCodeAt(0);
      });
    }
  }
  if (sorterField === 'articles') {
    if (sorterOrder === 'ascend') {
      listData.sort((a: ListItem, b: ListItem) => {
        return a.articles - b.articles;
      });
    } else if (sorterOrder === 'descend') {
      listData.sort((a, b) => {
        return b.articles - a.articles;
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
    list: listData.slice(start, end).map((item) => ({...item, content: ''})),
  };

  setTimeout(() => res.json(result), 500);
});

router.get('/:id', function ({params}: {params: IGetItem['Request']}, res, next) {
  const {id} = params;
  const item = database.members[id];
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
    const item = database.members[id];
    if (item) {
      Object.assign(item, body);
    }
  });
  setTimeout(() => res.json({}), 500);
});

router.post('/', function ({body}: {body: ICreateItem['Request']}, res, next) {
  const id = (Object.keys(database.members).length + 1).toString();
  database.members[id] = {...body, articles: 0, createdTime: Date.now(), id};
  const result: ICreateItem['Response'] = {id};
  setTimeout(() => res.json(result), 500);
});

router.delete('/:id', function ({params}: {params: {id: string}}, res, next) {
  const ids = params.id.split(',');
  ids.forEach((id) => {
    delete database.members[id];
  });
  setTimeout(() => res.json({}), 500);
});

export default router;
