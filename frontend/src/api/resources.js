import { api } from './client';

const data = (request) => request.then((response) => response.data);

export const foldersApi = {
  list: (params) => data(api.get('/folders', { params })),
  get: (id) => data(api.get(`/folders/${id}`)),
  create: (body) => data(api.post('/folders', body)),
  update: (id, body) => data(api.patch(`/folders/${id}`, body)),
  remove: (id) => data(api.delete(`/folders/${id}`)),
};
export const categoriesApi = {
  list: (folderId) => data(api.get('/categories', { params: { folderId } })),
  get: (id) => data(api.get(`/categories/${id}`)),
  create: (body) => data(api.post('/categories', body)),
  update: (id, body) => data(api.patch(`/categories/${id}`, body)),
  remove: (id) => data(api.delete(`/categories/${id}`)),
};
export const promptsApi = {
  list: (params) => data(api.get('/prompts', { params })),
  get: (id) => data(api.get(`/prompts/${id}`)),
  create: (body) => data(api.post('/prompts', body)),
  update: (id, body) => data(api.patch(`/prompts/${id}`, body)),
  remove: (id) => data(api.delete(`/prompts/${id}`)),
};

