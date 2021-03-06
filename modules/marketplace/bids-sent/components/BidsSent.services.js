import { Image } from 'semantic-ui-react'
import Router from 'next/router'
import { debounce } from 'lodash'
import moment from 'moment'
// Components
import ActionCell from '../../../../components/table/ActionCell'
import RowDescription from '../../components/RowDescriptionContainer'
// Services
import confirm from '../../../../components/Confirmable/confirm'
import { getSafe } from '../../../../utils/functions'
// Styles
import { DefaultIcon, IconWrapper, StyledName } from '../../styles'

/**
 * Set initial filters
 * @category Marketplace - Bids sent
 * @method
 */
export const setInitFilters = (state, props) => {
  const { tableHandlersFiltersBidsSent, datagrid } = props

  if (tableHandlersFiltersBidsSent) {
    state.setFilterValues(tableHandlersFiltersBidsSent)
    datagrid.setSearch(tableHandlersFiltersBidsSent, true, 'pageFilters')

  } else {
    datagrid.setSearch(state.filterValues, true, 'pageFilters')
  }
}

/**
 * Handle filter change input search
 * @category Marketplace - Bids sent
 * @method
 */
export const handleFilterChangeInputSearch = (e, data, state, props) => {
  const filter = {
    ...state.filterValues,
    [data.name]: data.value
  }
  state.setFilterValues(filter)
  handleFiltersValue(filter, state, props)
}

const handleFiltersValue = debounce((filter, state, props) => {
  const { datagrid } = props
  datagrid.setSearch(filter, true, 'pageFilters')
}, 300)


const handleRowClick = (row, state)=> {
  const { expandedRowIds } = state

  if (expandedRowIds.length) {
    if (expandedRowIds[0] === row.id) {
      state.setExpandedRowIds([])
    } else {
      state.setExpandedRowIds([row.id])
    }
  } else {
    state.setExpandedRowIds([row.id])
  }
}

export const handleUpdateFinished = (state, props) => {
  if (getSafe(() => Router.router.query.id, 0)) {
    Router.push(Router.router.pathname)
    setInitFilters(state, props)
  }
}

const getHistories = histories => {
  let newHistories = []

  histories.forEach((h, index) => {
    newHistories.push(h)
    if ((histories.length - 1) === index && h.respondedBy) {
      newHistories.push({ ...h, createdBy: h.respondedBy, createdAt: h.updatedAt })
    }
  })
  return (newHistories)
}

/**
 * Get rows of table
 * @category Marketplace - Bids sent
 * @method
 */
export const getRows = (state, props) => {
  const {
    rows,
    intl: { formatMessage }
  } = props
  const { expandedRowIds } = state

  return rows.map(r => {
    const histories = getHistories(r.histories)
    const lastHistory = histories[histories.length - 1]
    const greyed = expandedRowIds.length && expandedRowIds[0] !== r.id

    const Icon = lastHistory.createdBy.avatarUrl
      ? (<Image src={lastHistory.createdBy.avatarUrl} avatar size='small' />)
      : DefaultIcon

    return {
      ...r,
      histories,
      clsName:
        expandedRowIds[0] === r.id
          ? 'open zoomed' // row detail expanded
          : greyed
          ? 'bids-greyed'
          : '',
      name: (
        <ActionCell
          row={r}
          getActions={row => getActions(row, state, props)}
          leftContent={<IconWrapper>{Icon}</IconWrapper>}
          content={
            <StyledName>
              <div className='name'>{lastHistory.createdBy.name}</div>
              <div className='company'>{getSafe(() => lastHistory.createdBy.company.cfDisplayName, '')}</div>
            </StyledName>
          }
          onContentClick={e => {
            e.stopPropagation()
            e.preventDefault()
            handleRowClick(r, state)
          }}
        />
      ),
      description: (
        <div onClick={() => handleRowClick(r, state)} style={{ paddingTop: '5px', cursor: 'pointer' }}>
          <RowDescription
            history={lastHistory}
            productOffer={r.productOffer}
            index={histories.length - 1}
            lastHistory={true}
          />
        </div>
      ),
      createdAt: (
        <div
          style={{ paddingTop: '5px', color: '#848893', cursor: 'pointer' }}
          onClick={() => handleRowClick(r, state)}>
          {moment(lastHistory.createdAt).fromNow()}
        </div>
      )
    }
  })
}

const getActions = (row, state, props) => {
  const {
    intl: { formatMessage },
    deleteOffer,
    acceptOffer,
    rejectOffer,
    datagrid,
    isBroker
  } = props
  const { expandedRowIds } = state
  const rowActions = []
  const { cfHistoryLastStatus, cfHistoryLastType } = row

  if (row.brokered && isBroker) return []

  const buttonPurchase = {
    text: formatMessage({
      id: 'marketplace.purchase',
      defaultMessage: 'Purchase'
    }),
    callback: async () => checkBuyAttempt(row, state, props)
  }
  const buttonAccept = {
    text: formatMessage({
      id: 'marketplace.accept',
      defaultMessage: 'Accept'
    }),
    callback: async () => {
      try {
        const { value } = await acceptOffer(row.id)
        datagrid.updateRow(row.id, () => value)
        handleUpdateFinished(state, props)
      } catch (e) {
        console.error(e)
      }
    }
  }
  const buttonReject = {
    text: formatMessage({
      id: 'marketplace.reject',
      defaultMessage: 'Reject'
    }),
    callback: async () => {
      try {
        const { value } = await rejectOffer(row.id)
        datagrid.updateRow(row.id, () => value)
        handleUpdateFinished(state, props)
      } catch (e) {
        console.error(e)
      }
    }
  }
  const buttonCounter = {
    text: formatMessage({
      id: 'marketplace.counter',
      defaultMessage: 'Counter'
    }),
    callback: () => state.setExpandedRowIds([row.id])
  }
  const buttonDelete = {
    text: formatMessage({
      id: 'marketplace.delete',
      defaultMessage: 'Delete'
    }),
    callback: row => {
      confirm(
        formatMessage({
          id: 'marketplace.confirm.deleteBid.Header',
          defaultMessage: 'Delete Bid'
        }),
        formatMessage(
          {
            id: 'marketplace.confirm.deleteBid.Content',
            defaultMessage: 'Do you really want to remove Bid?'
          },
          { item: row.chemicalName }
        )
      ).then(async () => {
        try {
          await deleteOffer(row.id)
          if (expandedRowIds[0] === row.id) {
            state.setExpandedRowIds([])
          }
          datagrid.removeRow(row.id)
          handleUpdateFinished(state, props)
        } catch (e) {
          console.error(e)
        }
      })
    }
  }

  if (cfHistoryLastStatus === 'ACCEPTED') {
    rowActions.push(buttonPurchase)
  } else if (cfHistoryLastStatus === 'NEW' && cfHistoryLastType === 'NORMAL') {
    rowActions.push(buttonReject)
  } else if (cfHistoryLastStatus === 'NEW' && cfHistoryLastType === 'COUNTER') {
    rowActions.push(buttonAccept)
    rowActions.push(buttonReject)
    rowActions.push(buttonCounter)
  }
  rowActions.push(buttonDelete)
  return rowActions
}

const checkBuyAttempt = (row, state, props) => {
  let skipBuy = false
  const elements = getSafe(() => row.productOffer.companyProduct.companyGenericProduct.elements, [])

  const hasDeaI = elements.some(el => getSafe(() => el.casProduct.deaListI, false))
  const hasDeaII = elements.some(el => getSafe(() => el.casProduct.deaListII, false))
  const hasDhs = elements.some(el => getSafe(() => el.casProduct.cfChemicalOfInterest, false))

  if (hasDeaI) {
    state.setBuyAttemptHasDeaI(row)
    skipBuy = true
  }
  if (hasDeaII) {
    state.setBuyAttemptHasDeaII(row)
    skipBuy = true
  }
  if (hasDhs) {
    state.setBuyAttemptHasDhs(row)
    skipBuy = true
  }
  if (skipBuy) return
  handleAddToCart(row, props)
}

export const handleAddToCart = async (row, props) => {
  const { addOfferToCart } = props
  try {
    const { value } = await addOfferToCart(row.id)
    Router.push('/cart')
  } catch (e) {
    console.error(e)
  }
}