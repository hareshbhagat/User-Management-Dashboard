import axiosInstance from '../services/axiosInstance';

const withConfig = (params, config = {}) => ({ params, ...config });

export const userApi = {
  getUsers: (params = {}, config = {}) =>
    axiosInstance
      .get('/users', withConfig(params, config))
      .then((res) => res.data),

  searchUsers: (query, params = {}, config = {}) =>
    axiosInstance
      .get('/users/search', withConfig({ q: query, ...params }, config))
      .then((res) => res.data),

  getUserById: (id, config = {}) =>
    axiosInstance.get(`/users/${id}`, config).then((res) => res.data),

  createUser: (payload, config = {}) =>
    axiosInstance.post('/users/add', payload, config).then((res) => res.data),

  updateUser: (id, payload, config = {}) =>
    axiosInstance.put(`/users/${id}`, payload, config).then((res) => res.data),

  deleteUser: (id, config = {}) =>
    axiosInstance.delete(`/users/${id}`, config).then((res) => res.data),
};
