import api from './api';

//Not Done...
export const getAccessByUserId = async () => {
    return api.get('/users/me');
};
