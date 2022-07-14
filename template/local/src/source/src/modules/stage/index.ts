//封装并导出本模块
import {exportModule} from '@elux/react-web';
import {Model} from './model';
import main from './views/Main';

export default exportModule('stage', Model, {main});
