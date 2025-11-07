
import { Configuration } from './api/configuration';

export const apiConfig = new Configuration({
    basePath: 'http://localhost:8080',
    accessToken: () => {
        const t = localStorage.getItem('auth_token');
        return t ? t : '';
    }
});
