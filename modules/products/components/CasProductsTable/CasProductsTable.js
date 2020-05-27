import React, { Component } from 'react'
import confirm from '~/src/components/Confirmable/confirm'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Popup, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'

import ProdexTable from '~/components/table'
import {
  openPopup,
  openEditAltNamesCasPopup,
  closeConfirmPopup,
  getHazardClassesDataRequest,
  getPackagingGroupsDataRequest,
  deleteCasProduct
} from '../../actions'
import { withDatagrid } from '~/modules/datagrid'

const columns = [
  {
    name: 'casIndexName',
    title: (
      <FormattedMessage id='global.indexName' defaultMessage='Index Name'>
        {text => text}
      </FormattedMessage>
    ),
    width: 375,
    sortPath: 'CasProduct.casIndexName'
  },
  {
    name: 'casNumber',
    title: (
      <FormattedMessage id='global.casNumber' defaultMessage='CAS Number'>
        {text => text}
      </FormattedMessage>
    ),
    width: 150,
    sortPath: 'CasProduct.casNumber'
  }
  // { name: 'chemicalName', title: <FormattedMessage id='global.chemicalName' defaultMessage='Chemical Name'>{text => text}</FormattedMessage>, width: 375, sortPath: 'CasProduct.chemicalName' },
  // { name: 'unNumberCode', title: <FormattedMessage id='global.unNumber' defaultMessage='UN Number'>{text => text}</FormattedMessage>, width: 150, sortPath: 'CasProduct.unNumber.unNumberCode' },
  // { name: 'packagingGroup', title: <FormattedMessage id='global.packagingGroup' defaultMessage='Packaging Group'>{text => text}</FormattedMessage>, width: 150, sortPath: 'CasProduct.packagingGroup.groupCode' },
  // { name: 'hazardClassesLabeled', title: <FormattedMessage id='global.hazardClasses' defaultMessage='Hazard Classes'>{text => text}</FormattedMessage>, width: 150 },
]

class CasProductsTable extends Component {
  componentDidMount() {
    this.props.getHazardClassesDataRequest()
    this.props.getPackagingGroupsDataRequest()
  }

  render() {
    const { datagrid, config, intl, rows, openPopup, openEditAltNamesCasPopup, deleteCasProduct } = this.props

    const { formatMessage } = intl

    return (
      <React.Fragment>
        <ProdexTable
          {...datagrid.tableProps}
          tableName='admin_cas_products'
          columns={columns}
          rows={rows}
          defaultSorting={{
            columnName: 'casIndexName',
            sortPath: 'CasProduct.casIndexName',
            direction: 'asc'
          }}
          rowActions={[
            {
              text: formatMessage({ id: 'global.edit', defaultMessage: 'Edit' }),
              callback: ({ hazardClassesLabeled, ...rest }) => openPopup(rest)
            },
            {
              text: formatMessage({ id: 'admin.editAlternativeNames', defaultMessage: 'Edit Alternative Names' }),
              callback: row => openEditAltNamesCasPopup(row)
            },
            {
              text: formatMessage({ id: 'global.delete', defaultMessage: 'Delete' }),
              callback: row =>
                confirm(
                  formatMessage({ id: 'confirm.deleteCasProduct.title', defaultMessage: 'Delete CAS Product?' }),
                  formatMessage(
                    {
                      id: 'confirm.deleteCasProduct.content',
                      defaultMessage: `Do you really want to delete '${row.chemicalName}' CAS product?`
                    },
                    { name: row.chemicalName }
                  )
                ).then(() => {
                  deleteCasProduct(row.id)
                  datagrid.removeRow(row.id)
                })
            }
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  openPopup,
  openEditAltNamesCasPopup,
  closeConfirmPopup,
  getHazardClassesDataRequest,
  getPackagingGroupsDataRequest,
  deleteCasProduct
}

const transformHazardClasses = classes => {
  if (!classes || !classes.length) return
  return (
    <Label.Group color='blue'>
      {classes.map((b, i) => (
        <Popup
          key={i}
          content={b.description}
          trigger={
            <Label size='tiny' key={i}>
              {b.classCode}
            </Label>
          }
        />
      ))}
    </Label.Group>
  )
}

const mapStateToProps = (state, { datagrid }) => {
  return {
    rows: datagrid.rows.map(d => {
      return {
        ...d,
        hazardClassesLabeled: transformHazardClasses(d.hazardClasses)
      }
    })
  }
}

export default withDatagrid(connect(mapStateToProps, mapDispatchToProps)(injectIntl(CasProductsTable)))