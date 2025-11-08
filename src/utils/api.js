// src/utils/api.js
export const API_BASE = '/api/v1'; // gunakan proxy dev-server

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  // jika status non-OK, coba parsing body (untuk pesan error)
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { error: true, message: 'Invalid JSON' }; }
  if (!res.ok) {
    // lempar error agar pemanggil bisa menanganinya
    const errMsg = data && data.message ? data.message : `HTTP ${res.status}`;
    const err = new Error(errMsg);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function apiRegister(name, email, password) {
  return await requestJson('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
}

export async function apiLogin(email, password) {
  return await requestJson('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export async function apiGetStories({page=1, size=20, location=1} = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return await requestJson(`/stories?page=${page}&size=${size}&location=${location}`, { headers });
}

export async function postStory(formData) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/stories`, {
    method: 'POST',
    headers,
    body: formData
  });
  const text = await res.text();
  try { return JSON.parse(text || '{}'); } catch (e) { return { error: true, message: 'Invalid JSON' }; }
}
