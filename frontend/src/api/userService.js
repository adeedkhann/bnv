import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const buildUserFormData = (payload = {}) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
};

export const getUsers = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const response = await apiClient.get('/users', {
    params: {
      page,
      limit,
      search: search || undefined,
    },
  });

  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (payload) => {
  const response = await apiClient.post('/users', buildUserFormData(payload));
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await apiClient.patch(`/users/${id}`, buildUserFormData(payload));
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const exportUsersCsv = async () => {
  const response = await apiClient.get('/users/export', {
    responseType: 'blob',
  });

  const contentDisposition = response.headers?.['content-disposition'] || '';
  const filenameMatch = contentDisposition.match(/filename=([^;]+)/i);
  const filename = filenameMatch ? filenameMatch[1].replace(/"/g, '') : 'users.csv';

  return { blob: response.data, filename };
};
