// Backend API client for frontend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.getToken()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`API Error: ${endpoint}`, err);
      throw err;
    }
  }

  // Auth
  async register(name, email, password, role = 'client') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Users
  async getClients() {
    return this.request('/users/clients');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, updates) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async getTrainer(id) {
    return this.request(`/users/trainer/${id}`);
  }

  // Plans
  async getClientPlan(clientId) {
    return this.request(`/plans/client/${clientId}`);
  }

  async getClientPlans(clientId) {
    return this.request(`/plans/client-all/${clientId}`);
  }

  async createPlan(clientId, name, schedule) {
    return this.request('/plans', {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId, name, schedule })
    });
  }

  async updatePlan(planId, updates) {
    return this.request(`/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deletePlan(planId) {
    return this.request(`/plans/${planId}`, { method: 'DELETE' });
  }

  // Logs
  async getClientLogs(clientId) {
    return this.request(`/logs/client/${clientId}`);
  }

  async getLog(logId) {
    return this.request(`/logs/${logId}`);
  }

  async createLog(clientId, date, exercises, completed = false, volume = 0, notes = '') {
    return this.request('/logs', {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId, date, exercises, completed, volume, notes })
    });
  }

  async updateLog(logId, updates) {
    return this.request(`/logs/${logId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteLog(logId) {
    return this.request(`/logs/${logId}`, { method: 'DELETE' });
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
