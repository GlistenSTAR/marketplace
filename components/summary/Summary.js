import React, { Component } from 'react'
import { Grid, GridColumn, Header, Segment, GridRow } from 'semantic-ui-react'
import { string, array, func, number, node } from 'prop-types'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { getSafe } from '~/utils/functions'
import { RelaxedRow, HeaderTextRow } from './styledComponents'
import { currency } from '~/constants/index'


import './styles.scss'


export default class Summary extends Component {
  render() {
    let { header, cart, totalPrice, additionalContent } = this.props
    let { cartItems } = cart

    if (cartItems.length === 0) return null

    //console.log('!!!!!! Summary Render props', this.props)

    //let totalWeight = 0
    /*
    for (let i = 0; i < cartItems.length; i++) {
      //subtotal += (cartItems[i].quantity * cartItems[i].productOffer.companyProduct.packagingSize * cartItems[i].pricing.price)
      totalWeight += cartItems[i].productOffer.companyProduct.packagingSize * cartItems[i].quantity
    }
    */

    let shipping = cart.selectedShipping ? cart.selectedShipping.quote.estimatedPrice : 0
    // let currency = getSafe(() => cartItems[0].productOffer.pricingTiers[0].pricePerUOM.currency.code, 'USD')  // ! !

    //let pricePerUnit = (totalPrice + shipping) / totalWeight
    
    return (
      <Segment>
        <Grid className='bottom-padded darker-gray' verticalAlign='middle'>
          <GridRow className='header'>
            <GridColumn>
              <Header>{header}</Header>
            </GridColumn>
          </GridRow>

          <GridColumn computer={16}>
            <Grid className='light-gray cart-item-summary'>
              <RelaxedRow columns={2}>
                <GridColumn>
                  <FormattedMessage
                    id='cart.subtotal'
                    defaultMessage='Subtotal'
                  />
                </GridColumn>

                <GridColumn>
                  <FormattedNumber
                    style='currency'
                    currency={currency}
                    value={totalPrice}
                  />

                </GridColumn>
              </RelaxedRow>

              <RelaxedRow columns={2}>
                <GridColumn>
                  <FormattedMessage
                    id='cart.estimatedShipping'
                    defaultMessage='Estimated Shipping'
                  />
                </GridColumn>

                <GridColumn>
                  {shipping > 0 &&
                    <FormattedNumber
                      style='currency'
                      currency={currency}
                      value={shipping}
                    />
                  }


                </GridColumn>
              </RelaxedRow>


              <RelaxedRow columns={2}>
                <GridColumn>
                  <FormattedMessage
                    id='cart.estimatedTax'
                    defaultMessage='Estimated Tax'
                  />
                </GridColumn>

                <GridColumn>
                  <FormattedNumber
                    style='currency'
                    currency={currency}
                    value={cart.cfPriceSubtotal}
                  />

                </GridColumn>
              </RelaxedRow>


              {/*
              <RelaxedRow columns={2}>
                <GridColumn>
                  <FormattedMessage
                    id='global.pricePer'
                    values={{ unit: cartItems[0].productOffer.companyProduct.packagingUnit.nameAbbreviation }}
                  />
                </GridColumn>

                <GridColumn>
                  <FormattedNumber
                    style='currency'
                    currency={currency}
                    value={cart.cfPricePerUomTotal}
                  />

                </GridColumn>
              </RelaxedRow>
              */}

              <HeaderTextRow columns={2}>
                <GridColumn>
                  <FormattedMessage
                    id='cart.total'
                    defaultMessage='Total'
                  />
                </GridColumn>

                <GridColumn>
                  <FormattedNumber
                    style='currency'
                    currency={currency}
                    value={totalPrice + shipping}
                  />

                </GridColumn>
              </HeaderTextRow>
              {additionalContent}
            </Grid>

          </GridColumn>
        </Grid>
      </Segment>
    )
  }
}


Summary.propTypes = {
  header: string,
  cartItems: array,
  handleContinue: func,
  totalPrice: number,
  additionalContent: node
}

Summary.defaultProps = {
  header: 'SUMMARY',
  cartItems: [],
  additionalContent: null
}