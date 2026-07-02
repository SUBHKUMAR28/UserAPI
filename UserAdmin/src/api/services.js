// import api from './axios'

// // Auth
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data),
//   logout: () => api.post('/auth/logout'),
// }

// // Dashboard
// export const dashboardAPI = {
//   get: () => api.get('/dashboard'),
// }

// // Users
// export const usersAPI = {
//   getAll: (params) => api.get('/admin/users', { params }),
//   updateStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
//   updateProfile: (id, data) => api.put(`/admin/users/${id}/profile`, data),
// }

// // KYC
// export const kycAPI = {
//   getAll: (params) => api.get('/admin/kyc', { params }),
//   getById: (id) => api.get(`/admin/kyc/${id}`),
//   updateStatus: (id, data) => api.put(`/admin/kyc/${id}/status`, data),
// }

// // Wallet
// export const walletAPI = {
//   getAll: () => api.get('/admin/wallet'),
//   update: (userId, data) => api.put(`/admin/wallet/${userId}`, data),
// }

// // EMI
// export const emiAPI = {
//   getAll: () => api.get('/admin/emi'),
//   getById: (id) => api.get(`/admin/emi/${id}`),
//   update: (id, data) => api.put(`/admin/emi/${id}`, data),
// }

// // Loans
// export const loansAPI = {
//   getAll: (params) => api.get('/admin/loans', { params }),
//   getById: (id) => api.get(`/admin/loans/${id}`),
//   updateStatus: (id, data) => api.put(`/admin/loans/${id}/status`, data),
// }

// // Transactions
// export const transactionsAPI = {
//   getAll: (params) => api.get('/admin/transactions', { params }),
// }

// // Products
// export const productsAPI = {
//   getAll: () => api.get('/admin/products'),
//   create: (data) => api.post('/admin/products', data),
//   update: (id, data) => api.put(`/admin/products/${id}`, data),
//   delete: (id) => api.delete(`/admin/products/${id}`),
// }

// // Orders
// export const ordersAPI = {
//   getAll: (params) => api.get('/admin/orders', { params }),
//   getById: (id) => api.get(`/admin/orders/${id}`),
//   updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
// }

// // Banners
// export const bannersAPI = {
//   getAll: () => api.get('/admin/banners'),
//   create: (data) => api.post('/admin/banners', data),
//   update: (id, data) => api.put(`/admin/banners/${id}`, data),
//   delete: (id) => api.delete(`/admin/banners/${id}`),
// }

// // Offers
// export const offersAPI = {
//   getAll: () => api.get('/admin/offers'),
//   create: (data) => api.post('/admin/offers', data),
//   update: (id, data) => api.put(`/admin/offers/${id}`, data),
//   delete: (id) => api.delete(`/admin/offers/${id}`),
// }

// // Notifications
// export const notificationsAPI = {
//   getAll: () => api.get('/admin/notifications'),
//   send: (data) => api.post('/admin/notifications', data),
// }

// // Support
// export const supportAPI = {
//   getAll: (params) => api.get('/admin/support', { params }),
//   getById: (id) => api.get(`/admin/support/${id}`),
//   reply: (id, data) => api.post(`/admin/support/${id}/reply`, data),
//   updateStatus: (id, data) => api.put(`/admin/support/${id}/status`, data),
// }

// // Rewards
// export const rewardsAPI = {
//   getAll: () => api.get('/admin/rewards'),
// }

import api from './axios'

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
}

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}

// Users
export const usersAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  updateStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  updateProfile: (id, data) => api.put(`/admin/users/${id}/profile`, data),
}

// KYC
export const kycAPI = {
  getAll: (params) => api.get('/admin/kyc', { params }),
  getById: (id) => api.get(`/admin/kyc/${id}`),
  updateStatus: (id, data) => api.put(`/admin/kyc/${id}/status`, data),
}

// Wallet
export const walletAPI = {
  getAll: () => api.get('/admin/wallet'),
  update: (userId, data) => api.put(`/admin/wallet/${userId}`, data),
}

// EMI
export const emiAPI = {
  getAll: () => api.get('/admin/emi'),
  getById: (id) => api.get(`/admin/emi/${id}`),
  update: (id, data) => api.put(`/admin/emi/${id}`, data),
}

// Loans
export const loansAPI = {
  getAll: (params) => api.get('/admin/loans', { params }),
  getById: (id) => api.get(`/admin/loans/${id}`),
  updateStatus: (id, data) => api.put(`/admin/loans/${id}/status`, data),
}

// Transactions
export const transactionsAPI = {
  getAll: (params) => api.get('/admin/transactions', { params }),
}

// Products
export const productsAPI = {
  getAll: () => api.get('/admin/products'),
  create: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/admin/products/${id}`),
}

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/admin/categories'),
  create: (data) => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
}

// Orders
export const ordersAPI = {
  getAll: (params) => api.get('/admin/orders', { params }),
  getById: (id) => api.get(`/admin/orders/${id}`),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
}

// Banners
export const bannersAPI = {
  getAll: () => api.get('/admin/banners'),
  create: (data) => api.post('/admin/banners', data),
  update: (id, data) => api.put(`/admin/banners/${id}`, data),
  delete: (id) => api.delete(`/admin/banners/${id}`),
}

// Offers
export const offersAPI = {
  getAll: () => api.get('/admin/offers'),
  create: (data) => api.post('/admin/offers', data),
  update: (id, data) => api.put(`/admin/offers/${id}`, data),
  delete: (id) => api.delete(`/admin/offers/${id}`),
}

// Notifications
export const notificationsAPI = {
  getAll: () => api.get('/admin/notifications'),
  send: (data) => api.post('/admin/notifications', data),
}

// Support
export const supportAPI = {
  getAll: (params) => api.get('/admin/support', { params }),
  getById: (id) => api.get(`/admin/support/${id}`),
  reply: (id, data) => api.post(`/admin/support/${id}/reply`, data),
  updateStatus: (id, data) => api.put(`/admin/support/${id}/status`, data),
}

// Rewards
export const rewardsAPI = {
  getAll: () => api.get('/admin/rewards'),
}