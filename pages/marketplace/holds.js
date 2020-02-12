import React, { Component } from 'react'
import Layout from 'components/Layout'
import securePage from '~/hocs/securePage'
import { Marketplace } from '~/modules/marketplace'
import { injectIntl } from 'react-intl'

class HoldsPage extends Component {
  render() {
    const {
      intl: { formatMessage }
    } = this.props

    return (
      <Layout title={formatMessage({ id: 'hold.holdRequest', defaultMessage: 'Hold Requests' })}>
        <Marketplace activeIndex={2} />
      </Layout>
    )
  }
}

export default securePage(injectIntl(HoldsPage))