// src/services/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('auth_token');
}

async function request(method, path, body = null, auth = true) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

const get  = (path, auth = true)       => request('GET',    path, null, auth);
const post = (path, body, auth = true) => request('POST',   path, body, auth);
const put  = (path, body, auth = true) => request('PUT',    path, body, auth);
const del  = (path, auth = true)       => request('DELETE', path, null, auth);

export const auth = {
  register: ({ name, email, password, password_confirmation }) =>
    post('/register', { name, email, password, password_confirmation }, false),

  login: async ({ email, password }) => {
    const data = await post('/login', { email, password }, false);
    if (data.token) localStorage.setItem('auth_token', data.token);
    return data;
  },

  logout: async () => {
    await post('/logout');
    localStorage.removeItem('auth_token');
  },

  me: () => get('/me'),
};

export const passwordReset = {
  sendCode: (email) => post('/forgot-password', { email }, false),
  verifyCode: (email, code) => post('/verify-reset-code', { email, code }, false),
  resetPassword: (email, code, password, password_confirmation) =>
    post('/reset-password', { email, code, password, password_confirmation }, false),
};

export const products = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`/products${query ? `?${query}` : ''}`, false);
  },
  get: (id) => get(`/products/${id}`, false),
  create: (payload) => post('/products', payload),
  update: (id, payload) => put(`/products/${id}`, payload),
  delete: (id) => del(`/products/${id}`),
};

export const orders = {
  list: () => get('/orders'),
  place: ({ cart, subtotal, shipping, tax, total }) =>
    post('/orders', {
      cart: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null,
      })),
      subtotal, shipping, tax, total,
    }),
  get: (id) => get(`/orders/${id}`),
  updateStatus: (id, status) => put(`/orders/${id}/status`, { status }),
};

export const favorites = {
  list: () => get('/favorites'),
  toggle: (productId) => post('/favorites/toggle', { product_id: productId }),
};

export const admin = {
  dashboard: () => get('/admin/dashboard'),
  customers: () => get('/admin/customers'),
  allOrders: () => get('/admin/orders'),
};