import React, { Component } from 'react'
import { connect } from 'react-redux'
import { config } from '../config'
import { debounce } from 'lodash'

import { Header, Menu, Button, Input, Dropdown, Grid } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'

import { openPopup, handleFiltersValue } from '../actions'
import { openImportPopup } from '~/modules/settings/actions'
import { Datagrid } from '~/modules/datagrid'
import styled from 'styled-components'

const PositionHeaderSettings = styled.div`
  position: relative;
  z-index: 602;
`

const CustomMenuItemLeft = styled(Menu.Item)`
  margin-left: 0px !important;
  padding-left: 0px !important;
`

const CustomMenuItemRight = styled(Menu.Item)`
  margin-right: 0px !important;
  padding-right: 0px !important;
`

const CustomGrid = styled(Grid)`
  margin-top: 10px !important;
`

class TablesHandlers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterFieldCurrentValue: 'None',
      filterValue: ''
    }

    this.handleChange = debounce(this.handleChange, 300)
  }

  componentDidUpdate(prevProps) {
    let { filterValueKey } = this.state

    if (prevProps.filterValue && this.props.filterValue === '') {
      this.setState({
        filterValueKey: ++filterValueKey
      })
    }
    if (prevProps.currentTab.id !== this.props.currentTab.id) {
      this.setState({ filterValue: '' })
      this.props.handleFiltersValue(this.props, '')
    }
  }

  handleChangeSelectField = (event, value) => {
    this.setState({
      filterFieldCurrentValue: value
    })
  }

  handleChangeFieldsCurrentValue = fieldStateName => event => {
    this.setState({
      [fieldStateName]: event.target.value
    })
  }

  handleChange = value => {
    Datagrid.setSearch(value)
    // if (Datagrid.isReady()) Datagrid.setSearch(value)
    // else this.props.handleFiltersValue(this.props, value)
  }

  render() {
    const { currentTab, openPopup, openImportPopup, intl } = this.props

    const { formatMessage } = intl

    // if (currentTab === 'Manufactures' || currentTab === 'CAS Products' || currentTab === 'Companies') var onChange = this.debouncedOnChange
    // else var onChange = this.handleChange

    return (
      <PositionHeaderSettings>
        <CustomGrid as={Menu} secondary verticalAlign='middle' className='page-part'>
          <CustomMenuItemLeft position='left' data-test='admin_table_search_inp'>
            <Input
              style={{ width: 340 }}
              icon='search'
              placeholder={formatMessage({ id: config[currentTab.name].searchText })}
              onChange={(e, { value }) => {
                this.setState({ filterValue: value })
                this.handleChange(value)
              }}
              value={this.state.filterValue}
            />
          </CustomMenuItemLeft>
          <CustomMenuItemRight position='right'>
            <Button size='large' data-test='admin_table_add_btn' primary onClick={() => openPopup()}>
              <FormattedMessage id='global.add' defaultMessage='Add'>
                {text => `${text} `}
              </FormattedMessage>
              {config[currentTab.name].addEditText}
            </Button>
          </CustomMenuItemRight>
          {currentTab.name === 'Product Catalog' ? (
            <CustomMenuItemRight>
              <Button size='large' primary onClick={() => openImportPopup()} data-test='admin_import_btn'>
                {formatMessage({ id: 'myInventory.import', defaultMessage: 'Import' })}
              </Button>
            </CustomMenuItemRight>
          ) : null}
        </CustomGrid>
      </PositionHeaderSettings>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentTab: state.admin.currentTab,
    casListDataRequest: state.admin.casListDataRequest,
    companyListDataRequest: state.admin.companyListDataRequest
  }
}

const mapDispatchToProps = {
  openPopup,
  openImportPopup,
  handleFiltersValue
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TablesHandlers))
