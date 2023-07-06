import axios from 'axios';
import { apiUrl } from '../../config/constants';
import { tokenManager } from '../token-manager';
import { useNavigate } from "react-router-dom";
import { routes } from "../../containers/routes/routes-names";



export const axiosInstance = axios.create({
    withCredentials: false,
    baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        //this is for token
        const token = tokenManager.getToken();
        if (token && config.headers) {
            config.headers['authorization'] = 'Bearer '+token;
            //config.headers['Content-Type'] = "multipart/form-data";
            // config.headers['Access-Control-Allow-Origin'] =  "*";
            // config.headers['Access-Control-Allow-Credentials'] = "true";
            // config.headers['Access-Control-Allow-Methods'] = "GET,HEAD,OPTIONS,POST,PUT";
            // config.headers['Access-Control-Allow-Headers'] = "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers";
            //config.headers['xc-auth'] = token;
            //config.headers['xc-token'] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        //console.log('response ' + JSON.stringify(response));
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            window.location.href = "/";
           }else{
            console.log('error ' + JSON.stringify(error));
             return Promise.reject(error);
        }
    }
);

