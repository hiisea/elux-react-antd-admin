import {CurUser} from '@elux-admin-antd/stage/entity';
import mockjs from 'mockjs';
import type {ItemDetail as Article} from '@elux-admin-antd/article/entity';
import type {ItemDetail as Member} from '@elux-admin-antd/member/entity';

const timestamp = Date.now();

export const guestUser: CurUser = {
  id: '0',
  username: 'guest',
  hasLogin: false,
  avatar: 'imgs/guest.png',
  mobile: '',
};
export const adminUser: CurUser = {
  id: '1',
  username: 'admin',
  hasLogin: true,
  avatar: 'imgs/admin.jpg',
  mobile: '18498982234',
};

function createMembers(): {[id: string]: Member} {
  const listData = {};
  mockjs
    .mock({
      'list|50': [
        {
          'id|+1': 1,
          name: '@last',
          nickname: '@cname',
          'gender|1': ['male', 'female', 'unknow'],
          'role|1': ['consumer', 'admin', 'editor'],
          'status|1': ['enable', 'disable', 'enable'],
          articles: 0,
          email: '@email',
          loginTime: timestamp,
          createdTime: timestamp,
        },
      ],
    })
    .list.forEach((item: Member, index: number) => {
      item.createdTime = timestamp + index * 1000;
      item.id = `${item.id}`;
      listData[item.id] = item;
    });
  return listData;
}

const members = createMembers();

function createArticles(): {[id: string]: Article} {
  const authors: string[] = [];
  const editors: string[] = [];

  for (const id in members) {
    const member = members[id];
    authors.push([id, member.name].join(','));
    if (member.role === 'editor' && member.status === 'enable') {
      editors.push([id, member.name].join(','));
    }
    authors.splice(0, authors.length - 5);
    editors.splice(0, editors.length - 5);
  }

  const listData = {};

  mockjs
    .mock({
      'list|50': [
        {
          'id|+1': 1,
          title: '@ctitle(10, 20)',
          summary: '@cparagraph(5, 8)',
          content: '@cparagraph(10, 20)',
          'author|1': authors,
          editors: () => {
            const start = Math.floor(Math.random() * (editors.length - 1));
            return editors.slice(start, start + 2);
          },
          createdTime: timestamp,
          'status|1': ['pending', 'resolved', 'rejected'],
        },
      ],
    })
    .list.forEach((item: Article, index: number) => {
      item.createdTime = timestamp + index * 1000;
      item.id = `${item.id}`;
      const authorId = item.author.split(',', 1)[0];
      members[authorId].articles++;
      listData[item.id] = item;
    });
  return listData;
}

const articles = createArticles();

export const database = {
  curUser: guestUser,
  members,
  articles,
};
