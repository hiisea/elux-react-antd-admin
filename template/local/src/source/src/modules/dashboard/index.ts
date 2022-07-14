import {exportModule} from '@elux/react-web';
import {Model} from './model';
import main from './views/Main';

export default exportModule('dashboard', Model, {main});
