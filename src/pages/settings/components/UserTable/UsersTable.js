import React, { Component } from 'react'
import { connect } from 'react-redux'

import { 
	SearchState, 
	IntegratedFiltering,
	SortingState,
	IntegratedSorting
} from '@devexpress/dx-react-grid'
import {
	Grid,
	Table,
	TableHeaderRow,
	DragDropProvider,
	TableColumnReordering
} from '@devexpress/dx-react-grid-bootstrap4'
// } from '~/components/dx-grid-semantic-ui/plugins'

import {
	EditDeleteFormatterProvider,
	PermissionFormatterProvider
} from './UsersTableProviders'

import { getUsersDataRequest } from '../../actions'

function cn() {
	let res = ""
	for (let j = 0, len = arguments.length, v; j < len; j++) {
		v = arguments[j]
		if (v) {
			res += " " + v
		}
	}
	return res.trim()
}

class UsersTable extends Component {
	state = {
		columns: [
			{ name: 'editDeleteBtn', title: ' ', dropdown: true, width: 50 },
			{ name: 'userName', title: 'User Name' },
			{ name: 'title', title: 'Title' },
			{ name: 'email', title: 'E-mail' },
			{ name: 'phone', title: 'Phone' },
			{ name: 'homeBranch', title: 'Home Branch' },
			{ name: 'permissions', title: 'Permissions', dropdown: true }
		]
	}

	componentDidMount() {
		this.props.getUsersDataRequest()
	}

	render() {
		const {
			rows,
			checkboxColumns,
			permissionsColumns,
			editDeleteColumns,
			filterValue,
			// editPopupBoolean,
			// addNewWarehousePopup
		} = this.props

		const { columns } = this.state

		const GridRoot = props => <Grid.Root {...props} className="bootstrapiso" />
		const HeaderCells = props => <TableHeaderRow.Cell {...props} className={'columns-title-cell'} />
		const TableCells = props => <Table.Cell {...props} className={'columns-rows-cell'} />

		return (
			<div className="bootstrapiso">
				<Grid
					rootComponent={GridRoot}
					rows={rows}
					columns={columns}
				>
					<DragDropProvider />
					<SearchState value={filterValue} />
					<IntegratedFiltering />
					<SortingState defaultSorting={[{columnName: 'userName'}]} />
					<IntegratedSorting />

					<Table cellComponent={TableCells} />
					<TableHeaderRow showSortingControls cellComponent={HeaderCells} />
					<EditDeleteFormatterProvider
						for={editDeleteColumns}
						rows={rows}
					/>
					<PermissionFormatterProvider
						for={permissionsColumns}
						rows={rows}
					/>
					<TableColumnReordering defaultOrder={columns.map(c => c.name)} />
				</Grid>
			</div>
		)
	}
}

const mapDispatchToProps = {
	getUsersDataRequest
}

const mapStateToProps = state => {
	return {
		rows: state.settings.usersRows,
		editDeleteColumns: state.settings.columnsForFormatter.editDeleteColumns,
		permissionsColumns: state.settings.columnsForFormatter.permissionsColumns,
		filterValue: state.settings.filterValue
		// editPopupBoolean: state.settings.editPopupBoolean,
		// addNewWarehousePopup: state.settings.addNewWarehousePopup
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable) 