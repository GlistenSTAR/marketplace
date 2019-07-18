import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, Input, Checkbox as FormikCheckbox, Dropdown } from 'formik-semantic-ui'
import { Field as FormikField } from 'formik'
import { bool, string, object, func, array } from 'prop-types'
import { debounce } from 'lodash'

import { withToastManager } from 'react-toast-notifications'

import {
  Button, Accordion,
  Segment, FormGroup,
  Icon, FormField,
  Checkbox, Grid,
  GridRow, GridColumn,
  Dropdown as SemanticDropdown,
  Transition
} from 'semantic-ui-react'

import confirm from '~/src/components/Confirmable/confirm'

import { datagridValues, replaceAmbigiousCharacters, dateFormat, dateDropdownOptions } from '../constants/filter'
import { initialValues, validationSchema } from '../constants/validation'

import SavedFilters from './SavedFilters'
import Notifications from './Notifications'


import {
  FlexSidebar, FlexContent,
  FiltersContainer, AccordionTitle,
  AccordionItem, AccordionContent,
  WhiteSegment, GraySegment,
  Title, BottomMargedDropdown,
  LessPaddedRow
} from '../constants/layout'

class Filter extends Component {

  state = {
    savedFiltersActive: false,
    openedSaveFilter: false,
    inactiveAccordion: { },
    dateDropdown: {
      expiration: dateDropdownOptions[0].value,
      mfg: dateDropdownOptions[0].value
    },
    searchQuery: '',
    searchWarehouseQuery: '',
    isTyping: false
  }

  componentDidMount() {
    const {
      fetchProductConditions,
      fetchProductForms,
      fetchPackagingTypes,
      fetchWarehouseDistances,
      fetchProductGrade,
      fetchWarehouses,
      setParams
    } = this.props


    this.handleGetSavedFilters()
    setParams({ currencyCode: this.props.preferredCurrency.code })

    Promise.all([
      this.fetchIfNoData(fetchProductConditions, 'productConditions'),
      this.fetchIfNoData(fetchProductForms, 'productForms'),
      this.fetchIfNoData(fetchPackagingTypes, 'packagingTypes'),
      this.fetchIfNoData(fetchWarehouseDistances, 'warehouseDistances'),
      this.fetchIfNoData(fetchProductGrade, 'productGrade'),
      this.fetchIfNoData(fetchWarehouses, 'warehouses')
    ]).finally(() => this.setState({ loaded: true }))


  }

  generateRequestData = ({ notifications, checkboxes, name, ...rest }) => {
    let { notificationMail } = notifications
    let { notifyMail, notifyPhone, notifySystem } = checkboxes
    let { filters } = this.toSavedFilter(rest)

    return {
      filters,
      name,
      notificationEnabled: notifyMail || notifyPhone || notifySystem,
      notificationMail,
      notifyMail, notifyPhone, notifySystem
    }
  }


  toSavedFilter = (inputs) => {
    let datagridFilter = {
      filters: []
    }

    let keys = Object.keys(inputs)

    keys.forEach((key) => {
      if (inputs[key] && inputs[key] !== '' && Object.keys(inputs[key]).length > 0) {
        console.log({ key, datagridValues })
        if (datagridValues[key] && !!datagridValues[key].nested) {
          var ids = [], names = []

          // If nested (checkboxes) take their id's and push them to an array
          Object.keys(inputs[key]).forEach(k => {
            if (inputs[key][k]) {
              ids.push(inputs[key][k].id)
              names.push((inputs[key][k].name))
            }
          })

          if (ids.length > 0) datagridFilter.filters.push(datagridValues[key].toFilter(ids, names))
        }
        else {
          try {
            let filter = datagridValues[key].toFilter(inputs[key])
            if (!(filter.values instanceof Array)) filter.values = [filter.values]  // We need values to be an array

            datagridFilter.filters.push(filter)
          } catch (err) {
            console.error(err)
          }
        }
      }
    })

    return datagridFilter
  }

  toDatagridFilter = savedFilter => {
    let { filters, ...rest } = savedFilter

    return {
      filters: filters.map((filter) => ({ ...filter, values: filter.values.map((val) => val.value) })),
      ...rest
    }
  }


  handleSubmit = (params) => { // { setSubmitting }
    let { onApply } = this.props

    let filter = this.generateRequestData(params)


    this.props.applyFilter(filter)
    onApply(this.toDatagridFilter(filter))
  }

  handleFilterSave = (params) => {
    const { intl, toastManager } = this.props
    const { formatMessage } = intl
    let self = this

    async function callback(id) {
      let requestData = self.generateRequestData(params)

      if (id) await self.props.updateFilter(id, requestData)
      else await self.props.saveFilter(self.props.savedUrl, requestData)


      toastManager.add(<div>
        <strong><FormattedMessage id={`confirm.filter.${id ? 'updated' : 'saved'}`} values={{ name: params.name }} /></strong>
      </div>, { appearance: 'success', pauseOnHover: true })


      if (params.checkboxes.automaticallyApply) {
        let filter = self.toDatagridFilter(requestData)
        self.props.onApply(filter)
        self.props.applyFilter(requestData)
      }
    }

    let filter = this.props.savedFilters.find((filter) => filter.name === params.name)

    if (filter) {
      confirm(
        formatMessage({ id: 'confirm.filter.overwrite' }, { name: params.name }),
        formatMessage({ id: 'confirm.filter.overwriteContent' }))
        .then(() => {
          callback(filter.id)
        }).catch(() => { return })
    } else callback()
  }

  fetchIfNoData = (fn, propertyName) => {
    return new Promise((resolve) => {
      if (!this.props[propertyName] || this.props[propertyName].length === 0) return fn()
      else resolve()
    })
  }

  toggleFilter = savedFiltersActive => {
    if (this.state.savedFiltersActive !== savedFiltersActive)
      this.setState({ savedFiltersActive })
  }

  generateCheckboxes = (data, values, groupName = null) => {
    if (!data) return []
    let group = null

    if (groupName) group = `${groupName}.`

    let tmp = []
    var getCheckbox = (el, i) => {
      let name = replaceAmbigiousCharacters(el.name)
      let path = `${group}${name}`

      return (
        <FormField key={i}>
          <FormikField
            onChange={(e, data) => {
              let { setFieldValue } = data.form
              setFieldValue(path, data.checked ? { id: el.id, name: el.name } : false)
            }}
            component={Checkbox}
            checked={!!values[groupName] && values[groupName][name]}
            name={path} label={el.name} />
        </FormField>
      )
    }

    for (let i = 0; i < (data.length / 2 - data.length % 2); i++) {
      tmp.push(
        <FormGroup widths='equal'>
          {/* First/Last Item Increasing/Decreasing according to index */}
          {[data[i], data[data.length - (i + 1)]].map((el, j) => getCheckbox(el, i + j))}
        </FormGroup>
      )
    }

    // Add last item, which is at index = middle of an array
    if (data.length % 2 === 1) {
      tmp.push(<FormGroup widths='equal'>{getCheckbox(data[Math.round(data.length / 2) - 1])}</FormGroup>)
    }


    return tmp
  }

  handleSavedFilterApply = async (filter, { setFieldValue, resetForm }) => {
    resetForm({ ...initialValues })

    let formikValues = {

    }

    let datagridKeys = Object.keys(datagridValues)

    let { filters, name, ...rest } = filter

    for (let i = 0; i < filters.length; i++) {
      datagridKeys.forEach(key => {
        let datagrid = datagridValues[key]
        if (filters[i].path === datagrid.toFilter([]).path && filters[i].operator === datagrid.toFilter([]).operator) {
          formikValues[key] = datagrid.toFormik(filters[i], datagrid.nested && this.props[key])
        }
      })
    }

    let { notifyMail, notifyPhone, notifySystem, notificationMail } = rest

    formikValues = {
      name,
      checkboxes: {
        notifyMail,
        notifyPhone,
        notifySystem,
        notificationEnabled: notifyMail || notifyPhone || notifySystem
      },
      notifications: { notificationMail },
      ...formikValues
    }


    Object.keys(formikValues)
      .forEach(key => {
        setFieldValue(key, formikValues[key])
      })

    this.handleSubmit(formikValues)
  }
  

  handleGetSavedFilters = () => {
    let { packagingTypes, productConditions, productGrade, productForms } = this.props
    this.props.getSavedFilters(this.props.savedUrl, { packagingTypes, productConditions, productGrade, productForms }, this.props.apiUrl)
  }


  toggleAccordion = (name) => {
    let { inactiveAccordion } = this.state
    let inactive = inactiveAccordion[name]
    this.setState({ inactiveAccordion: { ...this.state.inactiveAccordion, [name]: !inactive } })
  }

  handleSearch = debounce(({ searchQuery, name }) => {
    if (searchQuery.length > 1) this.props.getAutocompleteData(this.props.searchUrl(searchQuery))
  }, 250)

  handleSearchWarehouse = debounce(({ searchWarehouseQuery, name }) => {
    //! ! if (searchWarehouseQuery.length > 1) this.props.getAutocompleteData(this.props.searchUrl(searchWarehouseQuery))
  }, 250)


  accordionTitle = (name, text) => (
    <AccordionTitle name={name} onClick={(e, { name }) => this.toggleAccordion(name)}>
      <Icon name={!this.state.inactiveAccordion[name] ? 'chevron down' : 'chevron right'} color={!this.state.inactiveAccordion[name] ? 'blue' : 'black'} />
      {text}
    </AccordionTitle>
  )

  toggleSaveFilter = (e, data) => {
    e.preventDefault()
    this.setState(prevState => ({ openedSaveFilter: !prevState.openedSaveFilter }))
  }

  dateField = (name, { values, setFieldValue, handleChange }) => {
    let inputName = `${name}${this.state.dateDropdown[name]}`

    return (
      <>
        <FormField>
          <Dropdown name={name} options={dateDropdownOptions} selection
            onChange={handleChange}
            inputProps={{
              value: this.state.dateDropdown[name],
              onChange: (_, data) => {
                Object.keys(values)
                  .forEach(key => {
                    if (typeof values[key] === 'string' && values[key].startsWith(name)) setFieldValue(key, '')
                  })

                setFieldValue(inputName, '')
                this.setState((state) => ({
                  ...state,
                  dateDropdown: {
                    ...state.dateDropdown,
                    [name]: data.value
                  }
                }))
              }
            }} />
        </FormField>

        <FormField>
          <Input
            name={inputName}
            onChange={handleChange}
            inputProps={{
              //label: 'Days1',
              //labelPosition: 'right',
              type: 'number',
              min: '1'
            }}
          />
        </FormField>
      </>
    )
  }

  formSaveFilter = ({ values, setFieldError }) => {
    let { intl, isFilterSaving } = this.props

    const { formatMessage } = intl

    return (
      <>
        <Grid verticalAlign='top'>
          {/* Save Filter */}
          <GridRow>
            <GridColumn>
              <Title><FormattedMessage id='filter.saveFilter' defaultMessage='Save Filter' /></Title>
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn computer={12}>
              <Input inputProps={{ placeholder: formatMessage({ id: 'filter.enterFilterName', defaultMessage: 'Enter Filter Name' }) }} name='name' fluid />
            </GridColumn>

            <GridColumn computer={4}>
              <Button onClick={(e) => {
                e.preventDefault()
                if (!values.name) setFieldError('name', <FormattedMessage id='validation.required' />)
                else this.handleFilterSave(values)
              }} positive basic loading={isFilterSaving} style={{marginRight: '0'}}>Save</Button>
            </GridColumn>
          </GridRow>

          <LessPaddedRow>
            <GridColumn computer={13}>
              <label>{formatMessage({ id: 'filter.automaticallyApply', defaultMessage: 'Automatically apply' })}</label>
            </GridColumn>
            <GridColumn computer={3}>
              <FormikCheckbox
                inputProps={{ toggle: true, style: { marginBottom: '-4px' } }}
                name='checkboxes.automaticallyApply'
              />
            </GridColumn>
          </LessPaddedRow>
        </Grid>
        <Notifications values={values} />
      </>
    )
  }

  formMarkup = ({ values, setFieldValue, handleChange, errors, setFieldError }) => {
    let {
      productConditions, productForms, packagingTypes,
      productGrade, intl, isFilterSaving,
      autocompleteData, autocompleteDataLoading,
      autocompleteWarehouse, autocompleteWarehouseLoading
    } = this.props

    const { formatMessage } = intl

    let packagingTypesRows = this.generateCheckboxes(packagingTypes, values, 'packagingTypes')
    let productConditionRows = this.generateCheckboxes(productConditions, values, 'productConditions')
    let productGradeRows = this.generateCheckboxes(productGrade, values, 'productGrade')
    let productFormsRows = this.generateCheckboxes(productForms, values, 'productForms')

    var noResultsMessage = null

    if (this.state.searchQuery.length <= 1) noResultsMessage = <FormattedMessage id='filter.startTypingToSearch' defaultMessage='Start typing to search...' />
    if (autocompleteDataLoading) noResultsMessage = <FormattedMessage id='global.loading' defaultMessage='Loading' />

    let dropdownProps = {
      search: true,
      selection: true,
      multiple: true,
      fluid: true,
      options: autocompleteData.map((product) => {
        if (product.casNumberCombined) var text = `${product.productName} (${product.casNumberCombined})`
        else var text = product.productName

        return {
          key: product.id,
          text,
          value: JSON.stringify({ id: product.id, name: product.productName, casNumberCombined: product.casNumberCombined || null }),
        }
      }),
      loading: autocompleteDataLoading,
      name: 'search',
      placeholder: <FormattedMessage id='filter.searchProducts' defaultMessage='Search Products' />,
      noResultsMessage,
      onSearchChange: (_, data) => {
        this.handleSearch(data)
      },
      value: values.search,
      onChange: (e, data) => setFieldValue(data.name, data.value.length !== 0 ? data.value : null),
    }

    var noWarehouseResultsMessage = null

    if (this.state.searchWarehouseQuery.length <= 1) noWarehouseResultsMessage = <FormattedMessage id='filter.startTypingToSearch' defaultMessage='Start typing to search...' />
    if (autocompleteWarehouseLoading) noWarehouseResultsMessage = <FormattedMessage id='global.loading' defaultMessage='Loading' />

    let dropdownWarehouseProps = {
      search: true,
      selection: true,
      multiple: false,
      fluid: true,
      options: this.props.warehouses.map((warehouse) => {
        return {
          key: warehouse.id,
          text: warehouse.name,
          value: JSON.stringify({ id: warehouse.id, name: warehouse.name}), // ! ! potrebuju name? Nestaci jen id?
        }
      }),
      loading: autocompleteWarehouseLoading,
      name: 'warehouse',
      placeholder: <FormattedMessage id='filter.searchWarehouse' defaultMessage='Search Warehouse' />,
      noWarehouseResultsMessage,
      onSearchChange: (_, data) => {
        this.handleSearchWarehouse(data)
      },
      value: values.warehouse,
      onChange: (e, data) => setFieldValue(data.name, data.value.length !== 0 ? data.value : null),
    }





    if (!autocompleteDataLoading) dropdownProps.icon = null
    if (!autocompleteWarehouseLoading) dropdownWarehouseProps.icon = null

    let currencySymbol = this.props.preferredCurrency ? this.props.preferredCurrency.symbol : null

    return (
      <Accordion>
        <Segment basic>
          <AccordionItem>
            {this.accordionTitle('chemicalType', <FormattedMessage id='filter.chemicalType' />)}
            <AccordionContent active={!this.state.inactiveAccordion.chemicalType}>
              <BottomMargedDropdown {...dropdownProps} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('quantity', <FormattedMessage id='filter.quantity' />)}
            <AccordionContent active={!this.state.inactiveAccordion.quantity}>
              <FormGroup widths='equal'>
                <Input inputProps={{
                  type: 'number',
                  placeholder: formatMessage({ id: 'global.enterValue', defaultMessage: 'Enter Value' })
                }}
                  label={<FormattedMessage id='filter.FromQuantity' defaultMessage='From' />}
                  name='quantityFrom' />
                <Input inputProps={{
                  type: 'number',
                  placeholder: formatMessage({ id: 'global.enterValue', defaultMessage: 'Enter Value' })
                }}
                  label={<FormattedMessage id='filter.ToQuantity' defaultMessage='To' />}
                  name='quantityTo' />
              </FormGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('price', <FormattedMessage id='filter.price' />)}
            <AccordionContent active={!this.state.inactiveAccordion.price}>
              <FormGroup>
                <FormField width={8}>

                  <Input inputProps={{
                    label: currencySymbol,
                    labelPosition: 'left',
                    type: 'number',
                    step: 0.01,
                    placeholder: formatMessage({ id: 'global.enterValue', defaultMessage: 'Enter Value' })
                  }}
                    label={<FormattedMessage id='filter.FromPrice' defaultMessage='From Price' />}
                    name='priceFrom' />
                </FormField>

                <FormField width={8}>
                  <Input inputProps={{
                    label: currencySymbol,
                    labelPosition: 'left',
                    type: 'number',
                    step: 0.01,
                    placeholder: formatMessage({ id: 'global.enterValue', defaultMessage: 'Enter Value' })
                  }}
                    label={<FormattedMessage id='filter.ToPrice' defaultMessage='To Price' />}
                    name='priceTo' />
                </FormField>
              </FormGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('packaging', <FormattedMessage id='filter.packaging' />)}
            <AccordionContent active={!this.state.inactiveAccordion.packaging}>
              {packagingTypesRows}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('productGrades', <FormattedMessage id='filter.grade' defaultMessage='Grade' />)}
            <AccordionContent active={!this.state.inactiveAccordion.productGrades}>
              {productGradeRows}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('condition', <FormattedMessage id='filter.condition' defaultMessage='Condition' />)}
            <AccordionContent active={!this.state.inactiveAccordion.condition}>
              {productConditionRows}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('productForms', <FormattedMessage id='filter.form' defaultMessage='Form' />)}
            <AccordionContent active={!this.state.inactiveAccordion.productForms}>
              {productFormsRows}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('expiration', <FormattedMessage id='filter.expiration' defaultMessage='Days Until Expiration' />)}
            <AccordionContent active={!this.state.inactiveAccordion.expiration}>
              <FormGroup widths='equal'>
                {this.dateField('expiration', { values, setFieldValue, handleChange })}

              </FormGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('assay', <FormattedMessage id='filter.assay' />)}
            <AccordionContent active={!this.state.inactiveAccordion.assay}>
              <FormGroup widths='equal'>
                <Input
                  inputProps={{ type: 'number', placeholder: formatMessage({ id: 'global.enterValue', defaultMessage: 'Enter Value' }) }}
                  label={<FormattedMessage id='filter.Minimum(%)' defaultMessage='Minimum' />} name='assayFrom' />
                <Input
                  inputProps={{ type: 'number', placeholder: formatMessage({ id: 'global.enterValue', defaultMessage: 'Enter Value' }) }}
                  label={<FormattedMessage id='filter.Maximum(%)' defaultMessage='Maximum' />} name='assayTo' />
              </FormGroup>
            </AccordionContent>
          </AccordionItem>


          <AccordionItem>
            {this.accordionTitle('mfg', <FormattedMessage id='filter.mfg' defaultMessage='Days Since Manufacture Date' />)}
            <AccordionContent active={!this.state.inactiveAccordion.mfg}>
              <FormGroup widths='equal'>
                {this.dateField('mfg', { values, setFieldValue, handleChange })}
              </FormGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem>
            {this.accordionTitle('warehouse', <FormattedMessage id='filter.warehouse' />)}
            <AccordionContent active={!this.state.inactiveAccordion.warehouse}>
              <BottomMargedDropdown {...dropdownWarehouseProps} />
            </AccordionContent>

          </AccordionItem>

        </Segment>
      </Accordion >
    )
  }

  render() {
    let {
      isOpen,
      width,
      direction,
      animation,
      additionalSidebarProps,
      isFilterApplying
    } = this.props

    const {
      toggleFilter
    } = this.props

    return (

      <Form
        enableReinitialize={true}
        initialValues={initialValues}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          this.handleSubmit(values)
          setSubmitting(false)
        }}>
        {(props) => {
          this.submitForm = props.submitForm
          this.resetForm = props.resetForm
          this.setFieldValue = props.setFieldValue

          return (
            <FlexSidebar
              visible={isOpen}
              width={width}
              direction={direction}
              animation={animation}
              onHide={(e) => {
                // Workaround, close if you haven't clicked on calendar item or filter icon
                try {
                  if (e && (!(e.path[0] instanceof HTMLTableCellElement) && !(e.path[1] instanceof HTMLTableCellElement) && (!e.target.parent || !e.target.parent.className.includes('submenu-filter')))) {
                    toggleFilter(false)
                  }
                } catch (e) {
                  console.error(e)
                }
              }}
              {...additionalSidebarProps}>
              <FiltersContainer>
                <Button onClick={() => this.toggleFilter(false)} primary={!this.state.savedFiltersActive}>
                  <FormattedMessage
                    id='filter.setFilters'
                    defaultMessage='SET FILTERS'
                  />
                </Button>

                <Button onClick={() => this.toggleFilter(true)} primary={this.state.savedFiltersActive}>
                  <FormattedMessage
                    id='filter.savedFilter'
                    defaultMessage='SAVED FILTERS'
                  />
                </Button>
              </FiltersContainer>
              <FlexContent>
              <Segment basic>
                {!this.state.savedFiltersActive
                  ? this.formMarkup(props)
                  : (
                    <SavedFilters
                      params={this.props.params}
                      onApply={(filter) => this.handleSavedFilterApply(filter, props)}
                      savedFilters={this.props.savedFilters}
                      savedFiltersLoading={this.props.savedFiltersLoading}
                      getSavedFilters={this.handleGetSavedFilters}
                      deleteFilter={this.props.deleteFilter}
                      updateFilterNotifications={this.props.updateFilterNotifications}
                      savedFilterUpdating={this.props.savedFilterUpdating} />
                  )}
                </Segment>
              </FlexContent>
              <GraySegment basic style={{ position: 'relative', overflow: 'visible', height: '4.57142858em', margin: '0' }}>
                <Transition visible={this.state.openedSaveFilter} animation='fade down' duration={500}>
                  <WhiteSegment basic>
                    {this.formSaveFilter(props)}
                  </WhiteSegment>
                </Transition>
                <Grid>
                  <GridRow>
                    <GridColumn computer={6} textAlign='left'>
                      <Button
                        size='large'
                        onClick={this.toggleSaveFilter}
                        inputProps={{type: 'button'}}>
                        <FormattedMessage id='filter.saveFilter' defaultMessage='Save Filter' />
                      </Button>
                    </GridColumn>
                    <GridColumn computer={10} textAlign='right'>
                      <Button
                        type='button'
                        size='large'
                        onClick={(e, data) => {
                          this.resetForm({ ...initialValues })
                          toggleFilter(false)
                          this.props.onClear(e, data)
                        }}
                        inputProps={{type: 'button'}}>
                        <FormattedMessage id='filter.clearFilter' defaultMessage='Clear Filter' />
                      </Button>

                      <Button
                        size='large'
                        loading={isFilterApplying}
                        primary
                        onClick={() => this.submitForm()}
                        inputProps={{type: 'button'}}>
                        <FormattedMessage id='global.apply' defaultMessage='Apply' />
                      </Button>
                    </GridColumn>

                  </GridRow>
                </Grid>
              </GraySegment>
            </FlexSidebar>
          )
        }}
      </Form>
    )
  }
}

Filter.propTypes = {
  isOpen: bool,
  width: string,
  direction: string,
  animation: string,
  additionalSidebarProps: object,
  onApply: func,
  onClear: func,
  filters: array,
  getAutocompleteData: func,
  autocompleteData: array,
  getAutocompleteWarehouse: func,
  autocompleteWarehouse: array,
  savedFilters: array,
  getSavedFilters: func,
  savedFiltersLoading: bool,
  savedUrl: string,
  searchUrl: func
}

Filter.defaultProps = {
  isOpen: false,
  width: 'very wide',
  direction: 'right',
  animation: 'overlay',
  additionalSidebarProps: {},
  filters: [],
  autocompleteData: [],
  autocompleteWarehouse: [],
  savedFilters: [],
  savedFiltersLoading: false

}

export default withToastManager(injectIntl(Filter))