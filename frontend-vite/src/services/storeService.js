import api from './api'

export const storeService = {
  getAllStores: () => api.get('/stores'),

  getStoreById: (id) => api.get(`/stores/${id}`),

  getStoresWithRating: () => api.get('/stores/with-user-rating'),

  createStore: (data) =>
    api.post('/stores', {
      name: data.name,
      location: data.location,
      category: data.category,
      description: data.description,
    }),

  updateStore: (id, data) =>
    api.put(`/stores/${id}`, data),

  deleteStore: (id) =>
    api.delete(`/stores/${id}`),

  searchStores: (query) =>
    api.get('/stores', { params: { search: query } }),
}

export default storeService