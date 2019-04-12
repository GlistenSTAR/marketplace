import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import moment from 'moment/moment'

import { Modal, Button, Segment, Grid, Divider, FormGroup, FormField, Table, Checkbox } from 'semantic-ui-react'
import {Form, Button as FButton, Input, Dropdown } from 'formik-semantic-ui'

const initialValues = {
  destination: {
    quantity: 500,
    zip: '93308',
    maxTransit: 7
  }
}

class ShippingQuotes extends Component {

  getShippingQuotes(inputs) {
    // if (checkToken(this.props)) return
    console.log(inputs)
    let params = {}
    params.productOfferIds = this.props.selectedRows
    params.destinationZIP = inputs.destination.zip
    params.destinationCountry = 1
    params.quantity = parseInt(inputs.destination.quantity)
    params.maxTransitDays = inputs.destination.maxTransit

    this.props.getShippingQuotes(params)
  }

  checkBox(value) {
    this.setState({ selectedItem: value })
  }

  renderForm() {
    const sQuotes = this.renderShippingQuotes()

    const {shippingQuotesIsFetching} = this.props

    return (
      <Form  
        enableReinitialize
        ignoreLoading
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          this.getShippingQuotes(values)
        }}
      >
        <FormGroup widths="equal">
          
            <Input name="destination.quantity" type="number" label="Shipping Quantity" />
            <Input name="destination.zip" label="Zip Code" />
          
            <Dropdown 
              name="destination.maxTransit" 
              label="Max Transit Time" 
              options={[
                { value: 0, text: 'No limit' },
                { value: 2, text: '2 days' },
                { value: 3, text: '3 days' },
                { value: 5, text: '5 days' },
                { value: 7, text: '7 days' },
                { value: 14, text: '14 days' }
              ]}
            />
            <FormField>
              <label>&nbsp;</label>
              <Button type="submit" fluid>Calculate</Button>    
            </FormField>
        </FormGroup>
        
        <Divider />

        {sQuotes}
      </Form>
    )
  }

  renderShippingQuotes() {
    const {shippingQuotesIsFetching} = this.props

    return (
      
      <Table basic="very">
        <Table.Header>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Vendor</Table.HeaderCell>
          <Table.HeaderCell>ETD</Table.HeaderCell>
          <Table.HeaderCell>Service Type</Table.HeaderCell>
          <Table.HeaderCell>FOB Price/lb</Table.HeaderCell>
          <Table.HeaderCell>Freight/lb</Table.HeaderCell>
          <Table.HeaderCell>Total Price/lb</Table.HeaderCell>
          <Table.HeaderCell>Total Freight</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
        {this.props.shippingQuotes.map((sQuote, i) => {
          let now = moment()
          let deliveryDate = sQuote.shipmentRate.estimatedDeliveryDate
          let etd = now.diff(deliveryDate, 'days') * -1 + 1

          return (
            <Table.Row key={i}>
              <Table.Cell>
                <Checkbox onChange={(value) => this.checkBox(value)} value={i} />
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
              <Table.Cell className="a-right"><NumberFormat
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
    )
  }

  render() {
    return (
      <Modal open centered={false}>
        <Modal.Header>Shipping Quote</Modal.Header>
        <Modal.Content>
          {this.renderForm()}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.removePopup}>
            Close
          </Button>
          <Button primary onClick={this.createOrder}>
            Purchase
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ShippingQuotes