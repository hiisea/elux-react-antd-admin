import {Router} from 'express';
import {IGetMenu, IGetNotices} from '@/modules/admin/entity';
import {IGetCurUser, ILogin, ILogout, IRegistry, IResetPassword, ISendCaptcha} from '@/modules/stage/entity';
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

router.post('/', function (req, res, next) {
  const {username = '', password = ''}: IRegistry['Request'] = req.body;
  if (username && password) {
    const curUser = {...adminUser, username, password};
    database.curUser = curUser;
    const result: IRegistry['Response'] = curUser;
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

router.put('/resetPassword', function (req, res, next) {
  const {phone = '', password = '', captcha = ''}: IResetPassword['Request'] = req.body;
  if (phone && password && captcha) {
    setTimeout(() => res.json({}), 500);
  } else {
    res.status(422).json({
      message: '参数错误！',
    });
  }
});

router.post('/sendCaptcha', function (req, res, next) {
  const {phone = ''}: ISendCaptcha['Request'] = req.body;
  if (phone) {
    setTimeout(() => res.json({}), 500);
  } else {
    res.status(422).json({
      message: '参数错误！',
    });
  }
});

router.get('/notices', function (req, res, next) {
  const result: IGetNotices['Response'] = {num: Math.floor(Math.random() * 100)};
  setTimeout(() => res.json(result), 500);
});

router.get('/menu', function (req, res, next) {
  const result: IGetMenu['Response'] = [
    {
      key: 'dashboard',
      label: '概要总览',
      icon: 'dashboard',
      match: '/admin/dashboard/',
      link: '/admin/dashboard/workplace',
    },
    {
      key: 'member',
      label: '用户管理',
      icon: 'user',
      match: '/admin/member/',
      link: '/admin/member/list',
    },
    {
      key: 'article',
      label: '文章管理',
      icon: 'post',
      children: [
        {
          key: 'articleList',
          label: '文章列表',
          match: '/admin/article',
          link: '/admin/article',
        },
        {
          key: 'commentList',
          label: '评论列表',
          match: '/admin/comment',
          link: '/admin/comment',
        },
      ],
    },
  ];
  setTimeout(() => res.json(result), 500);
});

export default router;
