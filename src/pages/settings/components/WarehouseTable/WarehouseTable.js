import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProdexGrid from '~/components/table'
import { Confirm } from 'semantic-ui-react'
import {
  getWarehousesDataRequest,
  openPopup,
  closeConfirmPopup,
  deleteConfirmation,
  handleOpenConfirmPopup
} from '../../actions'

class WarehouseTable extends Component {
  state = {
    columns: [
      { name: 'name', title: 'Warehouse Name' },
      { name: 'address', title: 'Address' },
      { name: 'contactName', title: 'Contact Name' },
      { name: 'phone', title: 'Phone' },
      { name: 'email', title: 'E-mail' }
    ]
  }

  componentDidMount() {
    this.props.getWarehousesDataRequest()
  }

  handlerChangeRows(rows) {
    if (this.props.currentTab === 'Branches') {
      return rows.filter(item => item.warehouse === false)
    }
    return rows
  }

  render() {
    const {
      rows,
      filterValue,
      loading,
      openPopup,
      closeConfirmPopup,
      deleteConfirmation,
      confirmMessage,
      handleOpenConfirmPopup
    } = this.props

    const { columns } = this.state

    return (
      <React.Fragment>
        <Confirm
          size="tiny"
          content="Do you really want to delete warehouse?"
          open={confirmMessage}
          onCancel={closeConfirmPopup}
          onConfirm={deleteConfirmation}
        />
        <ProdexGrid
          filterValue={filterValue}
          columns={columns}
          loading={loading}
          rows={this.handlerChangeRows(rows)}
          style={{ marginTop: '5px' }}
          rowActions={[
            { text: 'Edit', callback: row => openPopup(row) },
            { text: 'Delete', callback: row => handleOpenConfirmPopup(row.id) }
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  getWarehousesDataRequest,
  openPopup,
  closeConfirmPopup,
  deleteConfirmation,
  handleOpenConfirmPopup
}

const mapStateToProps = state => {
  return {
    rows: state.settings.warehousesRows,
    editPopupBoolean: state.settings.editPopupBoolean,
    addNewWarehousePopup: state.settings.addNewWarehousePopup,
    filterValue: state.settings.filterValue,
    confirmMessage: state.settings.confirmMessage,
    currentTab: state.settings.currentTab,
    loading: state.settings.loading
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WarehouseTable)
