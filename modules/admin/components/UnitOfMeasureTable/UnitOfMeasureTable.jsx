import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import confirm from '../../../../components/Confirmable/confirm'
import ProdexTable from '../../../../components/table'
import ActionCell from '../../../../components/table/ActionCell'

const UnitOfMeasureTable = props => {
  const columns = [
    {
      name: 'name',
      title: (
        <FormattedMessage id='global.name' defaultMessage='Name' />
      ),
      allowReordering: false
    },
    {
      name: 'nameAbbreviation',
      title: (
        <FormattedMessage id='global.nameAbbreviation' defaultMessage='Name Abbreviation' />
      )
    },
    {
      name: 'measureType',
      title: (
        <FormattedMessage id='global.measureType' defaultMessage='Measure Type' />
      )
    },
    {
      name: 'ratioToBaseSiUnit',
      title: (
        <FormattedMessage id='global.ratioToBaseSiUnit' defaultMessage='Ratio to Base SI Unit' />
      )
    }
  ]

  useEffect(() => {
    props.getMeasureTypesDataRequest()
  }, [])

  const getActions = () => {
    const { intl, openEditPopup, deleteUnit, datagrid } = props

    const { formatMessage } = intl
    return [
      {
        text: formatMessage({ id: 'global.edit', defaultMessage: 'Edit' }),
        hidden: row => row.system,
        callback: row => openEditPopup(row)
      },
      {
        text: formatMessage({ id: 'global.delete', defaultMessage: 'Delete' }),
        callback: row =>
          confirm(
            formatMessage({ id: 'confirm.deleteMeasurement.title', defaultMessage: 'Delete Unit of Measure' }),
            formatMessage(
              {
                id: 'confirm.deleteMeasurement.content',
                defaultMessage: `Do you really want to delete '${row.name}' unit?`
              },
              { name: row.name }
            )
          ).then(async () => {
            try {
              await deleteUnit(row.id)
              datagrid.removeRow(row.id)
            } catch (e) {
              console.error(e)
            }
          })
      }
    ]
  }

  const getRows = rows => {
    return rows.map(row => {
      return {
        ...row,
        name: (
          <ActionCell
            row={row}
            getActions={getActions}
            content={row.name}
            {...(row.system === false && { onContentClick: () => props.openEditPopup(row) })}
          />
        )
      }
    })
  }

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
        rows={getRows(rows)}
      />
    </div>
  )
}

export default UnitOfMeasureTable
