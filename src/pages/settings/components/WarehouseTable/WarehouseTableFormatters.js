import React from 'react' 
import { connect } from 'react-redux' 
import { Dropdown } from 'semantic-ui-react'

import { handleEditPopup, deleteWarehouse } from '../../actions' 

function editDeleteCell(value) {
	return (
		<Dropdown icon='ellipsis vertical'>
			<Dropdown.Menu>
				<Dropdown.Item 
					text='Edit' 
					onClick={ () => this.props.handleEditPopup(this.props.row) }
				/>
				<Dropdown.Item 
					text='Delete' 
					onClick={ () => this.props.deleteWarehouse(this.props.row.branchId) }
				/>
			</Dropdown.Menu>
		</Dropdown>	
	)
}

const mapDispatchToProps = {   
	handleEditPopup,
	deleteWarehouse
} 

export const editDeleteCellFormatter =  connect(null, mapDispatchToProps)(editDeleteCell) 