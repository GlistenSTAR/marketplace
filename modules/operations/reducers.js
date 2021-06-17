import * as AT from './action-types'

export const initialState = {
  popupValues: null,
  isOpenPopup: false,
  loading: false,
  searchedCompanies: [],
  searchedCompaniesLoading: false,
  companyProductUnmappedOnly: 'ALL',
  ordersStatusFilter: 'All',
  orderDetailData: null,
  documentTypesFetching: false,
  orderProcessing: false,
  orderAccountingDocuments: [],
  orderAccountingDocumentsLoading: false,
  tableHandlersFilters: null,
  searchedManQuotRequests: [],
  searchedManQuotRequestsLoading: false
}

export default function reducers(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case AT.OPERATIONS_OPEN_POPUP: {
      return {
        ...state,
        isOpenPopup: true,
        popupValues: action.payload
      }
    }

    case AT.OPERATIONS_CLOSE_POPUP: {
      return {
        ...state,
        isOpenPopup: false,
        popupValues: null
      }
    }

    case AT.OPERATIONS_HANDLE_FILTERS_VALUE: {
      return {
        ...state
      }
    }

    case AT.OPERATIONS_MARK_REQUEST_AS_PROCESSED_PENDING:
    case AT.OPERATIONS_DENY_REQUEST_PENDING:
    case AT.OPERATIONS_DELETE_REQUEST_PENDING:
    case AT.OPERATIONS_UPDATE_SHIPPING_QUOTE_PENDING:
    case AT.OPERATIONS_CREATE_SHIPPING_QUOTE_PENDING:
    case AT.OPERATIONS_DELETE_SHIPPING_QUOTE_PENDING:
    case AT.OPERATIONS_CREATE_TAG_PENDING:
    case AT.OPERATIONS_UPDATE_TAG_PENDING:
    case AT.OPERATIONS_DELETE_TAG_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.OPERATIONS_MARK_REQUEST_AS_PROCESSED_REJECTED:
    case AT.OPERATIONS_MARK_REQUEST_AS_PROCESSED_FULFILLED:
    case AT.OPERATIONS_DENY_REQUEST_REJECTED:
    case AT.OPERATIONS_DENY_REQUEST_FULFILLED:
    case AT.OPERATIONS_DELETE_REQUEST_REJECTED:
    case AT.OPERATIONS_DELETE_REQUEST_FULFILLED:
    case AT.OPERATIONS_UPDATE_SHIPPING_QUOTE_FULFILLED:
    case AT.OPERATIONS_UPDATE_SHIPPING_QUOTE_REJECTED:
    case AT.OPERATIONS_DELETE_SHIPPING_QUOTE_FULFILLED:
    case AT.OPERATIONS_DELETE_SHIPPING_QUOTE_REJECTED:
    case AT.OPERATIONS_CREATE_SHIPPING_QUOTE_FULFILLED:
    case AT.OPERATIONS_CREATE_SHIPPING_QUOTE_REJECTED:
    case AT.OPERATIONS_CREATE_TAG_FULFILLED:
    case AT.OPERATIONS_UPDATE_TAG_FULFILLED:
    case AT.OPERATIONS_DELETE_TAG_FULFILLED:
    case AT.OPERATIONS_CREATE_TAG_REJECTED:
    case AT.OPERATIONS_UPDATE_TAG_REJECTED:
    case AT.OPERATIONS_DELETE_TAG_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.OPERATIONS_SEARCH_COMPANY_PENDING: {
      return { ...state, searchedCompaniesLoading: true }
    }
    case AT.OPERATIONS_SEARCH_COMPANY_REJECTED: {
      return { ...state, searchedCompaniesLoading: false }
    }
    case AT.OPERATIONS_SEARCH_COMPANY_FULFILLED: {
      return {
        ...state,
        searchedCompanies: action.payload,
        searchedCompaniesLoading: false
      }
    }

    case AT.OPERATIONS_SET_PRODUCT_MAPPED_UNMAPPED: {
      return {
        ...state,
        companyProductUnmappedOnly: payload
      }
    }

    case AT.OPERATIONS_ORDERS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        ordersStatusFilter: action.payload.filter.status
      }

    case AT.OPERATIONS_OPEN_ORDER_DETAIL: {
      return {
        ...state,
        orderDetailData: payload
      }
    }

    case AT.OPERATIONS_ORDERS_CANCEL_ORDER_PENDING: {
      return { ...state, orderProcessing: true }
    }
    case AT.OPERATIONS_ORDERS_CANCEL_ORDER_REJECTED:
    case AT.OPERATIONS_ORDERS_CANCEL_ORDER_FULFILLED: {
      return { ...state, orderProcessing: false }
    }

    case AT.OPERATIONS_GET_ORDER_ACCOUNTING_DOCUMENTS_CLEAR:
      return {
        ...state,
        orderAccountingDocuments: []
      }
    case AT.OPERATIONS_GET_ORDER_ACCOUNTING_DOCUMENTS_PENDING:
      return {
        ...state,
        orderAccountingDocumentsLoading: true
      }
    case AT.OPERATIONS_GET_ORDER_ACCOUNTING_DOCUMENTS_REJECTED:
      return {
        ...state,
        orderAccountingDocumentsLoading: false
      }

    case AT.OPERATIONS_GET_ORDER_ACCOUNTING_DOCUMENTS_FULFILLED:
      return {
        ...state,
        orderAccountingDocumentsLoading: false,
        orderAccountingDocuments: action.payload.data
      }

    case AT.OPERATIONS_SAVE_FILTERS: {
      return {
        ...state,
        tableHandlersFilters: action.payload
      }
    }

    case AT.OPERATIONS_SEARCH_MANUAL_QUOTE_REQUEST_PENDING: {
      return { ...state, searchedManQuotRequestsLoading: true }
    }
    case AT.OPERATIONS_SEARCH_MANUAL_QUOTE_REQUEST_REJECTED: {
      return { ...state, searchedManQuotRequestsLoading: false }
    }
    case AT.OPERATIONS_SEARCH_MANUAL_QUOTE_REQUEST_FULFILLED: {
      return {
        ...state,
        searchedManQuotRequests: action.payload,
        searchedManQuotRequestsLoading: false
      }
    }

    /* RESOLVE DISPUTE */
    case AT.RESOLVE_DISPUTE_CREDIT_PENDING: {
      return {
        ...state,
        loading: true
      }
    }
    case AT.RESOLVE_DISPUTE_CREDIT_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }
    case AT.RESOLVE_DISPUTE_CREDIT_FULFILLED: {
      return {
        ...state,
        orderDetailData: action.payload,
        loading: false
      }
    }

    case AT.RESOLVE_DISPUTE_REJECT_PENDING: {
      return {
        ...state,
        loading: true
      }
    }
    case AT.RESOLVE_DISPUTE_REJECT_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }
    case AT.RESOLVE_DISPUTE_REJECT_FULFILLED: {
      return {
        ...state,
        orderDetailData: action.payload,
        loading: false
      }
    }

    case AT.RESOLVE_DISPUTE_ACCEPT_PENDING: {
      return {
        ...state,
        loading: true
      }
    }
    case AT.RESOLVE_DISPUTE_ACCEPT_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }
    case AT.RESOLVE_DISPUTE_ACCEPT_FULFILLED: {
      return {
        ...state,
        orderDetailData: action.payload,
        loading: false
      }
    }

    default: {
      return state
    }
  }
}
