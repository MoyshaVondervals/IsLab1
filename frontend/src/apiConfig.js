import {Configuration} from './api/configuration';

export const apiConfig = new Configuration({
    basePath: process.env.REACT_APP_API_URL || 'http://localhost:8054',
    accessToken: () => {
        const t = localStorage.getItem('auth_token');
        return t ? t : '';
    }
});
