import { create } from 'apisauce';

const apiClient = create({
  baseURL: 'http://192.168.0.6:4001/api'
})

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    return response
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
}

export default apiClient;