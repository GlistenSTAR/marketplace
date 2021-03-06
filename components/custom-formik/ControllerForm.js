import { Component } from 'react'
import { FormGroup, Popup, Icon } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Input } from 'formik-semantic-ui-fixed-validation'
import { DateInput } from '~/components/custom-formik'

import { AddressForm } from '~/modules/address-form/'
import { object, func } from 'prop-types'
import { Required } from '~/components/constants/layout'
import { getSafe } from '~/utils/functions'

class ControllerForm extends Component {
  render() {
    const {
      values,
      setFieldValue,
      intl: { formatMessage },
      fullSsnInput
    } = this.props

    return (
      <>
        <FormGroup widths='equal' data-test='settings_dwolla_dwollaController_name_inp'>
          <Input
            inputProps={{ fluid: true }}
            label={
              <>
                {formatMessage({ id: 'global.firstName', defaultMessage: 'First Name' })}
                <Required />
              </>
            }
            name='dwollaController.firstName'
          />
          <Input
            inputProps={{ fluid: true }}
            label={
              <>
                {formatMessage({ id: 'global.lastName', defaultMessage: 'Last Name' })}
                <Required />
              </>
            }
            name='dwollaController.lastName'
          />
        </FormGroup>

        <AddressForm
          countryPopup={{
            disabled: false,
            content: (
              <FormattedMessage
                id='settings.dwollaOnlyForUSA'
                defaultMessage='Dwolla is only supported for companies located in USA.'
              />
            )
          }}
          additionalCountryInputProps={{ disabled: true }}
          values={values}
          setFieldValue={setFieldValue}
          displayHeader={false}
          prefix='dwollaController'
          required={true}
        />
        <FormGroup widths='equal' data-test='settings_dwolla_dwollaController_ssnTitle_inp'>
          <Input
            inputProps={{ fluid: true }}
            label={
              fullSsnInput ? (
                <>
                  {formatMessage({ id: 'settings.ssn', defaultMessage: 'SSN' })}
                  {<Required />}
                </>
              ) : (
                <>
                  <FormattedMessage id='settings.ssn' defaultMessage='SSN'>
                    {text => (
                      <>
                        <Popup
                          trigger={<Icon name='info circle' color='blue' />}
                          content={
                            <FormattedMessage
                              id='settings.lastFourDigits'
                              defaultMessage='Enter only last four digits'
                            />
                          }
                        />
                        {text}
                      </>
                    )}
                  </FormattedMessage>
                  <Required />
                </>
              )
            }
            name='dwollaController.ssn'
          />
          <Input
            inputProps={{ fluid: true }}
            label={
              <>
                {formatMessage({ id: 'global.title', defaultMessage: 'Title' })}
                <Required />
              </>
            }
            name='dwollaController.jobTitle'
          />
          <DateInput
            inputProps={{
              fluid: true,
              clearable: true
            }}
            label={
              <>
                {formatMessage({ id: 'global.birth', defaultMessage: 'Birth' })}
                <Required />
              </>
            }
            name='dwollaController.dateOfBirth'
          />
        </FormGroup>
      </>
    )
  }
}

ControllerForm.propTypes = {
  values: object.isRequired,
  setFieldValue: func.isRequired
}

export default injectIntl(ControllerForm)
