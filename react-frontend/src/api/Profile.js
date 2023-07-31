import api from './api';

export const getProfile = async () => {
    return api.get('/profile/me');
};
