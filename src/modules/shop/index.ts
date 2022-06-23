import {exportModule} from '@elux/react-web';
import {Model} from './model';
import main from './views/Main';

const shop = exportModule('shop', Model, {main});
export default shop;

export type Shop = typeof shop;
