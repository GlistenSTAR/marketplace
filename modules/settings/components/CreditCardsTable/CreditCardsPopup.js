import { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, FormGroup } from 'semantic-ui-react'
import { Form, Input, Button } from 'formik-semantic-ui-fixed-validation'
import * as Yup from 'yup'
import Router from 'next/router'
import { FormattedMessage, injectIntl } from 'react-intl'

import { closePopup, postNewCreditCardRequest } from '../../actions'
import { errorMessages } from '~/constants/yupValidation'

const formValidation = Yup.object().shape({
  cardNumber: Yup.string().trim().min(16, errorMessages.minLength(16)).required(errorMessages.requiredMessage)
})

class CreditCardsPopup extends Component {
  getInitialFormValues = () => {
    return {
      cardNumber: '',
      cvc: '',
      expirationMonth: '',
      expirationYear: ''
    }
  }

  render() {
    const {
      closePopup,
      popupValues,
      currentTab,
      postNewCreditCardRequest,
      intl: { formatMessage }
    } = this.props
    const title = popupValues ? 'Edit' : 'Add'

    return (
      <Modal closeIcon onClose={() => closePopup()} open centered={false}>
        <Modal.Header>
          {`${title} `} {currentTab}
        </Modal.Header>
        <Modal.Content>
          <Form
            initialValues={this.getInitialFormValues()}
            validationSchema={formValidation}
            onReset={closePopup}
            onSubmit={postNewCreditCardRequest}>
            <FormGroup widths='equal' data-test='settings_credit_card_cardNumberCvc_inp'>
              <Input
                type='text'
                label={formatMessage({ id: 'settings.cardNumber', defaultMessage: 'Card Number' })}
                name='cardNumber'
              />
              <Input type='text' label={formatMessage({ id: 'settings.cvc', defaultMessage: 'CVC' })} name='cvc' />
            </FormGroup>
            <FormGroup widths='equal' data-test='settings_credit_card_expiration_inp'>
              <Input
                type='text'
                label={formatMessage({ id: 'settings.expirationMonth', defaultMessage: 'Expiration Month' })}
                name='expirationMonth'
              />
              <Input
                type='text'
                label={formatMessage({ id: 'settings.expirationYear', defaultMessage: 'Expiration Year' })}
                name='expirationYear'
              />
            </FormGroup>
            <div style={{ textAlign: 'right' }}>
              <Button.Reset onClick={closePopup} data-test='settings_credit_card_reset_btn'>
                <FormattedMessage id='global.cancel' defaultMessage='Cancel' />
              </Button.Reset>
              <Button.Submit data-test='settings_credit_card_submit_btn'>
                <FormattedMessage id='global.save' defaultMessage='Save' />
              </Button.Submit>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  postNewCreditCardRequest,
  closePopup
}
const mapStateToProps = state => {
  return {
    popupValues: state.settings.popupValues
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreditCardsPopup))
