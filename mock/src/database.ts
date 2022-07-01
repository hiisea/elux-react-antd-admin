import mockjs from 'mockjs';
import {ItemDetail as Member} from '@/modules/member/entity';
import {CurUser} from '@/modules/stage/entity';

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

// function createArticles(): {[id: string]: Article} {
//   const listData = {};
//   mockjs
//     .mock({
//       'list|50': [
//         {
//           'id|+1': 1,
//           title: '@ctitle(10, 20)',
//           summary: '@csentence(50, 60)',
//           content: '@cparagraph(50, 100)',
//         },
//       ],
//     })
//     .list.forEach((item: Article) => {
//       item.id = `${item.id}`;
//       listData[item.id] = item;
//     });
//   return listData;
// }

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

export const database: {
  curUser: CurUser;
  members: {[id: string]: Member};
  //articles: {[id: string]: Article};
} = {
  curUser: guestUser,
  members: createMembers(),
  //articles: createArticles(),
};
