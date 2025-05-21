const API_URL = 'https://chatbot-api-ayd.up.railway.app';

export async function login({ username, password }: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password, grant_type: 'password' })
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function register({ fullname, email, password }: { fullname: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password })
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw await res.json();
  return true;
}

export async function getProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(res);
  if (!res.ok) throw await res.json();
  return await res.json();
} 