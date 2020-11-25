import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import { withToastManager } from 'react-toast-notifications'
import moment from 'moment'
import { generateToastMarkup, getSafe } from '~/utils/functions'
import ProdexTable from '~/components/table'
import * as Actions from '../actions'
import { withDatagrid } from '~/modules/datagrid'
import styled from 'styled-components'
import { Label, Popup } from 'semantic-ui-react'
import ReactHtmlParser from 'react-html-parser'
import { FormattedDateTime } from '~/components/formatted-messages/'
import { ChevronLeft, ChevronDown } from 'react-feather'

import GenericProductRequest from './message-details/GenericProductRequest'
import ShippingQuoteRequest from './message-details/ShippingQuoteRequest'

const StyledStatusLabel = styled(Label)`
  font-size: 12px !important;
  height: 22px !important;
  font-weight: normal !important;
  font-stretch: normal;
  font-style: normal;
  border-radius: 11px !important;
  padding: 0.3333em 1.16667em 0.16667em 1.16667em !important;
  cursor: pointer;

  &.read {
    color: #848893;
    border: solid 1px #dee2e6;
    background-color: #edeef2;
  }

  &.unread {
    color: #ffffff;
    background-color: #2599d5 !important;
  }
`

const StyledNotification = styled.div`
  cursor: pointer;

  &:hover {
    font-weight: bold;
    color: #2599d5;
  }
`

class Table extends Component {
  state = {
    columns: [
      {
        name: 'notification',
        title: (
          <FormattedMessage id='alerts.column.notification' defaultMessage='Notification'>
            {text => text}
          </FormattedMessage>
        ),
        sortPath: 'Message.text',
        width: 720,
        maxWidth: 2000
      },
      {
        name: 'notificationType',
        title: (
          <FormattedMessage id='alerts.column.notificationType' defaultMessage='Notification Type'>
            {text => text}
          </FormattedMessage>
        ),
        //sortPath: '',
        width: 200
      },
      {
        name: 'nameOfUser',
        title: (
          <FormattedMessage id='alerts.column.nameOfUser' defaultMessage='Name Of User'>
            {text => text}
          </FormattedMessage>
        ),
        //sortPath: '',
        width: 200
      },
      {
        name: 'usersCompany',
        title: (
          <FormattedMessage id='alerts.column.usersCompany' defaultMessage="User's Company">
            {text => text}
          </FormattedMessage>
        ),
        //sortPath: '',
        width: 200
      },
      {
        name: 'time',
        title: (
          <FormattedMessage id='alerts.column.time' defaultMessage='Time'>
            {text => text}
          </FormattedMessage>
        ),
        sortPath: 'Message.createdAt',
        width: 160
      }
    ],
    expandedRowIds: []
  }

  statusLabel = (row, val) => {
    const read = val === 'read'
    return (
      <StyledStatusLabel
        className={val}
        onClick={() => {
          if (read) this.handleClickOnRead(row)
          else this.handleClickOnUnread(row)
        }}>
        {read ? (
          <FormattedMessage id='alerts.status.read' defaultMessage='Read' />
        ) : (
          <FormattedMessage id='alerts.status.unread' defaultMessage='Unread' />
        )}
      </StyledStatusLabel>
    )
  }

  notificationText = row => {
    return (
      <StyledNotification
        onClick={() => {
          if (row.read) this.handleClickOnRead(row)
          else this.handleClickOnUnread(row)
        }}>
        {ReactHtmlParser(row.text)}
      </StyledNotification>
    )
  }

  toggleDetail = (rowId) => {
    let { expandedRowIds } = this.state
    if (expandedRowIds.length) {
      let found = false
      let rows = expandedRowIds.reduce((result, id) => {
        if (id === rowId) {
          found = true
          return result
        } else {
          result.push(id)
          return result
        }
      }, [])
      if (!found) {
        rows.push(rowId)
      }
      this.setState({expandedRowIds: rows})
    } else {
      this.setState({expandedRowIds: [rowId]})
    }
  }

  getRows = () => {
    return this.props.rows.map(r => {
      const read = r.read ? 'read' : 'unread'
      const selected = this.props.selectedRows.some(id => id === r.id)
      const open = this.state.expandedRowIds.some(id => id === r.id)
      return {
        ...r,
        clsName: read + (selected ? ' selected' : '') + (open ? ' open' : ''),
        notification: this.notificationText(r.rawData),

        time: (
          <>
            {r.createdAt
              ? (
                <Popup
                  size='small'
                  inverted
                  style={{
                    fontSize: '12px',
                    color: '#cecfd4',
                    opacity: '0.9'
                  }}
                  header={
                    <div style={{ color: '#cecfd4', fontSize: '12px' }}>
                      {moment(r.createdAt).toDate().toLocaleString()}
                    </div>
                  }
                  trigger={
                    <div style={{ color: r.read ? '#848893' : '#20273a' }}>
                      {moment(r.createdAt).fromNow()}
                    </div>
                  }
                />
              ) : 'N/A'}
            {open
              ? <ChevronLeft onClick={() => this.toggleDetail(r.id)} />
              : <ChevronDown onClick={() => this.toggleDetail(r.id)} />
            }
          </>
        )
      }
    })
  }

  getRowDetail = ({ row }) => {

    // ! ! Debug data ! !
    const messageType = row.id % 2 ? 'Shipping_Quote_Request' : 'Company_Generic_Product_Requests' // Debug Test
    const messageDetailTable = {
      'Company_Generic_Product_Requests': <GenericProductRequest row={
        {
          "id": 2254,
          "createdAt": "2020-11-24T04:49:45.455911-06:00",
          "updatedAt": "2020-11-24T04:49:45.455911-06:00",
          "sender": {
            "id": 2,
            "email": "system",
            "name": "SYSTEM"
          },
          "recipient": {
            "id": 118,
            "email": "khameron.bogdan@owee.org",
            "name": "Echo OperatorName"
          },
          "text": "Tomas Tester from Norman Fox has requested to upload a new Company Generic Product.",
          "category": "Company_Generic_Product_Requests",
          "info": {
            "requestedBy": {
              "id": 114,
              "email": "tomas.drlicek@artio.cz",
              "name": "Tomas Tester",
              "company": {
                "id": 275,
                "name": "Norman Fox",
                "cfDisplayName": "Norman Fox",
                "phone": "+13243344344",
                "website": "http://www.univar.com/",
                "sellEligible": true,
                "buyEligible": true,
                "enabled": true,
                "tin": "123456781",
                "dunsNumber": "455454553",
                "preferredBankAccountId": "5bbfae11-8204-4aaf-ab17-3b437fcc260f",
                "logisticsAccount": true,
                "reviewRequested": false,
                "businessType": {
                  "id": 1,
                  "name": "Corporation",
                  "abbreviation": "Co.",
                  "dwollaName": "corporation"
                },
                "hasLogo": true,
                "purchaseHazmatEligible": true,
                "associations": [],
                "paymentProcessor": "DWOLLA",
                "isClientCompany": false
              }
            },
            "attachments": [{
              "id": 293,
              "createdAt": "2020-11-24T04:49:40.110221-06:00",
              "name": "back.png",
              "documentType": {
                "id": 3,
                "name": "Safety Data Sheet",
                "editable": false
              },
              "sharedTo": "NOT_SHARED",
              "othersPermissions": "VIEW"
            },
              {
                "id": 294,
                "createdAt": "2020-02-24T04:49:40.110221-06:00",
                "name": "back2.png",
                "documentType": {
                  "id": 3,
                  "name": "Safety Data Sheet",
                  "editable": false
                },
                "sharedTo": "NOT_SHARED",
                "othersPermissions": "VIEW"
              }

            ],
            "infoType": "MessageCompanyGenericProductRequestInfoResponse"
          },
          "read": false
        }
      } />,
      'Shipping_Quote_Request': <ShippingQuoteRequest row={
        {
          "id": 2252,
          "createdAt": "2020-11-24T04:44:11.20383-06:00",
          "updatedAt": "2020-11-24T04:44:11.20383-06:00",
          "sender": {
            "id": 2,
            "email": "system",
            "name": "SYSTEM"
          },
          "recipient": {
            "id": 118,
            "email": "khameron.bogdan@owee.org",
            "name": "Echo OperatorName"
          },
          "text": "Tomas Tester from Norman Fox has requested a quote for the following order.",
          "category": "Shipping_Quote_Request",
          "info": {
            "buyerCompanyName": "Norman Fox",
            "destinationCountry": "USA",
            "destinationCity": "Beverly Hills",
            "destinationStreet": "1006 N Beverly Dr",
            "destinationZip": "90210",
            "sellerCompanyName": "Thomas2",
            "originCountry": "USA",
            "originCity": "Mistletoe",
            "originStreet": "2291 Oral Lake Road",
            "originZip": "41351",
            "items": [{
              "product": "Glycerine 99.7%",
              "grossWeightLbs": 105.822,
              "nmfc": "48580-null",
              "freightClass": "55",
              "maxPkgsPerPallet": 1,
              "hazardous": true,
              "stackable": true,
              "freezeProtect": true
            }],
            "infoType": "MessageShippingQuoteRequestInfoResponse"
          },
          "read": false
        }
      } />,
    }
    // ! ! End of debug data ! !



    /*
    // ! ! Normal data
    const messageType = row.category
    const messageDetailTable = {
      'Company_Generic_Product_Requests': <GenericProductRequest row={row.rawData} />,
      'Shipping_Quote_Request': <ShippingQuoteRequest row={row.rawData} />,
    }
    */

    return (
      <>
        {messageDetailTable[messageType]
          ? messageDetailTable[messageType]
          : ReactHtmlParser(row.text)
        }
      </>
    )
  }

  handleClickOnUnread = async row => {
    const { datagrid, getCategories, markSeen, getCountUnseen } = this.props
    try {
      await markSeen(row.id)
      datagrid.updateRow(row.id, () => ({
        ...row,
        read: true,
        readAt: moment().format()
      }))
      getCountUnseen()
      getCategories()
    } catch (e) {
      console.log(e)
    }
  }

  handleClickOnRead = async row => {
    const { datagrid, getCategories, markUnseen, getCountUnseen } = this.props
    try {
      await markUnseen(row.id)
      datagrid.updateRow(row.id, () => ({
        ...row,
        read: false,
        readAt: null
      }))
      getCountUnseen()
      getCategories()
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { intl, datagrid, markSeenSending, menuStatusFilter, selectedRows } = this.props
    const { formatMessage } = intl
    const { columns, expandedRowIds } = this.state

    return (
      <React.Fragment>
        <div className='flex stretched notifications-wrapper'>
          <ProdexTable
            tableName={`operations_tag_${menuStatusFilter}`}
            {...datagrid.tableProps}
            loading={datagrid.loading || markSeenSending}
            columns={columns}
            rowDetailType={true}
            rows={this.getRows()}
            rowDetail={this.getRowDetail}
            expandedRowIds={expandedRowIds}
            onExpandedRowIdsChange={expandedRowIds => this.setState({ expandedRowIds })}
            rowSelection={true}
            lockSelection={false}
            showSelectAll={false}
            selectedRows={selectedRows}
            showSelectionColumn
            onSelectionChange={selectedRows => {
              this.props.onSelectionChange(selectedRows)
            }}
            estimatedRowHeight={1000} // to fix virtual table for large rows - hiding them too soon and then hiding the whole table
          />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, { datagrid }) => {
  const { alerts } = state
  return {
    ...alerts,
    rows: datagrid.rows.map(r => {
      return {
        ...r,
        rawData: r,
        notificationType: r.category.replace(/_/g, ' '),
        nameOfUser: getSafe(() => r.info.requestedBy.name, ''),
        usersCompany: getSafe(() => r.info.requestedBy.company.cfDisplayName, '')
      }
    })
  }
}

export default withDatagrid(connect(mapStateToProps, { ...Actions })(injectIntl(withToastManager(Table))))
