import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import moment from 'moment/moment'
import { bool, objectOf, func } from 'prop-types'

import { Modal, Button, Segment, Divider, FormGroup, FormField, Table, Checkbox } from 'semantic-ui-react'
import { Form, Button as FButton, Input, Dropdown } from 'formik-semantic-ui-fixed-validation'
import Router from 'next/router'
import * as Yup from "yup";
import { errorMessages } from '~/constants/yupValidation'
import { getSafe } from '~/utils/functions'
import { FormattedMessage, injectIntl } from 'react-intl'

const formValidation = () => Yup.object().shape({
  destination: Yup.object().shape({
    zip: Yup.string().trim()
      .min(3, errorMessages.minLength(3))
      .required(errorMessages.requiredMessage),
    quantity: Yup.string()
      .required(errorMessages.requiredMessage),
  })
})

export default class ShippingQuotes extends Component {
  state = {
    selectedIndex: null,
    sQuote: null,
    quantity: '',
    initialValues: {
      destination: {
        quantity: '',
        zip: '',
        maxTransit: 0
      }
    }
  }

  componentDidMount() {
    const { initShipingForm, defaultZip } = this.props

    this.setState({initialValues: {
      ...this.state.initialValues,
      destination: {
        ...this.state.initialValues.destination,
        zip: defaultZip
      }}
    })
    initShipingForm()
  }

  createOrder = async () => {
    let payload = {
      pkgAmount: this.state.quantity,
      productOffer: this.state.sQuote.productOfferId
    }

    try {
      await this.props.addCartItem(payload)
      Router.push('/cart')
    } catch { }
  }

  getShipingQuotes(inputs) {
    const { productOfferIds, getShipingQuotes } = this.props
    const params = {
      productOfferIds: productOfferIds,
      destinationZIP: inputs.destination.zip,
      destinationCountry: 1,
      quantity: parseInt(inputs.destination.quantity),
      maxTransitDays: inputs.destination.maxTransit
    }
    getShipingQuotes(params)
  }

  renderForm() {
    const { loading, zipCodes } = this.props
    const { initialValues } = this.state

    return (
      <Form
        enableReinitialize
        ignoreLoading
        initialValues={initialValues}
        validationSchema={formValidation}
        onSubmit={(values, actions) => {
          this.getShipingQuotes(values)
        }}
      >
        <FormGroup widths='equal' data-test='ShippingQuotes_quantity_inp'>

          <Input
            name='destination.quantity' type='number' label={<FormattedMessage id='shippingQuote.shippingQuantity' defaultMessage='Shipping Quantity'>{(text) => text}</FormattedMessage>}
            inputProps={{ type: 'number', step: 1, min: 1, onChange: (_, { value }) => this.setState({ quantity: value }) }} />
          <Dropdown name='destination.zip' label={<FormattedMessage id='shippingQuote.zipCode' defaultMessage='Zip Code'>{(text) => text}</FormattedMessage>}
                    inputProps={{ search: true }} options={zipCodes} data-test='ShippingQuotes_zip_drpdn' />
          <Dropdown
            name='destination.maxTransit'
            label={<FormattedMessage id='shippingQuote.maxTransitTime' defaultMessage='Max Transit Time'>{(text) => text}</FormattedMessage>}
            options={[
              { value: 0, text: <FormattedMessage id='shippingQuote.noLimit' defaultMessage='No limit'>{(text) => text}</FormattedMessage> },
              { value: 2, text: <FormattedMessage id='shippingQuote.2Days' defaultMessage='2 days'>{(text) => text}</FormattedMessage> },
              { value: 3, text: <FormattedMessage id='shippingQuote.3Days' defaultMessage='3 days'>{(text) => text}</FormattedMessage> },
              { value: 5, text: <FormattedMessage id='shippingQuote.5Days' defaultMessage='5 days'>{(text) => text}</FormattedMessage> },
              { value: 7, text: <FormattedMessage id='shippingQuote.7Days' defaultMessage='7 days'>{(text) => text}</FormattedMessage> },
              { value: 14, text: <FormattedMessage id='shippingQuote.14Days' defaultMessage='14 days'>{(text) => text}</FormattedMessage> }
            ]}
            data-test='ShippingQuotes_maxTransit_drpdn'
          />
          <FormField>
            <label>&nbsp;</label>
            <Button type='submit' fluid disabled={loading}
                    data-test='ShippingQuotes_calculate'><FormattedMessage id='shippingQuote.calculate' defaultMessage='Calculate'>{(text) => text}</FormattedMessage></Button>
          </FormField>
        </FormGroup>
        <div>
          {this.renderShipingQuotes()}
        </div>
      </Form>
    )
  }

  renderShipingQuotes() {
    const { loading } = this.props

    return (
      <Segment basic style={{ padding: 0 }} loading={loading}>
        <Table basic='very'>
          <Table.Header>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.vendor' defaultMessage='Vendor'>{(text) => text}</FormattedMessage></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.Etd' defaultMessage='ETD'>{(text) => text}</FormattedMessage></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.serviceType' defaultMessage='Service Type'>{(text) => text}</FormattedMessage></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.fobPriceLb' defaultMessage='FOB Price/lb'>{(text) => text}</FormattedMessage></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.freightLb' defaultMessage='Freight/lb'>{(text) => text}</FormattedMessage></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.totalPriceLb' defaultMessage='Total Price/lb'>{(text) => text}</FormattedMessage></Table.HeaderCell>
            <Table.HeaderCell><FormattedMessage id='shippingQuote.totalFreight' defaultMessage='Total Freight'>{(text) => text}</FormattedMessage></Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {this.props.quotes.map((sQuote, i) => {
              let now = moment()
              let deliveryDate = sQuote.shipmentRate.estimatedDeliveryDate
              let etd = now.diff(deliveryDate, 'days') * -1 + 1

              return (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Checkbox
                      radio
                      checked={this.state.selectedIndex === i}
                      onChange={() => this.setState({ selectedIndex: i, sQuote })}
                      value={i}
                      data-test={`ShippingQuotes_row_${i}_chckb`}
                    />
                  </Table.Cell>
                  <Table.Cell>{sQuote.shipmentRate.carrierName}</Table.Cell>
                  <Table.Cell>{etd + (etd == 1 ? ' Day' : ' Days')}</Table.Cell>
                  <Table.Cell>{sQuote.shipmentRate.serviceType}</Table.Cell>
                  <Table.Cell><NumberFormat
                    value={sQuote.shipmentRate.fobPricePerLb}
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator={','}
                    decimalSeparator={'.'}
                    decimalScale={2}
                    fixedDecimalScale={true} /></Table.Cell>
                  <Table.Cell><NumberFormat
                    value={sQuote.shipmentRate.freightPricePerLb}
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator={','}
                    decimalSeparator={'.'}
                    decimalScale={2}
                    fixedDecimalScale={true} /></Table.Cell>
                  <Table.Cell><NumberFormat
                    value={sQuote.shipmentRate.totalPricePerLb}
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator={','}
                    decimalSeparator={'.'}
                    decimalScale={2}
                    fixedDecimalScale={true} /></Table.Cell>
                  <Table.Cell className='a-right'><NumberFormat
                    value={sQuote.shipmentRate.estimatedPrice}
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator={','}
                    decimalSeparator={'.'}
                    decimalScale={2}
                    fixedDecimalScale={true} /></Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Segment>
    )
  }

  render() {
    const { closeModal } = this.props.modalProps

    return (
      <Modal closeIcon onClose={closeModal} centered={false} {...this.props.modalProps}>
        <Modal.Header><FormattedMessage id='shippingQuote.header' defaultMessage='Shipping Quote'>{(text) => text}</FormattedMessage></Modal.Header>
        <Modal.Content>
          {this.renderForm()}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal} data-test='ShippingQuotes_closeModal'>
            <FormattedMessage id='global.close' defaultMessage='Close'>{(text) => text}</FormattedMessage>
          </Button>
          <Button loading={this.props.isPurchasing} disabled={!(this.state.quantity && this.state.sQuote)} primary onClick={this.createOrder} data-test='ShippingQuotes_createOrder'>
            <FormattedMessage id='shippingQuote.purchase' defaultMessage='Purchase'>{(text) => text}</FormattedMessage>
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

ShippingQuotes.propTypes = {
  modalProps: objectOf({
    open: bool,
    centered: bool,
    closeModal: func
  })
}

ShippingQuotes.defaultProps = {
  modalProps: {
    open: false,
    centered: false
  }
}