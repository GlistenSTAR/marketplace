import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Control, Form } from 'react-redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import { handleEditPopup, handleSubmitEditPopup, getProductsWithRequiredParam } from '../../actions';

class EditProductCatalogPopup extends React.Component {
  state = {
    searchProductInputValue: '',
    productName: '',
    productNumber: '',
    productId: '',
    packagingType: '',
    packagingSize: ''
  };

  handleSearchInputValue = e => {
    this.setState({
      searchProductInputValue: e.target.value
    })
  }

  handleProductInputsValue = stateKey => e => {
    this.setState({
      [stateKey]: e.target.value
    })
  }

  handleChosenProduct = (e) => {
    const itemId = Number(e.target.getAttribute('data-id'));
    const chosenItem = this.props.editPopupSearchProducts.filter(item => {
      return item.id === itemId;
    });
    // const item = ...chosenItem

    this.setState({
      productName: chosenItem.productName,
      productNumber: chosenItem.productNumber,
      productId: chosenItem.productId,
      packagingType: chosenItem.packagingType,
      packagingSize: chosenItem.packagingSize
    }, () => console.log(this.state, 354))
  }

  handleProductsRequest = e => {
    if(e.target.value.length < 3) return;
    this.props.getProductsWithRequiredParam(e.target.value);
  }

  render() {
    const { handleEditPopup, handleSubmitEditPopup, popupValues, searchProductInputValue, editPopupSearchProducts } = this.props;
    const { 
      productsArr,
      productName,
      productNumber,
      productId,
      packagingType,
      packagingSize
    } = this.state;

    return (					
      <div className="popup-wrapper col-xs-10 center-xs">      
        <Form 
          model="forms.settingsPopup.editBankAccount" 
          onSubmit={(value) => handleSubmitEditPopup(value, popupValues.branchId)}
          className="b-popup col-xs-8"
        >    
          <h2>{'Warehouse'} Profile</h2>
          <ul className="">
            <li className="inputs-wrapper">
              <label className="b-product-search settings-popup-label" htmlFor="product-search">
                CAS Number / Product Search
                <input 
                  className="popup-input" 
                  id="product-search" 
                  value={ searchProductInputValue }
                  onChange={ e => this.handleSearchInputValue(e) || this.handleProductsRequest(e) }
                  autoComplete="off"
                />
                {
                  editPopupSearchProducts.length !== 0 ? 
                  <ul className="b-product-search__found-products">
                    {
                      editPopupSearchProducts.map(product => {
                        return (
                          <li
                            className="product-item" 
                            value={ product.productName }
                            key={ product.id }
                            data-id={ product.id }
                            onClick={ e => this.handleChosenProduct(e) }
                          >
                            { product.productName }
                          </li>
                        )
                      })
                    }
                  </ul> 
                  : null
                }
              </label>            
            </li>
            <li className="inputs-wrapper">
              <label className="settings-popup-label name" htmlFor="product-name">                        
                Product Name
                <Control.text model=".accountHolderName" className="popup-input" id="product-name" value={ productName } onChange={ this.handleProductInputsValue('productName') } />
              </label>
              <label className="settings-popup-label address" htmlFor="product-number">
                Product Number
                <Control.text model=".accountHolderType" className="popup-input" id="product-number" value={ productNumber } onChange={ this.handleProductInputsValue('productNumber') } />
              </label>
              <label className="settings-popup-label city" htmlFor="product-id">
                Product ID
                <Control.text model=".accountNumber" className="popup-input" id="product-id" value={ productId } onChange={ this.handleProductInputsValue('productId') } />
              </label>
            </li>
            <li className="inputs-wrapper">
              <label className="settings-popup-label state" htmlFor="product-packaging-type">  
                Packaging Type
                <Control.text model=".country" className="popup-input" id="product-packaging-type" value={ packagingType } onChange={ this.handleProductInputsValue('packagingType') } />
              </label>
              <label className="settings-popup-label zip-code" htmlFor="product-packaging-size">
                Packaging Size
                <Control.text model=".currency" className="popup-input" id="product-packaging-size" value={ packagingSize } onChange={ this.handleProductInputsValue('packagingSize') } />
              </label>
            </li>
            <li className="inputs-wrapper buttons-wrapper">
              <input 
                type="button" 
                value="Cancel"
                onClick={ handleEditPopup }
                className="cancel-popup-btn"
              />
              <button className="submit-popup-btn" >Save Mapping</button> 
            </li>
          </ul>
        </Form>
      </div>
    );    
  }
}

const mapDispatchToProps = {   
  handleEditPopup,
  handleSubmitEditPopup,
  getProductsWithRequiredParam
};

const mapStateToProps = state => {
  return {
    popupValues: state.settings.popupValues,
    editPopupSearchProducts: state.settings.editPopupSearchProducts
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProductCatalogPopup);