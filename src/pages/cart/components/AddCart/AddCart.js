import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Dropdown from '../../../../components/Dropdown/Dropdown'
import Spinner from '../../../../components/Spinner/Spinner'
import PopupComponent from '../../../../components/PopUp/PopupComponent'
import {getUnit} from '../../../../utils/functions'
import './AddCart.css';

class AddCart extends Component {
  state = {
    pricing: false,
    quantity: false,
  }

  componentDidMount() {
    this.props.getProductOffer(this.props.id)
  }

  //TODO Fix cart to send edited data
  handleContinue = () => {
    const {removePopup, createCartItem, offer} = this.props;
    const offerpayload= {
        "productOffer": offer.id,
        "quantity": 62607202
    }
    createCartItem(offerpayload)
    this.props.history.push("/cart/shopping-cart")
    removePopup()
  }

   getQualityOptions = (split) => {
    const {quantityFrom, quantityTo} = this.state.pricing
    const options = []
    for (let i = quantityFrom; i <= quantityTo; i = i + split) {
      options.push(i);
    }
    return options;
   }

  render() {
    const {offer, removePopup, isFetching} = this.props;
    if (isFetching) return <Spinner />
    const location =`${offer.warehouse.address.city}, ${offer.warehouse.address.province.name}`;
    const {unit, capacity, amount, splits} = offer.packaging;
    const unitName = `${getUnit(unit.name)}${capacity > 1 && 's'}`;
    const packageSize = `${capacity} ${unitName}`;
    const availableProducts = `${amount} pck / ${(amount * capacity).formatNumber()}${unitName}`;
    const totalPrice = this.state.quantity ? offer.pricing.price * this.state.quantity * capacity : "";
    const {tiers} = offer.pricing
    const priceLevelOptions = tiers.map(i => {
      const object = {
        name: `${i.quantityFrom} - ${i.quantityTo} pck / $${i.price}`,
        id: {quantityFrom: i.quantityFrom, quantityTo: i.quantityTo, price: i.price}
      };
      return object;
    })
    const quantityOptions = this.getQualityOptions( splits)
    const quantityOptionsWithName = quantityOptions.map(i => {
      const object = {name: `${i.toString()} pck`, id: i}
      return object;
    })

    return (
        <PopupComponent handleContinue={this.handleContinue} removePopup={removePopup} headerTitle="Purchase">
        <div className="add-cart-body">
          <div className="add-cart-body-section">
            <h3>Product Info</h3>
            <div>
              <b>{offer.product.casIndexName}</b>
            </div>
            <div>
              <b>Merchant: </b>
              {offer.merchant.email}
            </div>
            <div>
              <b>Available Products: </b>
              {availableProducts}
            </div>
            <div>
              <b>Packaging: </b>
              {offer.packaging.container.name}
            </div>
            <div>
              <b>Package Size: </b>
              {packageSize}
            </div>
            <div>
              <b>Form: </b>
              {offer.productForm.name}
            </div>
            <div>
              <b>Location: </b>
              {location}
            </div>
            <div>
              <b>Attachments: </b>
            </div>
          </div>

          <div className="divider" />

          <div className="add-cart-body-section">
            <h3>Purchase Info</h3>
            <div>
              <b>Select Price Level</b>
              <Dropdown
                opns={priceLevelOptions}
                placeholder="Select Price Level"
                onChange={value => {
                  this.setState({pricing: value})
                }}
              />
            </div>
            <div>
              <b>Select Quantity</b>
              <Dropdown
                opns={quantityOptionsWithName}
                placeholder="Select Quantity"
                disabled={!this.state.pricing && true}
                onChange={value => {
                  this.setState({quantity: value})
                }}/>
            </div>
            <div className="purchase-info">
              <b>Total Quantity:</b> <span>{this.state.quantity && `${this.state.quantity} pck`}</span>
            </div>
            <div className="purchase-info">
              <b>Price/LB:</b> 
              <span>${offer.pricing.price}</span> 
            </div>
            <div className="purchase-info">
              <b>Delivered Price/LB:</b> 
              <span>$</span> 
            </div>
            <div className="purchase-info">
              <b>Total:</b> 
              <span>${totalPrice}</span> 
            </div>
          </div>
          </div>
        </PopupComponent>
    )
  }
}

export default AddCart

AddCart.propTypes = {
  offer: PropTypes.object,
  createCartItem: PropTypes.func,
  id: PropTypes.number,
  isFetching: PropTypes.bool,
  removePopup: PropTypes.func,
}
