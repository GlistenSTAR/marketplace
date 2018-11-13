import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Dropdown from '../../../../components/Dropdown/Dropdown'
import Spinner from '../../../../components/Spinner/Spinner'
import Button from '../../../../components/Button/Button'
import PopupComponent from '../../../../components/PopUp/PopupComponent'
import {getUnit} from '../../../../utils/functions'
import './AddCart.css';
import file from '../../../../images/file.svg';
import InputControlled from '../../../../components/InputControlled/InputControlled'

class AddCart extends Component {
  state = {
    pricing: false,
    quantity: null,
    warning: null
  }

  componentDidMount() {
   if (this.props.isEdit) this.props.getOrderDetail(this.props.id)
   this.props.getProductOffer(this.props.id)
  }

  //TODO Fix cart to send edited data
  createOrder = () => {
    const {removePopup, createNewOrder, offer, history} = this.props;
    const offerpayload = {
        productOffer: offer.id,
        quantity: this.state.quantity
    }
    if (!this.state.quantity) {
      this.setState({warning: "quantity is required"})
      return
    } else {
      history.push("/cart/shopping-cart")
      createNewOrder(offerpayload)
      removePopup()
      
    }
  }

  editOrder = () => {
    const {removePopup, editOrder, order} = this.props;
    const orderpayload = {
        id: order.productOffer.id,
        quantity: this.state.quantity || order.quantity,
        selectedOfferPrice: this.state.pricing.price || order.selectedOfferPrice
    }
    editOrder(orderpayload)
    this.props.history.push("/cart/shopping-cart")
    removePopup()
  }

   getQualityOptions = (split) => {
    const options = [] 
    if (this.state.pricing) {
      const {quantityFrom, quantityTo} = this.state.pricing
      for (let i = quantityFrom; i <= quantityTo; i = i + split) {
        options.push(i);
      }
      return options;
    } else {
      const {minimum, amount} = this.props.offer.packaging;
      for (let i = minimum; i <= amount; i = i + split) {
        options.push(i);
      }
    }
    return options;
   }

  handleQuantity = e => {
    const {minimum, amount, splits} = this.props.offer.packaging;
    const value = parseInt(e.target.value, 10)
    const warning = value < minimum || !value 
      ? `minimum is ${minimum}`
      :  value > amount 
        ? `maximum is ${amount}`
        : value % parseInt(splits, 10) === 0 || value === parseInt(minimum, 10)
          ? null
          : `split is ${splits}`
    this.setState({quantity: value, warning: warning})
  };

  render() {
    const {offer, order, isEdit, removePopup, offerDetailIsFetching, orderDetailIsFetching} = this.props;
    if (isEdit && orderDetailIsFetching) return <Spinner />
    if (offerDetailIsFetching) return <Spinner />
    const location =`${offer.warehouse.address.city}, ${offer.warehouse.address.province.name}`;
    const {unit, capacity, minimum, amount, splits} = offer.packaging;
    const unitName = `${getUnit(unit.name)}${capacity > 1 && 's'}`;
    const packageSize = `${capacity} ${unitName}`;
    const availableProducts = `${amount} pck / ${(amount * capacity).formatNumber()} ${unitName}`;
    const totalPrice = this.state.quantity ? offer.pricing.price * this.state.quantity * capacity : "";
    const {tiers} = offer.pricing;
    const priceLevelOptions = tiers.map(i => {
      const object = {
        name: `${i.quantityFrom} - ${i.quantityTo} pck / $${i.price}`, //name: `${i.quantityFrom} - ${i.quantityTo} pck / $${i.price}`,
        id: {quantityFrom: i.quantityFrom, quantityTo: i.quantityTo, price: i.price}
      };
      return object;
    })
    const noPriceTiersOption = [{
      name: offer.pricing.price,
      id:  offer.pricing.price
    }]
    const currentPriceLevel = isEdit 
      ? tiers.find(i => i.id === order.productOffer.pricing.tiers[0].id)
      : null
    const currentPriceLevelName = currentPriceLevel 
    ? {
      name: `${currentPriceLevel.quantityFrom} - ${currentPriceLevel.quantityTo} pck / $${currentPriceLevel.price}`,
      id: {quantityFrom: currentPriceLevel.quantityFrom, quantityTo: currentPriceLevel.quantityTo, price: currentPriceLevel.price}
    } : null
    const priceLevelDefault = !tiers.length ? noPriceTiersOption[0].name : currentPriceLevelName && currentPriceLevelName.name
    const quantityOptions = this.getQualityOptions(splits)
    const quantityOptionsWithName = quantityOptions.map(i => {
      const object = {name: `${i.toString()} pck`, id: i}
      return object;
    })

  const attachments = offer.attachments.map(att => {
    return <div><img src={file} alt='File' className='fileicon'></img><p className='filedescription'>{att.fileName}</p></div>
  });

    const footerComponent = (
      <>
        <Button color="blue" onClick={removePopup}>
          Cancel
        </Button>
        {!isEdit 
        ? <Button color="green" onClick={this.createOrder}>
          Continue
        </Button>
        :<Button color="green" onClick={this.editOrder}>
          Edit
        </Button>}
      </>
    )

    return (
        <PopupComponent 
          footerComponent={footerComponent} 
          handleContinue={this.handleContinue} 
          removePopup={removePopup} 
          headerTitle="Purchase"
        >
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
              {attachments}
            </div>
          </div>

          <div className="divider" />

          <div className="add-cart-body-section">
            <h3>Purchase Info</h3>

            <div>
              <b>Select Price Level</b>
              <Dropdown
                opns={tiers.length ? priceLevelOptions : noPriceTiersOption}
                placeholder="Select Price Level"
                onChange={value => {
                  this.setState({pricing: value})
                }}
                currentValue={priceLevelDefault}
                disabled={!tiers.length && true}
              />
            </div>

           
            <div>
              <b>Select Quantity</b>
              {quantityOptionsWithName.length <= 10 
              ?  <Dropdown
                opns={quantityOptionsWithName}
                placeholder="Select Quantity"
                disabled={priceLevelOptions.length && !this.state.pricing && true}
                currentValue={isEdit && `${order.quantity} pck`}
                onChange={value => {
                  this.setState({quantity: value})
                }}/>
                : <div className="purchase-info">
                  <InputControlled                             
                    value={this.state.quantity}
                    handleChange={this.handleQuantity}
                    className={this.state.warning ? "invalid" : ""}
                    name="quantity"
                    placeholder=""
                    type="number"
                    min={parseInt(minimum-1, 10)}
                    max={parseInt(amount, 10)}
                    step={parseInt(5, 10)}
                  />
                  {this.state.warning && <label>{this.state.warning}</label>}
                </div>
              }
            </div>
           
            <div className="purchase-info">
              <b>Total Quantity:</b> 
              <span>
                {(this.state.quantity && !this.state.warning && `${this.state.quantity} pck`) || (isEdit && `${order.quantity} pck`)}
              </span>
            </div>
            <div className="purchase-info">
              <b>Price/LB:</b> 
              <span>${offer.pricing.price}</span> 
            </div>
            {/* <div className="purchase-info">
              <b>Delivered Price/LB:</b> 
              <span>$</span> 
            </div> */}
            <div className="purchase-info">
              <b>Subtotal:</b> 
              {!this.state.warning && (totalPrice || order.selectedOfferPrice) && <span>${totalPrice || order.selectedOfferPrice}</span>}
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
  createNewOrder: PropTypes.func,
  id: PropTypes.number,
  isFetching: PropTypes.bool,
  removePopup: PropTypes.func,
}
