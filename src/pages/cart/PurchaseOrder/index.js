import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PurchaseOrder from './PurchaseOrder'
import {
  getCart, getDeliveryAddresses,
  deleteCart, getPayments,
  postNewDeliveryAddress, updateDeliveryAddress,
  getShippingQuotes, shippingQuoteSelected,
  addCartItem, updateCartItem,
  deleteCartItem, getCartItem,
  shippingChanged
} from '../../../modules/cart'


import { getStates, getProvinces } from '../../../modules/location'

function mapStateToProps(store) {
  
  return {
    ...store.cart,
    // cart: store.cart.cart,
    // deliveryAddresses: store.cart.deliveryAddresses,
    // cartIsFetching: store.cart.cartIsFetching,
    // payments: store.cart.payments,
    // shippingQuotes: store.cart.shippingQuotes,
    // shippingQuotesAreFetching: store.cart.shippingQuotesAreFetching,
    // isFetching: store.cart.isFetching,
    selectedAddressId: store.forms.cart.selectedAddressId,
    selectedCardId: store.forms.cart.selectedCardId,
    location: store.location
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCart,
    getDeliveryAddresses, updateDeliveryAddress,
    getPayments, deleteCart,
    postNewDeliveryAddress, getShippingQuotes,
    shippingQuoteSelected, addCartItem,
    updateCartItem, deleteCartItem,
    getCartItem, getStates, getProvinces, 
    shippingChanged,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseOrder)