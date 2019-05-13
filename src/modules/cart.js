import {
  OFFER_FETCH_SUCCEEDED, OFFER_FETCH_REQUESTED,
  CART_FETCH_REQUESTED_FULFILLED, CART_FETCH_REQUESTED,
  PAYMENTS_FETCH_REQUESTED, PAYMENTS_FETCH_SUCCEEDED,
  DELIVERYADDRESSES_FETCH_SUCCEEDED, DELIVERYADDRESSES_FETCH_REQUESTED,
  PRODUCTFROMCART_REMOVE_REQUESTED, PRODUCTFROMCART_REMOVE_SUCCEEDED,
  CARTITEM_CREATE_REQUESTED,
  DELIVERYADDRESS_CREATE_REQUESTED,
  DELIVERYADDRESS_CREATE_FAILED,
  ORDERDETAIL_FETCH_REQUESTED, ORDERDETAIL_FETCH_SUCCEEDED,
  ORDER_EDIT_REQUESTED,
  DELIVERYADDRESS_EDIT_REQUESTED,
  SHIPPING_QUOTES_FETCH_SUCCEEDED,
  SHIPPING_QUOTES_FETCH_REQUESTED,
  SIDEBAR_CHANGED, SHIPPING_QUOTE_SELECTED, ADD_CART_ITEM_REQUESTED, UPDATE_CART_ITEM_REQUESTED, DELETE_CART_ITEM_REQUESTED, GET_CART_ITEM_REQUESTED, UPDATE_CART_ITEM_SUCCEEDED, ADD_CART_ITEM_SUCCEEDED
} from "../constants/cart"
import Api from "~/src/api/cart"
import { getLocationString, getPricing } from "../utils/functions"
import { DEFAULT_CURRENCY } from "../utils/constants";


export const initialState = {
  offerDetail: {},
  orderDetail: {},
  cart: {},
  deliveryAddresses: [],
  payments: [],
  isFetching: true,
  cartIsFetching: true,
  orderDetailIsFetching: true,
  offerDetailIsFetching: true,
  selectedAddressId: null,
  selectedCardId: null,
  shippingQuotes: [],
  sidebar: {
    isOpen: false,
    pricing: null,
    quantity: null,
    warning: null
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ORDERDETAIL_FETCH_REQUESTED: {
      return {
        ...state,
        orderDetailIsFetching: true,
      }
    }
    case ORDERDETAIL_FETCH_SUCCEEDED: {
      return {
        ...state,
        orderDetail: { ...action.payload, locationStr: getLocationString(action.payload.productOffer) },
        sidebar: { ...state.sidebar, quantity: action.payload.quantity },
        orderDetailIsFetching: false

      }
    }
    case DELIVERYADDRESSES_FETCH_REQUESTED: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case DELIVERYADDRESSES_FETCH_SUCCEEDED: {
      return {
        ...state,
        deliveryAddresses: action.payload,
        isFetching: false
      }
    }
    case DELIVERYADDRESS_CREATE_FAILED: {
      return {
        ...state,
        isFetching: false
      }
    }
    case PAYMENTS_FETCH_REQUESTED: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case PAYMENTS_FETCH_SUCCEEDED: {

      return {
        ...state,
        payments: action.payload,
        isFetching: false
      }
    }
    case OFFER_FETCH_REQUESTED: {
      return {
        ...state,
        offerDetailIsFetching: true,
      }
    }
    case OFFER_FETCH_SUCCEEDED: {
      let { payload } = action

      return {
        ...state,
        offerDetail: payload,
        sidebar: { ...state.sidebar, quantity: !payload.isEdit ? payload.minimum : state.sidebar.quantity },
        offerDetailIsFetching: false
      }
    }
    case CART_FETCH_REQUESTED: {
      return {
        ...state,
        cartIsFetching: true,
      }
    }
    case CART_FETCH_REQUESTED_FULFILLED: {
      let { payload } = action
      if (payload.cartItems) {
        let { cartItems } = payload
        cartItems.forEach(item => {
          item.locationStr = getLocationString(item.productOffer)
          item.pricing = getPricing(item.productOffer, item.quantity)
        })
      }

      return {
        ...state,
        cart: payload,
        cartIsFetching: false
      }
    }
    case SHIPPING_QUOTES_FETCH_REQUESTED: {
      return {
        ...state,
        country: action.country,
        zip: action.zip,
        shippingQuotesAreFetching: true,
        cart: { ...state.cart, selectedShipping: null }
      }
    }
    case SHIPPING_QUOTES_FETCH_SUCCEEDED: {

      return {
        ...state,
        shippingQuotes: action.payload,
        shippingQuotesAreFetching: false
      }
    }

    case SIDEBAR_CHANGED: {
      return {
        ...state,
        sidebar: { ...state.sidebar, ...action.payload }
      }
    }

    case SHIPPING_QUOTE_SELECTED: {
      return {
        ...state,
        cart: { ...state.cart, selectedShipping: action.payload }
      }
    }

    case PRODUCTFROMCART_REMOVE_REQUESTED: {
      return {
        ...state,
        cartIsFetching: true
      }
    }

    case PRODUCTFROMCART_REMOVE_SUCCEEDED: {
      return {
        ...state,
        cartIsFetching: false
      }
    }

    case UPDATE_CART_ITEM_REQUESTED: {
      return {
        ...state,
        offerDetailIsFetching: true
      }
    }

    case UPDATE_CART_ITEM_SUCCEEDED: {
      return {
        ...state,
        cart: { ...state.cart, ...action.payload },
        sidebar: { ...state.cart.sidebar, isOpen: false },
        offerDetailIsFetching: false
      }
    }

    case ADD_CART_ITEM_SUCCEEDED: {
      return {
        ...state,
        sidebar: { ...state.cart.sidebar, isOpen: false }
      }
    }
    default: {
      return state
    }
  }
}

export function getProductOffer(id, isEdit = false) {
  return {
    type: OFFER_FETCH_REQUESTED, payload: { id, isEdit }
  }
}

export function getCart() {
  return { type: CART_FETCH_REQUESTED, payload: Api.getCart() }
}

export function getDeliveryAddresses() {
  return { type: DELIVERYADDRESSES_FETCH_REQUESTED }
}

export function getPayments() {
  return { type: PAYMENTS_FETCH_REQUESTED }
}

export function deleteCart(id) {
  return { type: PRODUCTFROMCART_REMOVE_REQUESTED, payload: { id } }
}

export function postNewDeliveryAddress(address) {
  return { type: DELIVERYADDRESS_CREATE_REQUESTED, payload: { address } }
}

// export function getOrderDetail(id) {
//   return { type: ORDERDETAIL_FETCH_REQUESTED, payload: { id } }
// }

// export function postNewOrder(product) {
//   return { type: CARTITEM_CREATE_REQUESTED, payload: { product } }
// }

// export function postOrderEdit(order) {
//   return { type: ORDER_EDIT_REQUESTED, payload: { order } }
// }

export function putDeliveryAddressEdit(address) {
  return { type: DELIVERYADDRESS_EDIT_REQUESTED, payload: { address } }
}

export function getShippingQuotes(countryId, zip) {
  return { type: SHIPPING_QUOTES_FETCH_REQUESTED, payload: { countryId, zip } }
}

export function sidebarChanged(payload) {
  return { type: SIDEBAR_CHANGED, payload }
}

export function shippingQuoteSelected(payload) {
  return { type: SHIPPING_QUOTE_SELECTED, payload }
}

export function addCartItem(payload) {
  return { type: ADD_CART_ITEM_REQUESTED, payload }
}

export function updateCartItem(payload) {
  return { type: UPDATE_CART_ITEM_REQUESTED, payload }
}

export function deleteCartItem(payload) {
  return { type: DELETE_CART_ITEM_REQUESTED, payload }
}

export function getCartItem(payload) {
  return { type: GET_CART_ITEM_REQUESTED, payload }
}

