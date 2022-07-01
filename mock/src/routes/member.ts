import {Router} from 'express';
import {ICreateItem, IDeleteItem, IGetItem, IGetList, IUpdateItem} from '@/modules/member/entity';
import {database} from '../database';
import {extractQuery} from '../utils';

const router = Router();

router.get('/', function (req, res, next) {
  const args = extractQuery({pageCurrent: '', name: '', nickname: '', role: '', status: '', email: ''}, req.query);
  const query = {
    pageCurrent: parseInt(args.pageCurrent, 10) || 1,
    name: args.name,
    nickname: args.nickname,
    role: args.role,
    status: args.status,
    email: args.email,
  };
  const {pageCurrent, name, nickname, role, status, email} = query;

  const pageSize = 10;
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

router.get('/:id', function (req, res, next) {
  const params = extractQuery({id: ''}, req.params);
  const {id} = params;
  const item = database.members[id];
  if (!item) {
    res.status(404).end();
  } else {
    const result: IGetItem['Response'] = {...item};
    setTimeout(() => res.json(result), 500);
  }
});

router.delete('/:id', function (req, res, next) {
  const params = extractQuery({id: ''}, req.params);
  const {id} = params;
  const item = database.members[id];
  if (!item) {
    res.status(404).end();
  } else {
    delete database.members[id];
    const result: IDeleteItem['Response'] = {id};
    setTimeout(() => res.json(result), 500);
  }
});

router.put('/:id', function (req, res, next) {
  const args = extractQuery({id: '', title: '', summary: '', content: ''}, req.body);
  const {id, title, summary, content} = args;
  const item = database.members[id];
  if (!item) {
    res.status(404).end();
  } else {
    //database.members[id] = {id, title, summary, content};
    const result: IUpdateItem['Response'] = {id};
    setTimeout(() => res.json(result), 500);
  }
});

router.post('/', function (req, res, next) {
  const args = extractQuery({title: '', summary: '', content: ''}, req.body);
  const {title, summary, content} = args;
  const id = 'n' + Object.keys(database.members).length;
  //database.members[id] = {id, title, summary, content};
  const result: ICreateItem['Response'] = {id};
  setTimeout(() => res.json(result), 500);
});

router.put('/', function (req, res, next) {
  const {ids = [], data = {}} = req.body as {ids: string[]; data: Record<string, any>};
  ids.forEach((id) => {
    const item = database.members[id];
    if (item) {
      Object.assign(item, data);
    }
  });
  setTimeout(() => res.json({}), 500);
});

export default router;
