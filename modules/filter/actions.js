import * as api from './api'

import { createAction, createAsyncAction } from 'redux-promise-middleware-actions'

import { filterTypes, paths, operators } from './constants/filter'

export const toggleFilter = createAction('TOGGLE_FILTER', (value = null) => value)
export const filterSaving = createAction('FILTER_SAVING', (isSaving = false) => isSaving)
export const filterApplying = createAction('FILTER_APPLYING', (isApplying) => isApplying)
export const applyFilter = createAction('APPLY_FILTER', (filter) => filter)

export const getSavedFilters = createAsyncAction('GET_SAVED_FILTERS', async (savedUrl, productInfo, apiUrl, filterType = filterTypes.PRODUCT_OFFERS) => {
  let data = await api.getSavedFilters(savedUrl)

  return { data, productInfo, filterType }
})
export const getAutocompleteData = createAsyncAction('GET_AUTOCOMPLETE_DATA', searchUrl => api.getAutocompleteData(searchUrl))

export const saveFilter = createAsyncAction('SAVE_FILTER', (savedUrl, filter) => api.saveFilter(savedUrl, filter))

export const deleteFilter = createAsyncAction('DELETE_FILTER', (templateId) => api.deleteFilter(templateId))

export const updateFilterNotifications = createAsyncAction('UPDATE_FILTER_NOTIFICATIONS', (templateId, notifications) => api.updateFilterNotifications(templateId, notifications))