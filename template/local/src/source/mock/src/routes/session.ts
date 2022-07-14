import {Router} from 'express';
import {adminUser, database, guestUser} from '../database';
import type {IGetMenu, IGetNotices} from '@elux-admin-antd/admin/entity';
import type {IGetCurUser, ILogin, ILogout, IRegistry, IResetPassword, ISendCaptcha} from '@elux-admin-antd/stage/entity';

const router = Router();

router.get('/', function (req, res, next) {
  const result: IGetCurUser['Response'] = database.curUser;
  setTimeout(() => res.json(result), 500);
});

router.put('/', function ({body}: {body: ILogin['Request']}, res, next) {
  const {username = '', password = ''} = body;
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

router.post('/', function ({body}: {body: IRegistry['Request']}, res, next) {
  const {username = '', password = ''} = body;
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

router.put('/resetPassword', function ({body}: {body: IResetPassword['Request']}, res, next) {
  const {phone = '', password = '', captcha = ''} = body;
  if (phone && password && captcha) {
    setTimeout(() => res.json({}), 500);
  } else {
    res.status(422).json({
      message: '参数错误！',
    });
  }
});

router.post('/sendCaptcha', function ({body}: {body: ISendCaptcha['Request']}, res, next) {
  const {phone = ''} = body;
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
      link: '/admin/member/list/maintain',
    },
    {
      key: 'article',
      label: '文章管理',
      icon: 'post',
      children: [
        {
          key: 'articleList',
          label: '文章列表',
          match: '/admin/article/',
          link: '/admin/article/list/maintain',
        },
        {
          key: 'commentList',
          label: '评论列表',
          match: '/admin/comment/',
          link: '/admin/comment/list/maintain',
        },
      ],
    },
  ];
  setTimeout(() => res.json(result), 500);
});

export default router;
