import { useEffect } from 'react'
import PropTypes from 'prop-types'
// Components
import ProdexTable from '../../../../components/table'
// Services
import { columns, getRows } from './UnitOfMeasureTable.services'

const UnitOfMeasureTable = props => {
  useEffect(() => {
    props.getMeasureTypesDataRequest()
  }, [])
  
  const { loading, rows, datagrid, filterValue } = props

  const { tableName } = props.config

  return (
    <div className='flex stretched listings-wrapper'>
      <ProdexTable
        tableName={tableName}
        {...datagrid.tableProps}
        filterValue={filterValue}
        loading={datagrid.loading || loading}
        columns={columns}
        rows={getRows(rows, props)}
      />
    </div>
  )
}

UnitOfMeasureTable.propTypes = {
  getMeasureTypesDataRequest: PropTypes.func,
  openEditPopup: PropTypes.func,
  deleteUnit: PropTypes.func,
  rows: PropTypes.array,
  filterValue: PropTypes.string,
  loading: PropTypes.bool,
  config: PropTypes.object,
  datagrid: PropTypes.object,
  intl: PropTypes.object
}

UnitOfMeasureTable.defaultValues = {
  getMeasureTypesDataRequest: () => {},
  openEditPopup: () => {},
  deleteUnit: () => {},
  rows: [],
  filterValue: null,
  loading: false,
  config: {},
  datagrid: {},
  intl: {}
}

export default UnitOfMeasureTable
