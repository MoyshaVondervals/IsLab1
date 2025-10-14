
import { Configuration } from './api/configuration';

export const apiConfig = new Configuration({
    basePath: 'http://127.0.0.1:8083',
    accessToken: () => {
        const t = localStorage.getItem('auth_token');
        return t ? t : '';
    }
});
