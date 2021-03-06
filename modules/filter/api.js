import api from '../../api'

export const getAutocompleteData = searchUrl => api.get(searchUrl).then(response => response.data)

export const getAutocompleteWarehouse = searchWarehouseUrl =>
  api.get(searchWarehouseUrl).then(response => response.data)

export const getSavedFilters = savedUrl => api.get(savedUrl).then(response => response.data)

export const saveFilter = (savedUrl, filter) => api.post(savedUrl, filter).then(response => response.data)

export const updateFilter = (templateId, filter) => api.put(`/prodex/api/data-grid-templates/${templateId}`, filter)

export const getProductsInfo = (url, filters) => api.post(url, filters).then(response => response.data)

export const deleteFilter = templateId =>
  api.delete(`/prodex/api/data-grid-templates/${templateId}`).then(() => templateId)

export const updateFilterNotifications = (templateId, notifications) =>
  api.patch(`/prodex/api/data-grid-templates/${templateId}`, notifications).then(response => response.data)

export const getAutocompleteManufacturer = searchManufacturerUrl =>
  api.get(searchManufacturerUrl).then(response => response.data)

export const getAutocompleteOrigin = searchOriginUrl => api.get(searchOriginUrl).then(response => response.data)

export const getWarehouses = () => api.get('/prodex/api/branches/warehouses').then(response => response.data)

export const getProvinces = id => api.get(`/prodex/api/provinces/country/${id}`).then(response => response.data)
