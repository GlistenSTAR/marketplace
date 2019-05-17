import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddCart from './AddCart';
import { getProductOffer, postNewOrder, postOrderEdit, sidebarChanged, updateCartItem, addCartItem } from "../../../../modules/cart"
import { removePopup } from "../../../../modules/popup"
import { getPricing } from '../../../../utils/functions'


function mapStateToProps(store) {
    let pricing = getPricing(store.cart.offerDetail, store.cart.sidebar.quantity)
    return {
        offer: store.cart.offerDetail,
        order: store.cart.orderDetail,
        sidebar: { ...store.cart.sidebar, pricing },
        offerDetailIsFetching: store.cart.offerDetailIsFetching,
        orderDetailIsFetching: store.cart.orderDetailIsFetching
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getProductOffer, postOrderEdit, postNewOrder, removePopup, sidebarChanged, updateCartItem, addCartItem }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCart);
