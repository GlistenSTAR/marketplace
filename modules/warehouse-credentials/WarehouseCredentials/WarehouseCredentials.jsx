import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Dimmer, Loader } from 'semantic-ui-react'
import { func, bool, array, string } from 'prop-types'
import { withDatagrid } from '~/modules/datagrid'
// Services
import { injectIntl, FormattedMessage } from 'react-intl'
import ProdexTable from '../../../components/table'
import { groupActions } from '../../company-product-info/constants'
import {
  postNewWarehouseRequest,
  putEditWarehouse
} from '../../settings/actions'
import { getSafe } from '../../../utils/functions'
// Constants
import { certifiedColumns, pendingColumns } from './WarehouseCredentials.constants'
// Styles


const WarehouseCredentialsContainer = props => {

  const {
    datagrid,
    intl: { formatMessage },
    rows,
    type
  } = props

  console.log(rows)

  return (
    <>
      <div className='flex stretched warehouse-credentials-wrapper listings-wrapper' style={{ padding: '10px 30px' }}>
        {type !== '' && rows.length &&
          <ProdexTable
            {...datagrid.tableProps}
            tableName='warehouse_credentials_grid'
            columns={type === 'pending' ? pendingColumns : certifiedColumns}
            rows={rows}
            hideCheckboxes
            loading={datagrid.loading}
          />
        }
      </div>
    </>
  )
}

const mapDispatchToProps = {
  postNewWarehouseRequest,
  putEditWarehouse
}

const mapStateToProps = (state, { datagrid, type }) => {
  console.log('XXX')
  console.log('TYPE2', type)
  console.log('ROWS', datagrid.rows.length, datagrid.rows)
  if (type === 'pending') {
    return {
      rows: false && datagrid.rows.length ? datagrid.rows.map(r => {
        return {
          user: r.name,
          description: r.name,
          date: r.createdAt
        }
      }) : []
    }
  } else {
    return {
      rows: datagrid.rows.length ? datagrid.rows.map(r => {
        return {
          warehouseName: r.name
        }
      }) : []
    }
  }
}

WarehouseCredentialsContainer.propTypes = {
  type: string,
  rows: array
}

WarehouseCredentialsContainer.defaultProps = {
  type: '',
  rows: []
}

export default withDatagrid(connect(mapStateToProps, mapDispatchToProps)(injectIntl(WarehouseCredentialsContainer)))
