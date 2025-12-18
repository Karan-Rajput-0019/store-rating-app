import api from './api'

export const ratingService = {
  getStoreRatings: (storeId) =>
    api.get(`/ratings/store/${storeId}`),

  getUserRatings: (userId) =>
    api.get(`/ratings/user/${userId}`),

  getUserStoreRating: (storeId) =>
    api.get(`/ratings/user-store/${storeId}`),

  getCurrentUserRatings: () =>
    api.get('/ratings/me'),

  submitRating: (storeId, ratingValue, comment) =>
    api.post('/ratings', {
      store_id: storeId,
      rating: ratingValue,
      comment: comment || '',
    }),

  updateRating: (ratingId, ratingValue, comment) =>
    api.put(`/ratings/${ratingId}`, {
      rating: ratingValue,
      comment: comment || '',
    }),

  deleteRating: (ratingId) =>
    api.delete(`/ratings/${ratingId}`),
}

export default ratingService