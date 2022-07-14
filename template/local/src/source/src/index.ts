/**
 * 该文件是应用的入口文件
 */
import {createApp} from '@elux/react-web';
import {appConfig} from './Project';

createApp(appConfig)
  .render()
  .then(() => {
    const initLoading = document.getElementById('root-loading');
    if (initLoading) {
      initLoading.parentNode!.removeChild(initLoading);
    }
  });
