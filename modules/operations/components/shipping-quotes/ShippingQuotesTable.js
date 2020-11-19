import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProdexGrid from '~/components/table'
import confirm from '~/src/components/Confirmable/confirm'
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl'
import { withDatagrid } from '~/modules/datagrid'

import { getSafe } from '~/utils/functions'
import { currency } from '~/constants/index'
import { getLocaleDateFormat } from '~/components/date-format'
import moment from 'moment/moment'

import {
  deleteShippingQuote,
  openPopup
  // handleOpenConfirmPopup,
  // closeConfirmPopup,
} from '../../actions'
import Router from 'next/router'

class ShippingQuotesTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [
        {
          name: 'quoteId',
          title: (
            <FormattedMessage id='operations.quoteId' defaultMessage='Quote Id'>
              {text => text}
            </FormattedMessage>
          ),
          actions: this.getActions()
        },
        {
          name: 'validityDate',
          title: (
            <FormattedMessage id='operations.validityDate' defaultMessage='Validity Date'>
              {text => text}
            </FormattedMessage>
          )
        },
        {
          name: 'price',
          title: (
            <FormattedMessage id='operations.price' defaultMessage='Price'>
              {text => text}
            </FormattedMessage>
          )
        },
        {
          name: 'carrierName',
          title: (
            <FormattedMessage id='operations.carrierName' defaultMessage='Carrier Name'>
              {text => text}
            </FormattedMessage>
          )
        },
        /*{
        name: 'createdAt',
        title: (
          <FormattedMessage id='operations.createdAt' defaultMessage='Created At'>
            {text => text}
          </FormattedMessage>
        )
      },*/
        /*{
        name: 'updatedAt',
        title: (
          <FormattedMessage id='operations.updatedAt' defaultMessage='Updated At'>
            {text => text}
          </FormattedMessage>
        )
      },*/

      ]
    }
  }

  getActions = () => {
    const { intl, deleteShippingQuote, datagrid } = this.props

    const { formatMessage } = intl
    return [
      /*{ // temporary? - missing edit endpoint
        text: formatMessage({ id: 'global.edit', defaultMessage: 'Edit' }),
        callback: row => openPopup(row.data)
      },*/
      {
        text: formatMessage({ id: 'global.delete', defaultMessage: 'Delete' }),
        callback: row =>
          confirm(
            formatMessage({ id: 'confirm.deleteShippingQuote', defaultMessage: 'Delete Shipping Quote' }),
            formatMessage(
              { id: 'confirm.deleteItem', defaultMessage: `Do you really want to delete ${row.quoteId}?` },
              { item: row.quoteId }
            )
          ).then(async () => {
            try {
              await deleteShippingQuote(row.id)
              datagrid.removeRow(row.id)
            } catch (e) {
              console.error(e)
            }
          })
      }
    ]
  }

  render() {
    const { datagrid, rows, filterValue, loading } = this.props

    let { columns } = this.state

    return (
      <React.Fragment>
        <ProdexGrid
          tableName='operations_shipping_quotes'
          {...datagrid.tableProps}
          filterValue={filterValue}
          columns={columns}
          rows={rows}
          loading={datagrid.loading || loading}
          style={{ marginTop: '5px' }}
          columnActions='quoteId'
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  deleteShippingQuote,
  openPopup
}

const mapStateToProps = (state, { datagrid }) => {
  return {
    filterValue: state.operations.filterValue,
    loading: state.operations.loading,
    rows: datagrid.rows.map(d => {
      return {
        data: d, // all row data, used for edit popup
        id: d.id,
        carrierName: d.carrierName || '',
        price: d.price ? (
          <FormattedNumber
            minimumFractionDigits={2}
            maximumFractionDigits={2}
            style='currency'
            currency={currency}
            value={d.price}
          />
        ) : (
          'N/A'
        ),
        quoteId: d.quoteId || '',
        validityDate: d.validityDate ? moment(d.validityDate).format(getLocaleDateFormat()) : 'N/A'
      }
    })
  }
}

export default withDatagrid(connect(mapStateToProps, mapDispatchToProps)(injectIntl(ShippingQuotesTable)))
