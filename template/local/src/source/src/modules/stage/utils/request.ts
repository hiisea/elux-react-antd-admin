import axios, {AxiosError, AxiosResponse} from 'axios';
import {ApiPrefix} from '@/Global';
import {CommonErrorCode, CustomError} from './errors';

function mapHttpErrorCode(code: string): CommonErrorCode {
  const HttpErrorCode = {
    '401': CommonErrorCode.unauthorized,
    '403': CommonErrorCode.forbidden,
    '404': CommonErrorCode.notFound,
  };
  return HttpErrorCode[code] || CommonErrorCode.unkown;
}
const instance = axios.create({timeout: 15000});

instance.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  return {...req, headers: {Authorization: token}, url: req.url!.replace('/api/', ApiPrefix)};
});

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error: AxiosError<{message: string}>) => {
    const httpErrorCode = error.response ? error.response.status : 0;
    const statusText = error.response ? error.response.statusText : '';
    const responseData: any = error.response ? error.response.data : '';
    const errorMessage = responseData.message || `${statusText}, failed to call ${error.config.url}`;
    throw new CustomError(mapHttpErrorCode(httpErrorCode.toString()), errorMessage, responseData);
  }
);

export default instance;
