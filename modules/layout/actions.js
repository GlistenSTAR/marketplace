import { createAction } from 'redux-promise-middleware-actions'

export const toggleMenu = createAction('TOGGLE_MENU')
export const openGlobalAddForm = createAction('OPEN_GLOBAL_ADD_FORM', (name = '') => name)