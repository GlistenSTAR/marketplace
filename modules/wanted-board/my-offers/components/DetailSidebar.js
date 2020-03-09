import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button, Input, TextArea, Dropdown, Checkbox as FormikCheckbox } from 'formik-semantic-ui-fixed-validation'
import { Form } from 'semantic-ui-react'
import { Formik } from 'formik'
import { DateInput } from '~/components/custom-formik'
import { getSafe, generateToastMarkup, uniqueArrayByKey, removeEmpty } from '~/utils/functions'
import { debounce } from 'lodash'
import styled from 'styled-components'
import confirm from '~/src/components/Confirmable/confirm'
import { getLocaleDateFormat, getStringISODate } from '~/components/date-format'
import { withToastManager } from 'react-toast-notifications'
import ProdexGrid from '~/components/table'
import * as val from 'yup'
import { errorMessages } from '~/constants/yupValidation'
import moment from 'moment'
import { withDatagrid } from '~/modules/datagrid'
import _ from 'lodash'
import { inputWrapper, quantityWrapper } from '../../components'

import {
  Dimmer,
  Loader,
  Grid,
  GridRow,
  GridColumn,
} from 'semantic-ui-react'

import {
  //sidebarDetailTrigger,
  getAutocompleteData,
  getPackagingTypes,
  getWarehouses,
  getCountries,
  getProductGrades,
  getUnits,
  getProductForms,
  getProductConditions,
  searchManufacturers,
  closeDetailSidebar,
} from '../../actions'



import {
  FlexSidebar,
  FlexContent,
  HighSegment,
  BottomButtons,
} from '../../constants/layout'

import { listFrequency } from '../../constants/constants'

const CustomHr = styled.hr`
  border: solid 0.5px #dee2e6;
  margin: 0.285714286em 0 0 0;
`

const initValues = {
  product: null,
  fobPrice: '',
  manufacturers: null,
  conditionConforming: null,
  packagingTypes: null,
  measurement: 7      // pounds [lb]
}

const validationScheme = val.object().shape({
  product: val
    .number()
    .typeError(errorMessages.requiredMessage)
    .required(errorMessages.requiredMessage),
  fobPrice: val
    .number()
    .min(0, errorMessages.minimum(0))
    .typeError(errorMessages.mustBeNumber)
    .test('maxdec', errorMessages.maxDecimals(3), val => {
      return !val || val.toString().indexOf('.') === -1 || val.toString().split('.')[1].length <= 3
    })
    .required(errorMessages.requiredMessage),
  }
)

const listConforming = [
  {
    key: 1,
    text: <FormattedMessage id='global.conforming' defaultMessage='Conforming' />,
    value: true
  },
  {
    key: 0,
    text: <FormattedMessage id='global.nonConforming' defaultMessage='Non Conforming' />,
    value: false
  }
]

class DetailSidebar extends Component {
  state = {
    initValues: initValues,
    sidebarValues: null,

  }

  componentDidMount = async () => {
    this.fetchIfNoData('listPackagingTypes', this.props.getPackagingTypes)
    this.fetchIfNoData('listUnits', this.props.getUnits)
    this.props.searchManufacturers('', 200)
  }

  fetchIfNoData = (name, fn) => {
    if (this.props[name].length === 0) fn()
  }

  searchProducts = debounce(text => {
    this.props.getAutocompleteData({
      searchUrl: `/prodex/api/company-products/own/search?pattern=${text}&onlyMapped=false`
    })
  }, 250)

  searchManufacturers = debounce(text => {
    this.props.searchManufacturers(text, 5)
  }, 250)

  submitForm = async (values, setSubmitting, setTouched) => {
    const { addPurchaseRequest, editPurchaseRequest, datagrid } = this.props
    const { sidebarValues } = this.state

    let body = {
      ...values,

    }
    removeEmpty(body)
    console.log('!!!!!!!!!! submitForm body', body)

    try {
      if (sidebarValues) {
        //const response = await editMyPurchaseOffer(sidebarValues.id, body)
        //console.log('!!!!!!!!!! edit response', response)

      } else {
        //const response = await addMyPurchaseOffer(body)
        //console.log('!!!!!!!!!! add response', response)

      }
    } catch (e) {}

    //! ! setSubmitting(false)
  }

  render() {
    let {
      listPackagingTypes,
      listPackagingTypesLoading,
      listUnits,
      listUnitsLoading,
      loading,
      sidebarValues,
      searchedManufacturers,
      searchedManufacturersLoading,
      intl: { formatMessage },
      toastManager,
      currencySymbol
    } = this.props

    return (
      <Formik
        enableReinitialize
        initialValues={this.state.initValues}
        validationSchema={validationScheme}
        onSubmit={async (values, { setSubmitting, setTouched }) => {
          this.submitForm(values, setSubmitting, setTouched)
        }}>
        {formikProps => {
          let {
            values,
            touched,
            setTouched,
            setFieldTouched,
            setFieldValue,
            validateForm,
            submitForm,
            setSubmitting,
            resetForm
          } = formikProps
          this.values = values
          this.resetForm = resetForm
          this.formikProps = formikProps
          return (
            <Form>
              <FlexSidebar
                visible={true}
                width='very wide'
                style={{ width: '430px' }}
                direction='right'
                animation='overlay'>
                <Dimmer inverted active={loading}>
                  <Loader />
                </Dimmer>
                <HighSegment basic>
                  <FormattedMessage id='wantedBoard.specificProducts' defaultMessage='SPECIFIC PRODUCT(S)' />
                </HighSegment>
                <FlexContent>
                  <Grid>

                    <GridRow>
                      <GridColumn>
                        <Dropdown
                          label={
                            <FormattedMessage
                              id='wantedBoard.productName'
                              defaultMessage='Product Name'>
                              {text => text}
                            </FormattedMessage>
                          }
                          name='product'
                          options={this.props.autocompleteData.map(el => ({
                            key: el.id,
                            text: `${getSafe(() => el.intProductCode, '')} ${getSafe(
                              () => el.intProductName,
                              ''
                            )}`,
                            value: el.id
                          }))}
                          inputProps={{
                            placeholder: (
                              <FormattedMessage
                                id='wantedBoard.selectProduct'
                                defaultMessage='Select Product'
                              />
                            ),
                            loading: this.props.autocompleteDataLoading,
                            'data-test': 'wanted_board_product_search_drpdn',
                            size: 'large',
                            minCharacters: 1,
                            icon: 'search',
                            search: options => options,
                            selection: true,
                            clearable: true,
                            onSearchChange: (e, { searchQuery }) =>
                              searchQuery.length > 0 && this.searchProducts(searchQuery)
                          }}
                        />
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn>
                        {inputWrapper(
                          'fobPrice',
                          {
                            min: 0,
                            type: 'number',
                            placeholder: '0.000'
                          },
                          <FormattedMessage
                            id='wantedBoard.fobPrice'
                            defaultMessage='FOB Price'
                          >
                            {text => text}
                          </FormattedMessage>,
                          currencySymbol
                        )}
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn>
                        <Dropdown
                          label={
                            <FormattedMessage
                              id='wantedBoard.manufacturer'
                              defaultMessage='Manufacturer'>
                              {text => text}
                            </FormattedMessage>
                          }
                          name='manufacturers'
                          options={searchedManufacturers}
                          inputProps={{
                            placeholder: (
                              <FormattedMessage
                                id='wantedBoard.selectManufacturer'
                                defaultMessage='Select Manufacturer'
                              />
                            ),
                            loading: searchedManufacturersLoading,
                            'data-test': 'new_inventory_grade_drpdn',
                            size: 'large',
                            icon: 'search',
                            search: options => options,
                            selection: true,
                            multiple: false,
                            onSearchChange: (e, { searchQuery }) =>
                              searchQuery.length > 0 && this.searchManufacturers(searchQuery)
                          }}
                        />
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn>
                        <Dropdown
                          label={
                            <FormattedMessage
                              id='wantedBoard.condition'
                              defaultMessage='Condition'>
                              {text => text}
                            </FormattedMessage>
                          }
                          name='conditionConforming'
                          options={listConforming}
                          inputProps={{
                            placeholder: (
                              <FormattedMessage
                                id='wantedBoard.selectCondition'
                                defaultMessage='Select Condition'
                              />
                            ),
                            'data-test': 'new_inventory_grade_drpdn',
                            selection: true,
                            clearable: true
                          }}
                        />
                      </GridColumn>
                    </GridRow>

                    <GridRow>
                      <GridColumn  width={8}>
                        <Dropdown
                          label={
                            <FormattedMessage
                              id='wantedBoard.packaging'
                              defaultMessage='Packaging'>
                              {text => text}
                            </FormattedMessage>
                          }
                          name='packagingTypes'
                          options={listPackagingTypes}
                          inputProps={{
                            placeholder: (
                              <FormattedMessage
                                id='wantedBoard.selectPackaging'
                                defaultMessage='Select Packaging'
                              />
                            ),
                            'data-test': 'new_inventory_grade_drpdn',
                            selection: true,
                            multiple: false,
                            loading: listPackagingTypesLoading
                          }}
                        />
                      </GridColumn>
                      <GridColumn  width={8}>
                        <Dropdown
                          label={
                            <FormattedMessage
                              id='wantedBoard.measurement'
                              defaultMessage='Measurement'>
                              {text => text}
                            </FormattedMessage>
                          }
                          name='measurement'
                          options={listUnits}
                          inputProps={{
                            'data-test': 'new_inventory_grade_drpdn',
                            selection: true,
                            loading: listUnitsLoading
                          }}
                        />
                      </GridColumn>
                    </GridRow>

                  </Grid>
                </FlexContent>
                <BottomButtons>
                  <div>
                    <Button
                      size='large'
                      inputProps={{ type: 'button' }}
                      onClick={() => this.props.closeDetailSidebar()}
                      data-test='sidebar_inventory_cancel'>
                      {Object.keys(touched).length || this.state.changedForm
                        ? formatMessage({ id: 'global.cancel', defaultMessage: 'Cancel' })
                        : formatMessage({ id: 'global.close', defaultMessage: 'Close' })}
                    </Button>
                    <Button
                      disabled={!(Object.keys(touched).length || this.state.changedForm)}
                      primary
                      size='large'
                      type='button'
                      onClick={() => submitForm()}
                      data-test='sidebar_inventory_save_new'>
                      {formatMessage({ id: 'global.save', defaultMessage: 'Save' })}
                    </Button>
                  </div>
                </BottomButtons>
              </FlexSidebar>
            </Form>
          )
        }}
      </Formik>
    )
  }
}

const mapDispatchToProps = {
  //sidebarDetailTrigger,
  getAutocompleteData,
  getProductConditions,
  getPackagingTypes,
  getUnits,
  searchManufacturers,
  closeDetailSidebar,
}

const mapStateToProps = ({
  wantedBoard: {
    autocompleteData,
    autocompleteDataLoading,
    listPackagingTypes,
    listPackagingTypesLoading,
    listUnits,
    listUnitsLoading,
    //  loading,
    sidebarValues,
    searchedManufacturers,
    searchedManufacturersLoading,
  }
}) => ({
  autocompleteData,
  autocompleteDataLoading,
  listPackagingTypes,
  listPackagingTypesLoading,
  listUnits,
  listUnitsLoading,
//  loading,
  sidebarValues,
  searchedManufacturers,
  searchedManufacturersLoading,
  currencySymbol: '$'
})

export default withDatagrid(connect(mapStateToProps, mapDispatchToProps)(withToastManager(injectIntl(DetailSidebar))))