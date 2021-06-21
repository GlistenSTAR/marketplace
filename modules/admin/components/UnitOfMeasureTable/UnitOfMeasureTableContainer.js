import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  getDataRequest,
  openEditPopup,
  closeConfirmPopup,
  deleteConfirmation,
  getMeasureTypesDataRequest,
  deleteUnit
} from '../../actions'
import { withDatagrid } from '../../../datagrid'
import UnitOfMeasureTable from './UnitOfMeasureTable'
import { makeGetConfig, makeGetFilterValue, makeGetLoading, makeGetConfirmMessage, makeGetDeleteRowById } from '../../selectors'
import { makeRows } from './UnitOfMeasureTable.services'

const mapDispatchToProps = {
    getDataRequest,
    openEditPopup,
    closeConfirmPopup,
    deleteConfirmation,
    getMeasureTypesDataRequest,
    deleteUnit
}

const makeMapStateToProps = () => {
    const getConfig = makeGetConfig()
    const getFilterValue = makeGetFilterValue()
    const getLoading = makeGetLoading()
    const getConfirmMessage = makeGetConfirmMessage()
    const getDeleteRowById = makeGetDeleteRowById()

    const mapStateToProps = (state, { datagrid }) => {
        let cfg = getConfig(state)

        return {
            config: cfg['units-of-measure'],
            rows: makeRows(datagrid),
            filterValue: getFilterValue(state),
            loading: getLoading(state),
            confirmMessage: getConfirmMessage(state),
            deleteRowById: getDeleteRowById(state)
        }
    }
    return mapStateToProps
}

export default withDatagrid(connect(makeMapStateToProps, mapDispatchToProps)(injectIntl(UnitOfMeasureTable)))
