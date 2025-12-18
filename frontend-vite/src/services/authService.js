import api from './api'

export const authService = {
  register: (data) =>
    api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address,
    }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    }),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export default authService