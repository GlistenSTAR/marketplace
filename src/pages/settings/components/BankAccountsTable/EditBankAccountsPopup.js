import React from 'react';
import { connect } from 'react-redux';
import { Control, Form } from 'react-redux-form';

import { handleEditPopup, handleSubmitEditPopup } from '../../actions';

function EditBranchPopup(props) {
  const { handleEditPopup, handleSubmitEditPopup, popupValues } = props;
  const [ address, city ]  = popupValues.address.split(','); 

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
            <label className="warehouse-label name" htmlFor="warehouse-name">                        
              Account Holder Name
            <Control.text model=".accountHolderName" className="warehouse-input" id="warehouse-name" defaultValue={ popupValues.accountHolderName } />
            </label>
            <label className="warehouse-label address" htmlFor="warehouse-address">
              Account Holder Type
              <Control.text model=".accountHolderType" className="warehouse-input" id="warehouse-address" defaultValue={ popupValues.accountHolderType } />
            </label>
            <label className="warehouse-label city" htmlFor="warehouse-city">
              Account Number
              <Control.text model=".accountNumber" className="warehouse-input" id="warehouse-city" defaultValue={ popupValues.accountNumber } />
            </label>
          </li>
          <li className="inputs-wrapper">
            <label className="warehouse-label state" htmlFor="warehouse-state">  
              Country
              <Control.text model=".country" className="warehouse-input" id="warehouse-state" defaultValue={ popupValues.country } />
            </label>
            <label className="warehouse-label zip-code" htmlFor="warehouse-zip-code">
              Currency
              <Control.text model=".currency" className="warehouse-input" id="warehouse-zip-code" defaultValue={ popupValues.currency } />
            </label>
            <label className="warehouse-label contact-name" htmlFor="warehouse-contactName">
              Routing Number
              <Control.text model=".routingNumber" className="warehouse-input" id="warehouse-contactName" defaultValue={ popupValues.routingNumber } />
            </label>
          </li>
          <li className="inputs-wrapper buttons-wrapper">
            <input 
              type="button" 
              value="Cancel"
              onClick={ handleEditPopup }
              className="cancel-popup-btn"
            />
            <button className="submit-popup-btn" >Update Warehouse</button> 
          </li>
        </ul>
      </Form>
    </div>
  );
}

const mapDispatchToProps = {   
  handleEditPopup,
  handleSubmitEditPopup
};

const mapStateToProps = state => {
  return {
		popupValues: state.settings.popupValues
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditWarehousePopup);