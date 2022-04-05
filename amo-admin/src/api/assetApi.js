import axiosClient from "./axiosClient";

const assetApi = {
  getAll: (params) => {
    const url = "api/Asset/GetAssetList";
        return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `api/Asset/${id}`;
      return axiosClient.get(url);
  },

  search: (category) => {
    const url = `api/Asset/search`;
      return axiosClient.post(url, category);
  },

  delete: (id) => {
    const url = `api/Asset/${id}`;
      return axiosClient.delete(url);
  },

  
  post: (asset) => {
    const url = `api/Asset`;
      return axiosClient.post(url, asset)
  },
  put: (asset) => {
    const url = `api/Asset`;
      return axiosClient.put(url, asset)
  },
};

export default assetApi;
