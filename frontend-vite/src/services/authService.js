import api from './api'

const handleError = (error, defaultMessage) => {
  const msg =
    error?.response?.data?.errors?.[0]?.msg ||
    error?.response?.data?.message ||
    defaultMessage

  const err = new Error(msg)
  err.original = error
  throw err
}

export const authService = {
  register: async (data) => {
    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
      })
      return res.data
    } catch (error) {
      handleError(error, 'Registration failed')
    }
  },

  // REPLACE your current login with this
  login: async (email, password) => {
    console.log('LOGIN FROM UI:', `"${email}"`)
    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })
      return res.data
    } catch (error) {
      handleError(error, 'Login failed')
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      })
      return res.data
    } catch (error) {
      handleError(error, 'Password change failed')
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export default authService
