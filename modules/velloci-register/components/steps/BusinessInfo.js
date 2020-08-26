import React from 'react'
import PropTypes from 'prop-types'
import { Grid, GridColumn, GridRow } from 'semantic-ui-react'
import { Input } from 'formik-semantic-ui-fixed-validation'
import { FormattedMessage, injectIntl } from 'react-intl'
import styled from 'styled-components'
import { Info } from 'react-feather'

import {
  Rectangle,
  CustomDivContent,
  CustomDivInTitle,
  CustomDivTitle
} from '~/modules/cart/components/StyledComponents'
import { AddressForm } from '~/modules/address-form'

const GridBusinessInfo = styled(Grid)`
  margin: 14px 16px !important;
`

const ColumnCustom = styled(Grid.Column)`
  .ui.input input {
    background: #fdfdfd !important;
  }
`

const DivLegalAddressTitle = styled.div`
  font-weight: bold;
`

function BusinessInfo({ formikProps, intl: { formatMessage } }) {
  return (
    <GridBusinessInfo>
      <GridRow>
        <GridColumn>
          <Rectangle style={{ margin: '0px' }}>
            <CustomDivTitle>
              <Info size={20} style={{ color: '#2599d5' }} />
              <CustomDivInTitle>
                <FormattedMessage id='velloci.businessInfo.infoTitle' defaultMessage='Why do you need this info?' />
              </CustomDivInTitle>
            </CustomDivTitle>
            <CustomDivContent style={{ color: '#848893', padding: '4px 30px' }}>
              <FormattedMessage
                id='velloci.businessInfo.infoContent'
                defaultMessage='In order to verify the business you are opening an account for, we need to collect this information. We never share this information.'
              />
            </CustomDivContent>
          </Rectangle>
        </GridColumn>
      </GridRow>
      <GridRow columns={3}>
        <ColumnCustom>
          <Input
            name='phoneNumber'
            label={formatMessage({
              id: 'velloci.businessInfo.phoneNumber',
              defaultMessage: 'Personal Phone Number'
            })}
            inputProps={{
              placeholder: formatMessage({
                id: 'velloci.businessInfo.phoneNumber.placeholder',
                defaultMessage: 'Enter phone number'
              }),
              type: 'tel',
              'data-test': 'settings_velloci_registration_business_info_phone_number_inpt'
            }}
          />
        </ColumnCustom>
        <ColumnCustom>
          <Input
            name='emailAddress'
            label={formatMessage({
              id: 'velloci.businessInfo.emailAddress',
              defaultMessage: 'Personal Phone Number'
            })}
            inputProps={{
              placeholder: formatMessage({
                id: 'velloci.businessInfo.emailAddress.placeholder',
                defaultMessage: 'Enter your email address'
              }),
              type: 'email',
              'data-test': 'settings_velloci_registration_business_info_email_address_inpt'
            }}
          />
        </ColumnCustom>
        <ColumnCustom>
          <Input
            name='url'
            label={formatMessage({
              id: 'velloci.businessInfo.url',
              defaultMessage: 'URL'
            })}
            inputProps={{
              placeholder: formatMessage({
                id: 'velloci.businessInfo.url.placeholder',
                defaultMessage: 'Enter your business URL'
              }),
              type: 'url',
              'data-test': 'settings_velloci_registration_business_info_url_inpt'
            }}
          />
        </ColumnCustom>
      </GridRow>
      <GridRow>
        <GridColumn>
          <DivLegalAddressTitle>
            <FormattedMessage id='velloci.businessInfo.legalAddress' defaultMessage='Your Legal Address' />
          </DivLegalAddressTitle>

          <AddressForm values={formikProps.values} displayHeader={false} setFieldValue={formikProps.setFieldValue} />
        </GridColumn>
      </GridRow>
      <GridRow>
        <ColumnCustom>
          <Input
            name='dbaName'
            label={formatMessage({
              id: 'velloci.businessInfo.dbaName',
              defaultMessage: 'DBA Name (if applicable)'
            })}
            inputProps={{
              placeholder: formatMessage({
                id: 'velloci.businessInfo.dbaName.placeholder',
                defaultMessage: 'Business Name'
              }),
              type: 'text',
              'data-test': 'settings_velloci_registration_business_info_dba_name_inpt'
            }}
          />
          <Rectangle style={{ margin: '0px' }}>
            <CustomDivTitle>
              <Info size={20} style={{ color: '#2599d5' }} />
              <CustomDivInTitle>
                <FormattedMessage id='velloci.businessInfo.meanTitle' defaultMessage='What does this mean?' />
              </CustomDivInTitle>
            </CustomDivTitle>
            <CustomDivContent style={{ color: '#848893', padding: '4px 30px' }}>
              <FormattedMessage
                id='velloci.businessInfo.meanContent'
                defaultMessage="Unless your business has a registered trade or fictitious business name with a government body, you don't need to worry about this step"
              />
            </CustomDivContent>
          </Rectangle>
        </ColumnCustom>
      </GridRow>
    </GridBusinessInfo>
  )
}

BusinessInfo.propTypes = {
  formikProps: PropTypes.object
}

export default injectIntl(BusinessInfo)
