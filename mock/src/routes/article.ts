import {Router} from 'express';
import {ICreateItem, IDeleteItem, IGetItem, IGetList, IUpdateItem} from '@/modules/article/entity';
import {database} from '../database';
import {extractQuery} from '../utils';

const router = Router();

router.get('/', function (req, res, next) {
  const args = extractQuery({pageCurrent: '', keyword: ''}, req.query);
  const query = {
    pageCurrent: parseInt(args.pageCurrent, 10) || 1,
    keyword: args.keyword,
  };
  const {pageCurrent, keyword} = query;

  const pageSize = 10;
  const start = (pageCurrent - 1) * pageSize;
  const end = start + pageSize;

  const dataMap = database.articles;
  let listData = Object.keys(dataMap)
    .reverse()
    .map((id) => {
      return dataMap[id];
    });

  if (keyword) {
    listData = listData.filter((item) => item.title.includes(keyword));
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
  const item = database.articles[id];
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
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    delete database.articles[id];
    const result: IDeleteItem['Response'] = {id};
    setTimeout(() => res.json(result), 500);
  }
});

router.put('/:id', function (req, res, next) {
  const args = extractQuery({id: '', title: '', summary: '', content: ''}, req.body);
  const {id, title, summary, content} = args;
  const item = database.articles[id];
  if (!item) {
    res.status(404).end();
  } else {
    database.articles[id] = {id, title, summary, content};
    const result: IUpdateItem['Response'] = {id};
    setTimeout(() => res.json(result), 500);
  }
});

router.post('/', function (req, res, next) {
  const args = extractQuery({title: '', summary: '', content: ''}, req.body);
  const {title, summary, content} = args;
  const id = 'n' + Object.keys(database.articles).length;
  database.articles[id] = {id, title, summary, content};
  const result: ICreateItem['Response'] = {id};
  setTimeout(() => res.json(result), 500);
});
export default router;
