import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { 
	handleEditPopup, 
	deleteBankAccount 
} from '../../actions';

const editDeleteCell = props => {	
	return (
		<div className="editDelete-wrapper">
			<button className="editDelete-btn" />
			<ul className="handlers-row-menu">
				<li 
					className="handlers-row-menu__btn"
					onClick={ () => props.handleEditPopup(props.row) }
				>
					{'Edit'}
				</ li>
				<li 
					className="handlers-row-menu__btn"
					onClick={ () => props.deleteBankAccount(props.row.id) }
				>
					{'Delete'}
				</ li>
			</ul>
		</div>		
	);
}

const mapDispatchToProps = {   
	handleEditPopup,
	deleteBankAccount
};

const mapStateToProps = state => {
  return {
		state
  }
}

export const editDeleteCellFormatter =  connect(mapStateToProps, mapDispatchToProps)(editDeleteCell);