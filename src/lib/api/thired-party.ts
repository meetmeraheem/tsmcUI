import axios from 'axios';
import { smsBaseURL } from '../../config/constants';

export const thiredPartyAxiosInstance = axios.create({
    withCredentials: false
});

thiredPartyAxiosInstance.interceptors.request.use(
    (config) => {
        if (config.headers) {
            config.headers['Access-Control-Allow-Origin'] =  "*";
            config.headers['Access-Control-Allow-Credentials'] = "true";
            config.headers['Access-Control-Allow-Methods'] = "GET,HEAD,OPTIONS,POST,PUT";
            config.headers['Access-Control-Allow-Headers'] = "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

thiredPartyAxiosInstance.interceptors.response.use(
    (response) => {
        //console.log('response ' + JSON.stringify(response));
        return response;
    },
    async (error) => {
        console.log('error ' + JSON.stringify(error));
        return Promise.reject(error);
    }
);
