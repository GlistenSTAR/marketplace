import { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Grid, GridColumn, Modal, Divider, FormGroup, Segment, Sidebar, Dimmer, Loader, Form } from 'semantic-ui-react'
import { Input, Button, Checkbox, TextArea } from 'formik-semantic-ui-fixed-validation'
import { Formik } from 'formik'
import { bool, func, object } from 'prop-types'
import { removeEmpty, getSafe } from '~/utils/functions'

import * as Yup from 'yup'
import styled from 'styled-components'

import { withToastManager } from 'react-toast-notifications'

import { PhoneNumber } from '~/modules/phoneNumber'
import { Required } from '~/components/constants/layout'
import { addressValidationSchema, errorMessages, phoneValidation } from '~/constants/yupValidation'
import { AddressForm } from '~/modules/address-form'
import { generateToastMarkup } from '~/utils/functions'

import {
  FlexSidebar,
  FlexContent,
  HighSegment,
  BottomButtons,
} from '../../../modules/wanted-board/styles'
import ErrorFocus from '../../../components/error-focus'

const CustomSegment = styled(Segment)`
  background-color: #f8f9fb !important;
  ${props =>
    props.placeholder &&
    `
    > .grid > .divider:after {
      height: 100% !important;
    }
  `}
`

const ColumnSidebar = styled(Grid.Column)`
  padding: 0px !important;
`

const RowSidebar = styled(Grid.Row)`
  padding: 0px !important;
`

const RowSidebarAddress = styled(Grid.Row)`
  padding-top: 0px !important;
`

const initialValues = {
  addressName: '',
  contactPhone: '',
  contactName: '',
  contactEmail: '',
  address: {
    zip: '',
    city: '',
    streetAddress: '',
    province: '',
    country: ''
  },
  readyTime: null,
  closeTime: null,
  liftGate: false,
  forkLift: false,
  callAhead: false,
  deliveryNotes: ''
}

const validationScheme = Yup.lazy(values => {
  return Yup.object().shape({
    contactName: Yup.string(errorMessages.invalidString).required(errorMessages.requiredMessage),
    addressName: Yup.string().trim().min(3, errorMessages.minLength(3)).required(errorMessages.requiredMessage),
    //lastName: Yup.string(errorMessages.invalidString).required(errorMessages.requiredMessage),
    contactEmail: Yup.string().trim().email(errorMessages.invalidEmail).required(errorMessages.requiredMessage),
    contactPhone: phoneValidation(10).required(errorMessages.requiredMessage),
    address: addressValidationSchema()
  })
})

class ShippingEdit extends Component {
  state = {
    clickedNewAddressInEditMode: false
  }

  markup = ({ setFieldValue, values, setFieldTouched, errors, touched, isSubmitting, handleSubmit }) => {
    const {
      isNewAddress,
      onClose,
      isWarehouse,
      intl: { formatMessage }
    } = this.props

    return (
      <FlexSidebar visible={true} width='very wide' style={{ width: '500px' }} direction='right' animation='overlay'>
        <Dimmer inverted active={this.props.isFetching}>
          <Loader />
        </Dimmer>
        <HighSegment basic paddingLeft20>
          {isNewAddress ? (
            <FormattedMessage id='checkout.addNewAddress' defaultMessage='ADD NEW ADDRESS' />
          ) : (
            <FormattedMessage id='checkout.editAddress' defaultMessage='EDIT ADDRESS' />
          )}
        </HighSegment>
        <FlexContent>
          <Grid>
            <RowSidebar>
              <label>
                <b>
                  <FormattedMessage id='global.address' defaultMessage='Address' />
                </b>
              </label>
            </RowSidebar>
            <RowSidebarAddress>
              <ColumnSidebar>
                <AddressForm required displayHeader={false} values={values} setFieldValue={setFieldValue} />
              </ColumnSidebar>
            </RowSidebarAddress>
            <Grid.Row>
              <label>
                <b>
                  <FormattedMessage id='checkout.contactInfo' defaultMessage='Contact Info' />
                </b>
              </label>
            </Grid.Row>
            <Grid.Row>
              <CustomSegment>
                <FormGroup widths='equal'>
                  <Input
                    label={
                      <>
                        <FormattedMessage id='global.addressName' defaultMessage='Address Name' />
                        <Required />
                      </>
                    }
                    name='addressName'
                  />
                  <Input
                    label={
                      <>
                        <FormattedMessage id='global.contactName' default='Contact Name' />
                        <Required />
                      </>
                    }
                    name='contactName'
                  />
                </FormGroup>

                <FormGroup widths='equal'>
                  <PhoneNumber
                    name='contactPhone'
                    values={values}
                    label={
                      <>
                        <FormattedMessage id='global.phoneNumber' defaultMessage='Phone Number' />
                        <Required />
                      </>
                    }
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    errors={errors}
                    touched={touched}
                    isSubmitting={isSubmitting}
                  />

                  <Input
                    label={
                      <>
                        <FormattedMessage id='global.email' defaultMessage='E-mail Address' />
                        <Required />
                      </>
                    }
                    name='contactEmail'
                  />
                </FormGroup>
              </CustomSegment>
            </Grid.Row>
            <Grid.Row>
              <label>
                <b>
                  {' '}
                  <FormattedMessage id='global.additionalInfo' defaultMessage='Additional Info' />
                </b>
              </label>
            </Grid.Row>
            <Grid.Row>
              <CustomSegment>
                <Grid stackable>
                  <Grid.Row>
                    <FormGroup widths='equal'>
                      <Input
                        inputProps={{ type: 'time' }}
                        label={formatMessage({ id: 'global.readyTime', defaultMessage: 'Ready Time' })}
                        name='readyTime'
                      />
                      <Input
                        inputProps={{ type: 'time' }}
                        label={formatMessage({ id: 'global.closeTime', defaultMessage: 'Close Time' })}
                        name='closeTime'
                      />
                    </FormGroup>
                  </Grid.Row>
                  <Grid.Row>
                    <Checkbox
                      label={formatMessage({ id: 'global.liftGate', defaultMessage: 'Lift Gate' })}
                      name='liftGate'
                      inputProps={{ 'data-test': 'settings_delivery_address_liftGate_inp' }}
                    />
                  </Grid.Row>
                  <Grid.Row>
                    <Checkbox
                      label={formatMessage({ id: 'global.forkLift', defaultMessage: 'Fork Lift' })}
                      name='forkLift'
                      inputProps={{ 'data-test': 'settings_delivery_address_forklift_inp' }}
                    />
                  </Grid.Row>
                  <Grid.Row>
                    <Checkbox
                      label={formatMessage({ id: 'global.callAhead', defaultMessage: 'Call Ahead' })}
                      name='callAhead'
                      inputProps={{ 'data-test': 'settings_delivery_address_callAhead_inp' }}
                    />
                  </Grid.Row>

                  {isWarehouse && (
                    <Grid.Row>
                      <Input
                        name='taxId'
                        label={formatMessage({ id: 'global.taxId', defaultMessage: 'Tax ID' })}
                        inputProps={{
                          placeholder: formatMessage({
                            id: 'global.placeholder.taxId',
                            defaultMessage: '!Enter Tax ID'
                          })
                        }}
                      />
                    </Grid.Row>
                  )}
                  <Grid.Row>
                    <ColumnSidebar>
                      <TextArea
                        name='deliveryNotes'
                        label={formatMessage({ id: 'global.deliveryNotes', defaultMessage: 'Delivery Notes' })}
                        inputProps={{
                          placeholder: formatMessage({
                            id: 'global.placeholder.deliveryNotes',
                            defaultMessage: '!Write delivery notes here'
                          })
                        }}
                      />
                    </ColumnSidebar>
                  </Grid.Row>
                </Grid>
              </CustomSegment>
            </Grid.Row>
          </Grid>
        </FlexContent>
        <BottomButtons>
          <div>
            <Button onClick={onClose} data-test='purchase_order_shipping_edit_cancel_btn'>
              <FormattedMessage id='global.cancel' defaultMessage='Cancel'>
                {text => text}
              </FormattedMessage>
            </Button>

            <Button
              onClick={() => {
                handleSubmit()
              }}
              loading={this.props.isFetching}
              primary
              data-test='purchase_order_shipping_edit_submit_btn'>
              <FormattedMessage
                id={`global.${!isNewAddress ? 'save' : 'addNew'}`}
                defaultMessage={!isNewAddress ? 'Save' : 'Add New'}>
                {text => text}
              </FormattedMessage>
            </Button>
          </div>
        </BottomButtons>
      </FlexSidebar>
    )
  }

  handleSubmit = async values => {
    let { isNewAddress, onClose, isWarehouse } = this.props

    const { handleSubmit, toastManager } = this.props

    let payload = {}
    if (getSafe(() => values.address.id, false)) delete values.address.id
    if (getSafe(() => values.id, false)) delete values.id
    if (getSafe(() => values.cfName, false)) delete values.cfName
    if (getSafe(() => values.messages, false)) delete values.messages

    try {
      if (isWarehouse) {
        payload = {
          deliveryAddress: {
            ...values,
            contactEmail: values.contactEmail.trim(),
            address: {
              ...values.address,
              country: JSON.parse(values.address.country).countryId
            }
          },
          taxId: values.taxId,
          warehouse: true
        }
        if (getSafe(() => payload.deliveryAddress.warehouse, false)) delete payload.deliveryAddress.warehouse
        if (getSafe(() => payload.deliveryAddress.taxId, false)) delete payload.deliveryAddress.taxId
      } else {
        payload = {
          ...values,
          contactEmail: values.contactEmail.trim(),
          address: {
            ...values.address,
            country: JSON.parse(values.address.country).countryId
          }
        }
      }
      removeEmpty(payload)
      await handleSubmit(payload)

      onClose()

      let status = isNewAddress ? 'Created' : 'Updated'
      let type = isWarehouse ? 'warehouse' : 'address'

      toastManager.add(
        generateToastMarkup(
          <FormattedMessage id={`notifications.${type}${status}.header`} />,
          <FormattedMessage id={`notifications.${type}${status}.content`} values={{ name: payload.contactName }} />
        ),
        { appearance: 'success' }
      )
    } catch (e) {
      console.error(e)
    } finally {
      this.formikProps.setSubmitting(false)
    }
  }

  render() {
    let { isWarehouse, isNewAddress, shippingChanged, onClose } = this.props
    let header = null
    if (isWarehouse) {
      header = isNewAddress
        ? { id: 'checkout.addNewWarehouse', defaultMessage: '!Add New Warehouse' }
        : { id: 'checkout.editWarehouse', defaultMessage: '!Edit Warehouse' }
    } else {
      header = isNewAddress
        ? { id: 'checkout.addNewAddress', defaultMessage: 'Add New Address' }
        : { id: 'checkout.editAddress', defaultMessage: 'Edit Address' }
    }

    return (
      <Formik
        onSubmit={async values => {
          await this.handleSubmit(values)
        }}
        enableReinitialize
        initialValues={this.props.initialValues ? { ...initialValues, ...this.props.initialValues } : initialValues}
        validationSchema={validationScheme}>
        {props => {
          this.formikProps = props
          return (
            <Form>
              {this.markup(props)} <ErrorFocus />
            </Form>
          )
        }}
      </Formik>
    )
  }
}

ShippingEdit.propTypes = {
  isNewAddress: bool,
  shippingChanged: func,
  selectedAddress: object,
  savedShippingPreferences: bool
}

ShippingEdit.defaultProps = {
  isNewAddress: false,
  selectedAddress: null,
  savedShippingPreferences: false
}

export default withToastManager(injectIntl(ShippingEdit))
