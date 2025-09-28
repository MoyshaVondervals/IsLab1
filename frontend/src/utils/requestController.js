import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import {clearAuthData} from "../redux/authSlice";
import {useDispatch} from "react-redux";

const useApiClient = (baseURL: string = 'http://localhost:8080') => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const request = async (
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse> => {
        try {
            const url = config?.baseURL
                ? `${config.baseURL}${endpoint}`
                : `${baseURL}${endpoint}`;

            const response = await axios({
                method,
                url,
                data,
                ...config,
            });

            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // if (error.response.status === 403) {
                //     alert("Сессия истекла")
                //     // dispatch(clearAuthData());
                //     // navigate('/');
                // }

                throw error;
            }

            throw error;
        }
    };

    // Методы для удобства
    const get = (endpoint: string, config?: AxiosRequestConfig) =>
        request('get', endpoint, undefined, config);

    const post = (endpoint: string, data?: any, config?: AxiosRequestConfig) =>
        request('post', endpoint, data, config);

    const put = (endpoint: string, data?: any, config?: AxiosRequestConfig) =>
        request('put', endpoint, data, config);

    const patch = (endpoint: string, data?: any, config?: AxiosRequestConfig) =>
        request('patch', endpoint, data, config);

    const del = (endpoint: string, config?: AxiosRequestConfig) =>
        request('delete', endpoint, undefined, config);

    return {
        get,
        post,
        put,
        patch,
        delete: del,
        rawRequest: request,
        setBaseURL: (newBaseURL: string) => { baseURL = newBaseURL; },
    };
};

export default useApiClient;