import mockjs from 'mockjs';
import {ItemDetail as Article} from '@/modules/article/entity';
import {CurUser} from '@/modules/stage/entity';

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

function createArticles(): {[id: string]: Article} {
  const listData = {};
  mockjs
    .mock({
      'list|100': [
        {
          'id|+1': 1,
          title: '@ctitle(10, 20)',
          summary: '@csentence(50, 60)',
          content: '@cparagraph(50, 100)',
        },
      ],
    })
    .list.forEach((item: Article) => {
      item.id = `${item.id}`;
      listData[item.id] = item;
    });
  return listData;
}

export const database: {
  curUser: CurUser;
  articles: {[id: string]: Article};
} = {
  curUser: guestUser,
  articles: createArticles(),
};
