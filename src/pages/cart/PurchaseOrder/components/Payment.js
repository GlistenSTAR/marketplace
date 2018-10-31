import React from 'react'
import PropTypes from 'prop-types'
import DropdownRedux from '../../../../components/Dropdown/DropdownRedux'
import {required} from '../../../../utils/validation'

const Payment = ({dispatch, payments, selectedAddress, selectedPayment, getPayment}) => {
  //dropdown component requires object with name key
  const paymentsWithName = payments.map(i => {
    i.name = `${i.cardType}`;
    return i;
  })
  return (
    <div className="shopping-cart-items">
      <header><h1>2. Payment</h1></header>
      <div className="purchase-order-section">
        <div className="group-item-wr">
          <DropdownRedux
            model="forms.cart.selectedCardId"
            dispatch={dispatch}
            opns={paymentsWithName}
            validators={{required}}
            onChange={id => getPayment(id)}
            placeholder="Select Credit Card"
          />
        </div>
        {!!Object.keys(selectedPayment).length && 
        <div  className="text-section">
            <div><b>Payment Method</b></div>
            <div>{selectedPayment.cardNumber} {selectedPayment.cardType} Exp: {selectedPayment.expirationDate}</div>
            
        </div>}
        {!!Object.keys(selectedAddress).length && 
        <React.Fragment>
        <div className="text-section">
          <div><b>Billing Info</b></div>
          <div>{selectedAddress["first name"]} {selectedAddress["last name"]}</div>
          <div>{selectedAddress.address.streetAddress}</div>
          <div>{selectedAddress.address.city}, {selectedAddress.address.province.name}, {selectedAddress.address.zip.zip}</div>
        </div>
        </React.Fragment>}
      </div>
    </div>
  )
}

export default Payment

Payment.propTypes = {
  getPayment: PropTypes.func,
  dispatch: PropTypes.func,
  selectedPayment: PropTypes.object,
  selectedAddress: PropTypes.object,
  payments: PropTypes.array,
}
