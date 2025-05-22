const API_URL = 'https://chatbot-api-production-42f4.up.railway.app';

// Tipos
export type UserRole = 'estudiante' | 'docente' | 'admin';
export type ResourceType = 'documento' | 'recurso_ra';

// Interfaces
interface UserCreate {
  fullname: string;
  email: string;
  password: string;
}


interface UserCreateByAdmin extends UserCreate {
  role: UserRole;
}

interface UserUpdate {
  fullname: string;
}

interface UserUpdateRole {
  role: UserRole;
}

interface UserUpdateStatus {
  is_active: boolean;
}

interface CategoryCreate {
  name: string;
  description: string;
}

interface CategoryUpdate {
  name?: string;
  description?: string;
}

interface ResourceCreate {
  description: string;
  type: ResourceType;
  file: File;
}

interface ResourceUpdate {
  category_id: number;
}

interface ResourceUpdateStatus {
  is_enabled: boolean;
}

interface FAQCreate {
  question: string;
  answer: string;
}

interface FAQUpdate {
  question?: string;
  answer?: string;
}

// Funciones de autenticación
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

export function logout() {
  localStorage.removeItem('token');
}

// Funciones de usuario
export async function register(userData: UserCreate) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function createUserByAdmin(userData: UserCreateByAdmin) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function getProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function getUsers(): Promise<[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) throw await res.json();
  
  const data = await res.json();
  
  // Transforma los datos de la API para que coincidan con la interfaz User
  return data.map((user: any) => ({
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    role: user.role || 'estudiante', // Valor por defecto si no viene
    photo: user.photo,
    is_active: user.is_active !== undefined ? user.is_active : true, // Valor por defecto
    is_verified: user.is_verified || false, // Valor por defecto
    created_at: user.created_at || new Date().toISOString(),
    updated_at: user.updated_at || new Date().toISOString()
  }));
}

export async function updateProfile(userData: UserUpdate) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/update-profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateUserRole(userId: number, roleData: UserUpdateRole) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${userId}/set-role`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(roleData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateUserStatus(userId: number, statusData: UserUpdateStatus) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${userId}/set-status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(statusData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteUser(userId: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${userId}/delete`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// Funciones de recursos
export async function getResources() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/resources/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function uploadResource(resourceData: ResourceCreate) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('description', resourceData.description);
  formData.append('type', resourceData.type);
  formData.append('file', resourceData.file);

  const res = await fetch(`${API_URL}/resources/`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateResourceCategory(resourceId: number, categoryData: ResourceUpdate) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/resources/${resourceId}/set-category`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateResourceStatus(resourceId: number, statusData: ResourceUpdateStatus) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/resources/${resourceId}/set-status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(statusData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteResource(resourceId: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/resources/${resourceId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// Funciones de categorías
export async function getCategories() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categories/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function createCategory(categoryData: CategoryCreate) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categories/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function requestPasswordReset(token: string, password: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/users/reset-password-confirm?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, confirm_password: confirmPassword })
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateCategory(categoryId: number, categoryData: CategoryUpdate) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categories/${categoryId}/update`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteCategory(categoryId: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// Funciones de FAQs
export async function getFAQs() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/faqs/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function createFAQ(faqData: FAQCreate) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/faqs/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(faqData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateFAQ(faqId: number, faqData: FAQUpdate) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/faqs/${faqId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(faqData)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteFAQ(faqId: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/faqs/${faqId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// Función temporal para probar el endpoint de categorías
export async function getCategoriesTest() {
  const res = await fetch('https://chatbot-api-production-42f4.up.railway.app/categories/');
  return await res.json();
}

// Cambiar foto de perfil
export async function setUserPhoto(photo: File) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('photo', photo);
  const res = await fetch(`${API_URL}/users/set-photo`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// Eliminar foto de perfil
export async function unsetUserPhoto() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/unset-photo`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function resetPassword(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function confirmResetPassword(token: string, password: string, confirmPassword: string): Promise<string> {
  const res = await fetch(`${API_URL}/users/reset-password-confirm?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, confirm_password: confirmPassword })
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function verifyEmail(token: string): Promise<string> {
  const res = await fetch(`${API_URL}/users/verify-email?token=${encodeURIComponent(token)}`);
  if (!res.ok) throw await res.json();
  return await res.json();
} 