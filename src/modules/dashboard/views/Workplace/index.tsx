import {DocumentHead, Link, exportView} from '@elux/react-web';
import {FC, memo} from 'react';
import styles from './index.module.less';

const ProjectDirs = `
  src
  ├── modules
  │      ├── stage //总的根模块
  │      ├── admin //admin根模块
  │      ├── dashboard //工作台模块
  │      ├── article //文章模块
  │      ├── comment //评论模块
  │      └── member //用户模块

`;

const RouterCodding = `
  await api.createItem!({id, data}); //await 创建API
  await this.getRouter().back(1, 'window'); //await 返回列表页面
  message.success('新增成功！'); //提示
  this.getRouter().back(0, 'page'); //刷新页面

`;
const Component: FC = () => {
  return (
    <div className={styles.root}>
      <DocumentHead title="我的工作台" />
      <h2>关于本项目</h2>
      <p>
        本项目基于<cite>Elux+React+Antd</cite>框架开发，其立意不在于展示多么漂亮的UI组件<span>（UI组件的轮子已经很多了）</span>
        ，而是通用的工程结构和可复用的增删改查逻辑和代码。借助于<cite>Restful</cite>
        的理念，任何业务动作其实都可以抽象为<cite>对资源的增删改查</cite>
        ，所以对于并不追求个性化的后退管理系统来说，绝大部分工作都是<em>表单</em>和<em>增删改查</em>
        。如果能把它们编写成抽象的、可复用的、可扩展的通用代码，则可以节省我们大量的编码时间，这也是近来流行的<cite>低代码平台</cite>
        赖以发展的理论基础...
      </p>
      <p></p>
      <h2>项目特色</h2>
      <ul>
        <li>提供通用的项目脚手架。</li>
        <li>
          提供通用的<cite>Admin</cite>系统<cite>Layout</cite>。
        </li>
        <li>
          动态获取<cite>Menu</cite>菜单、轮询最新消息。
        </li>
        <li>
          提供<cite>收藏夹书签</cite>功能，用其代替<cite>Page选项卡</cite>，操作更灵活。点击左上角[<span>+收藏</span>]试试...
        </li>
        <li>
          提供<cite>&lt;DocumentHead&gt;</cite>组件，方便在SinglePage中维护<cite>Document Title</cite>。
        </li>
        <li>
          提供可配置的列表搜索表单，有高级搜索条件时自动展开高级搜索：
          <Link to="/admin/member/list/maintain?email=u.mese%40jww.gh" action="push" target="page">
            展开高级
          </Link>
          <span> / </span>
          <Link to="/admin/member/list/maintain" action="push" target="page">
            隐藏高级
          </Link>
        </li>
        <li>
          提供跨页选取、review已选取、批量操作等功能，如：
          <Link to="/admin/member/list/maintain" action="push" target="page">
            跨页选取及批量操作
          </Link>
        </li>
        <li>
          在一种资源中，如何查询并引用另外一种资源，如：
          <Link to="/admin/article/item/edit" action="push" target="window" cname="_dialog">
            创建文章时，查询并选择责任编辑
          </Link>
        </li>
        <li>
          提供双栈单链<cite>虚拟路由</cite>
          ，不仅可以拥有二维的历史栈，还能访问历史记录、保持历史快照、对路由编程、等待。例如新增用户后，需要返回列表页面并刷新：
          <pre>{RouterCodding}</pre>
        </li>
        <li>
          支持<cite>虚拟窗口</cite>：
          <ul>
            <li>
              提供路由跳转时新开窗口，类似于原生<cite>window.open</cite>操作，如：
              <Link to="/admin/article/list/index?author=48" action="push" target="window" cname="_dialog">
                新窗口打开
              </Link>
              <span> / </span>
              <Link to="/admin/article/list/index?author=48" action="push" target="page">
                本窗口打开
              </Link>
            </li>
            <li>
              窗口中可以再开新窗口，最多可达<cite>10</cite>级
            </li>
            <li>每个窗口不仅拥有独立的Dom、状态管理Store、还自动维护独立的历史记录栈</li>
            <li>
              提供窗口工具条：<cite>后退、刷新、关闭</cite>，如：
              <Link to="/admin/article/list/index?author=48" action="push" target="window" cname="_dialog">
                文章列表，然后再点击标题
              </Link>
            </li>
            <li>
              支持窗口最大化，如：
              <Link to="/admin/article/item/edit" action="push" target="window" cname="_dialog">
                创建文章
              </Link>
            </li>
            <li>
              窗口可以通过<cite>Url记录</cite>发送，如将
              <cite>{`${document.location.protocol}//${document.location.host}/admin/member/item/edit/50?__c=_dialog`}</cite>
              发送给好友后，其可以通过<cite>Url记录</cite>还原窗口
            </li>
          </ul>
        </li>
        <li>
          基于抽象的<cite>增删改查</cite>逻辑：
          <ul>
            <li>
              通过类的继承<cite>class Model extends BaseResource</cite>复用Model业务逻辑
            </li>
            <li>
              通过<cite>React Hooks</cite>复用UI逻辑
            </li>
            <li>
              将视图抽象成为2大类：<em>列表</em>(List)和<em>单条</em>(Item)
            </li>
            <li>
              在此基础上引入<em>视图渲染器</em>(Render)概念，如：
              <ul>
                <li>
                  render=<cite>maintain</cite>(列表+维护)，如：
                  <Link to="/admin/member/list/maintain" action="push" target="page">
                    /admin/member/list/maintain
                  </Link>
                </li>
                <li>
                  render=<cite>index</cite>(列表+展示)，如：
                  <Link to="/admin/article/list/index?author=49" action="push" target="window" cname="_dialog">
                    /admin/article/list/index
                  </Link>
                </li>
                <li>
                  render=<cite>selector</cite>(列表+选择)，如：
                  <Link to="/admin/member/list/selector?role=editor&status=enable" action="push" target="window" cname="_dialog">
                    /admin/member/list/selector
                  </Link>
                </li>
                <li>
                  render=<cite>detail</cite>(单条+展示)，如：
                  <Link to="/admin/member/item/detail/49" action="push" target="window" cname="_dialog">
                    /admin/member/item/detail/49
                  </Link>
                </li>
                <li>
                  render=<cite>detail</cite>(单条+编辑)，如：
                  <Link to="/admin/member/item/edit/49" action="push" target="window" cname="_dialog">
                    /admin/member/item/edit/49
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          基于<cite>微模块</cite>架构，每个业务功能封装成一个独立的<cite>功能模块</cite>
          ，想要哪个功能就安装哪个模块，并支持异步按需加载，src下不再凌乱不堪：
          <pre>{ProjectDirs}</pre>
        </li>
        <li>还有更多彩蛋有待补充，或者自己探索吧...</li>
      </ul>
      <h2>关于Elux</h2>
      <p>
        基于“微模块”和“模型驱动”的跨平台、跨框架『同构方案』
        <br />
        官网：
        <a href="https://eluxjs.com/" target="_blank" rel="noreferrer">
          https://eluxjs.com/
        </a>
        <br />
        Github：
        <a href="https://github.com/hiisea/elux-react-antd-admin" target="_blank" rel="noreferrer">
          https://github.com/hiisea/elux-react-antd-admin
        </a>
        <br />
        Gitee：
        <a href="https://gitee.com/hiisea/elux-react-antd-admin-fork" target="_blank" rel="noreferrer">
          https://gitee.com/hiisea/elux-react-antd-admin-fork
        </a>
        <br />
        完全开源免费，喜欢拿去，觉得好用别忘了<cite>Github</cite>给个<cite>Star</cite>(-_-)...
      </p>
    </div>
  );
};

export default exportView(memo(Component));
