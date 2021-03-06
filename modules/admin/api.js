import api from '../../api'

import { getSafe, generateQueryString } from '../../utils/functions'

export async function getCasProductByString(value, limit = 30, returnWhenEmpty = true) {
  const { data } = await api.get(`/prodex/api/cas-products/search?limit=${limit}&pattern=${encodeURIComponent(value)}${returnWhenEmpty ? '&returnWhenEmpty=true' : ''}`)
  return data
}

export async function getManufacturersByString(value, limit = 30, returnWhenEmpty = true) {
  const { data } = await api.get(`/prodex/api/manufacturers/search?limit=${limit}&search=${encodeURIComponent(value)}${returnWhenEmpty ? '&returnWhenEmpty=true' : ''}`)
  return data
}

export async function getAllUnNumbers() {
  const { data } = await api.get('/prodex/api/un-numbers')
  return data
}

export async function getUnNumbersByString(value, limit = 30, returnWhenEmpty = true) {
  const { data } = await api.get(`/prodex/api/un-numbers/search?limit=${limit}&pattern=${encodeURIComponent(value)}${returnWhenEmpty ? '&returnWhenEmpty=true' : ''}`)
  return data
}

export async function getDataRequest(config, values) {
  const { data } = await api.get(config.api.get.apiCall)
  return data
}

export async function postNewRequest(config, values) {
  if (getSafe(() => config.api.post.typeQuery, false)) {
    return await api.post(`${config.api.post.apiCall}${generateQueryString(values)}`)
  } else {
    return await api.post(config.api.post.apiCall, values)
  }
}

export async function postNewDwollaAccount(values, companyId) {
  const { data } = await api.post(`/prodex/api/payments/dwolla/register/${companyId}`, values)
  return data
}

export async function deleteItem(config, id) {
  const { data } = await api.delete(config.api.delete.apiCall + id)
  return data
}

export async function putEditedDataRequest(config, values, id) {
  if (getSafe(() => config.api.update.typeQuery, false)) {
    const { data } = await api[getSafe(() => config.api.update.method, 'put')](
      `${config.api.update.apiCall}${id}${generateQueryString(values)}`
    )
    return data
  } else {
    const { data } = await api[getSafe(() => config.api.update.method, 'put')](config.api.update.apiCall + id, values)
    return data
  }
}

export async function putEditedDataRequest2(config, values, id) {
  const { data } = await api[getSafe(() => config.api.update.method, 'put')](config.api.update.apiCall + id, values)
  return data
}

// export async function getZipCodes() { // TODO Refactor to use limit and search (and countryId?)
//   const {data} = await api.get('/prodex/api/zip-codes')
//   return data
// }

export const getProvinces = id => api.get(`/prodex/api/provinces/country/${id}`).then(response => response.data)

export async function getCompanies(params) {
  const { data } = await api.post(`/prodex/api/companies/datagrid`, {
    filters: [],
    ...params
  })
  return data
}

export async function getCompany(params) {
  const { data } = await api.get(`/prodex/api/companies/id/${params}`, {
    filters: [],
    ...params
  })
  return data
}

/*
export async function getCompany(id) {
  const {data} = await api.get(`/prodex/api/companies/${id}`)
  return data
}
*/

export const deleteUnit = id => api.delete(`/prodex/api/units/${id}`).then(() => id)

export const deleteUnitOfPackaging = id => api.delete(`/prodex/api/packaging-types/${id}`).then(() => id)

export const getPackagingTypeImage = id => api.get(`/prodex/api/packaging-types/${id}/image`, {
  responseType: 'blob',
  headers: {
    Pragma: 'no-handle-error, no-cache'
  }
})
  .then(response => response.data)
export const uploadPackagingTypeImage = (id, attachment) => {
  const formData = new FormData()
  formData.append('image', attachment)
  return api.post(`/prodex/api/packaging-types/${id}/image-edit`, formData, {
    headers: {
      accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      Pragma: 'no-handle-error, no-cache'
    }
  })
}
export const deletePackagingTypeImage = id => api.delete(`/prodex/api/packaging-types/${id}/image-edit`).then(() => id)

export async function getAddressSearch(body) {
  const { data } = await api.post('/prodex/api/addresses/search', body)
  return data
}

export const takeOverCompanyFinish = () =>
  api.patch('/prodex/api/admin/company/take-over/finish').then(response => response.data)

export const reviewRequest = companyId => api.patch(`/prodex/api/companies/id/${companyId}/review-request`)

export const getCompanyDetails = id =>
  api.get(`/prodex/api/companies/id/${id}/all-info`).then(response => response.data)

export const deleteCompanyGenericProduct = id => api.delete(`/prodex/api/company-generic-products/id/${id}`)

export const loadFile = attachment => {
  return api({
    baseURL: '',
    url: attachment.preview,
    method: 'GET',
    responseType: 'blob'
  }).then(r => new File([r.data], attachment.name, { type: attachment.type }))
}

export const addAttachment = (attachment, docType, additionalParams = {}) => {
  let defaultParams = {
    isTemporary: true
  }
  let params = { ...defaultParams, ...additionalParams, type: docType }
  const formData = new FormData()
  formData.append('file', attachment)

  let queryParams = generateQueryString(params)

  return api.post(`/prodex/api/attachments${queryParams}`, formData, {
    headers: {
      accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    }
  })
}

export const linkAttachment = (echoId, attachmentId) =>
  api.post(
    `/prodex/api/attachment-links/to-company-generic-product?attachmentId=${attachmentId}&companyGenericProductId =${echoId}`
  )

export const removeAttachment = attachmentId => api.delete(`/prodex/api/attachments/${attachmentId}`)

export const removeAttachmentLink = (echoId, attachmentId) =>
  api.delete(
    `/prodex/api/attachment-links/to-company-generic-product?attachmentId=${attachmentId}&companyGenericProductId =${echoId}`
  )

export const searchManufacturers = (text, limit, returnWhenEmpty = true) =>
  api.get(
    `/prodex/api/manufacturers/search?search=${encodeURIComponent(text)}${
      Number.isInteger(limit) ? '&limit=' + (limit > 30 ? 30 : limit) : ''
    }${returnWhenEmpty ? '&returnWhenEmpty=true' : ''}`
  )

export const searchUnNumber = (pattern, returnWhenEmpty = true) =>
  api.get(`/prodex/api/un-numbers/search?limit=5&pattern=${encodeURIComponent(pattern)}${returnWhenEmpty ? '&returnWhenEmpty=true' : ''}`)

export const verifyEchoProduct = id =>
  api.get(`/prodex/api/company-generic-products/verify/${id}`).then(response => response.data)

export const addNmfcNumber = nmfc => api.post('/prodex/api/nmfc-numbers', nmfc).then(response => response.data)
export const editNmfcNumber = nmfc =>
  api
    .patch(`/prodex/api/nmfc-numbers/${nmfc.id}`, { code: nmfc.code, description: nmfc.description })
    .then(response => response.data)
export const getNmfcNumbers = () => api.get('/prodex/api/nmfc-numbers').then(response => response.data)
export const getSpecificNmfcNumber = id => api.get(`/prodex/api/nmfc-numbers/${id}`).then(response => response.data)
export const deleteNmfcNumber = id => api.delete(`/prodex/api/nmfc-numbers/${id}`).then(() => id)

export const getUsersMe = () => api.get('/prodex/api/users/me').then(response => response.data)
export const getUser = id => api.get(`/prodex/api/users/id/${id}`).then(response => response.data)
export const getCompanyInfo = id => api.get(`/prodex/api/companies/id/${id}`).then(response => response.data)

export const userSwitchEnableDisable = id =>
  api.patch(`/prodex/api/users/id/${id}/switch-enabled`).then(response => response.data)

export const postNewUserRequest = body => api.post('/prodex/api/users', body).then(response => response.data)
export const submitUserEdit = (id, body) =>
  api.patch(`/prodex/api/users/id/${id}`, body).then(response => response.data)

export const deleteUser = id => api.delete(`/prodex/api/users/id/${id}`).then(() => id)
export const searchCompany = (companyText, limit = 30, returnWhenEmpty = true) =>
  api
    .get(`/prodex/api/companies/search/all-info?limit=${limit}&pattern=${encodeURIComponent(companyText)}${returnWhenEmpty ? '&returnWhenEmpty=true' : ''}`)
    .then(response => response.data)

export const searchTags = filter => api.post(`/prodex/api/tags/datagrid`, filter).then(response => response.data)
export const searchMarketSegments = filter =>
  api.post(`/prodex/api/market-segments/datagrid`, filter).then(response => response.data)

export const udpateEnabled = (id, enabled) =>
  api.patch(`/prodex/api/companies/admin/id/${id}/enabled?enabled=${enabled}`)

export const getLogisticsProviders = () => api.get('/prodex/api/logistics-providers').then(response => response.data)
export const postNewLogisticsProvider = body =>
  api.post('/prodex/api/logistics-providers/stored', body).then(response => response.data)
export const updateLogisticsProvider = (id, body) =>
  api.patch(`/prodex/api/logistics-providers/stored/${id}`, body).then(response => response.data)
export const deleteLogisticsProvider = id => api.delete(`/prodex/api/logistics-providers/stored/${id}`).then(() => id)

export const postNewCarrier = body =>
  api.post('/prodex/api/logistics-carriers/stored', body).then(response => response.data)
export const updateCarrier = (id, body) =>
  api.patch(`/prodex/api/logistics-carriers/stored/${id}`, body).then(response => response.data)
export const deleteCarrier = id => api.delete(`/prodex/api/logistics-carriers/stored/${id}`).then(() => id)
