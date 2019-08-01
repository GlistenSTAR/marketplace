import React, { Component } from 'react'
import { connect } from 'react-redux'
import confirm from '~/src/components/Confirmable/confirm'
import { injectIntl } from 'react-intl'
import { withDatagrid } from '~/modules/datagrid'
import ProdexTable from '~/components/table'
import { Checkbox } from 'semantic-ui-react'

import { FormattedMessage } from 'react-intl'

import * as Actions from '../../actions'


class CompaniesTable extends Component {

  getRows = (rows) => {
    return rows.map((row) => {
      return {
        ...row,
        reviewRequested: <Checkbox key={`review${row.id}`} toggle={true} defaultChecked={row.reviewRequested} onClick={(e, data) => this.props.reviewRequestedSwitch(row.id, data)}
                                   data-test={`admin_company_table_${row.id}_chckb`}/>
      }
    })
  }

  render() {
    const {
      datagrid,
      columns,
      rows,
      filterValue,
      loading,
      openEditCompany,
      confirmMessage,
      handleOpenConfirmPopup,
      // closeConfirmPopup,
      // deleteRowById,
      deleteCompany,
      openRegisterDwollaAccount,
      takeOverCompany,
      resendWelcomeEmail,
      intl
    } = this.props

    const { formatMessage } = intl

    return (
      <React.Fragment>
        <ProdexTable
          {...datagrid.tableProps}
          tableName='admin_companies'
          columns={columns}
          rows={this.getRows(rows)}
          rowActions={[
            { text: formatMessage({ id: 'global.edit', defaultMessage: 'Edit' }), callback: (row) => openEditCompany(row.id, row) },
            {
              text: formatMessage({ id: 'global.delete', defaultMessage: 'Delete' }), callback: (row) => confirm(
                formatMessage({ id: 'confirm.deleteCompany.title', defaultMessage: 'Delete Company?' }),
                formatMessage({ id: 'confirm.deleteCompany.content', defaultMessage: `Do you really want to delete '${row.name}' company?` }, { name: row.name })
              ).then(() => {
                deleteCompany(row.id)
                datagrid.removeRow(row.id)
              })
            },
            { text: formatMessage({ id: 'admin.registerDwollaAccount', defaultMessage: 'Register Dwolla Account' }), callback: (row) => openRegisterDwollaAccount(row), hidden: row => row.hasDwollaAccount === 'Yes' },
            {
              text: <FormattedMessage id='admin.takeOver' defaultMessage='Take-over as Company Admin' />,
              callback: (row) => takeOverCompany(row.id),
              hidden: row => !row.primaryUser
            },
            {
              text: <FormattedMessage id='admin.resendWelcomeEmail' defaultMessage='Resend Welcome Email' />,
              callback: (row) => resendWelcomeEmail(row.primaryUser.id),
              hidden: row => !row.reviewRequested || !row.primaryUser
            }
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ admin }, { datagrid }) => {
  return {
    columns: admin.config[admin.currentTab].display.columns,
    companyListDataRequest: admin.companyListDataRequest,
    filterValue: admin.filterValue,
    currentTab: admin.currentTab,
    rows: datagrid.rows.map(c => ({
      ...c,
      hasLogisticsAccounts: c.logisticsAccount ? 'Yes' : 'No',
      hasDwollaAccount: c.hasDwollaAccount ? 'Yes' : 'No',
      primaryBranchAddress: c.primaryBranch && c.primaryBranch.address ?
        c.primaryBranch.address.streetAddress + ', ' +
        c.primaryBranch.address.city + ', ' +
        (c.primaryBranch.address.province ? c.primaryBranch.address.province.name + ', ' : '') +
        (c.primaryBranch.address.country ? c.primaryBranch.address.country.name : '')
        : '',
      primaryContact: c.primaryUser ?
        c.primaryUser.name
        : '',
      contactEmail: c.primaryUser ?
        c.primaryUser.email
        : '',
      reviewRequested: c.reviewRequested
    })),
    confirmMessage: admin.confirmMessage,
    deleteRowById: admin.deleteRowById,
  }
}

export default withDatagrid(connect(mapStateToProps, Actions)(injectIntl(CompaniesTable)))