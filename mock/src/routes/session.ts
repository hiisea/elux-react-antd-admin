import {Router} from 'express';
import {IGetNotices} from '@/modules/admin/entity';
import {IGetCurUser, ILogin, ILogout} from '@/modules/stage/entity';
import {adminUser, database, guestUser} from '../database';

const router = Router();

router.get('/', function (req, res, next) {
  const result: IGetCurUser['Response'] = database.curUser;
  setTimeout(() => res.json(result), 500);
});

router.put('/', function (req, res, next) {
  const {username = '', password = ''}: ILogin['Request'] = req.body;
  if (username === 'admin' && password === '123456') {
    database.curUser = adminUser;
    const result: ILogin['Response'] = adminUser;
    setTimeout(() => res.json(result), 500);
  } else {
    res.status(422).json({
      message: '用户名或密码错误！',
    });
  }
});

router.delete('/', function (req, res, next) {
  database.curUser = guestUser;
  const result: ILogout['Response'] = database.curUser;
  setTimeout(() => res.json(result), 500);
});

router.get('/notices', function (req, res, next) {
  const result: IGetNotices['Response'] = {num: Math.floor(Math.random() * 100)};
  setTimeout(() => res.json(result), 500);
});

export default router;
