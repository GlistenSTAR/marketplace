import React from 'react'
import { connect } from 'react-redux'
import * as Actions from '../../actions'
import { Modal, ModalContent, Button, Grid, Dimmer, Loader, FormGroup } from 'semantic-ui-react'
import { Form } from 'formik-semantic-ui-fixed-validation'
import { FormattedMessage, injectIntl } from 'react-intl'
import styled from 'styled-components'
import { withToastManager } from 'react-toast-notifications'

import { generateToastMarkup } from '~/utils/functions'
import UploadLot from '~/modules/inventory/components/upload/UploadLot'
import { getSafe } from '~/utils/functions'

const ModalBody = styled(ModalContent)`
  padding: 1.5rem !important;
`

const StrongTitle = styled.strong`
  display: flex;
  align-items: center;
`

const FormInputCredit = styled(Form.Input)`
  padding-right: 10px;
  padding-left: 10px;
  font-size: 12px;
`

const reasons = [
  {
    value: 1,
    label: { id: 'order.reject.SPECIFICATION_NOT_MET', defaultMessage: 'Product does not meet specification' }
  },
  {
    value: 2,
    label: { id: 'order.reject.PACKAGING_NOT_AS_DESCRIBED', defaultMessage: 'Packaging is not as described' }
  },
  {
    value: 3,
    label: { id: 'order.reject.BAD_PAPERWORK', defaultMessage: 'Paperwork is not in compliance' }
  },
  {
    value: 4,
    label: { id: 'order.reject.NOT_PROPERLY_LABELED', defaultMessage: 'Product is not properly labeled' }
  },
  {
    value: 5,
    label: {
      id: 'order.reject.DELIVERY_VEHICLE_NOT_PLACARDED',
      defaultMessage: 'Delivery vehicle is not properly placarded'
    }
  },
  {
    value: 6,
    label: {
      id: 'order.reject.DELIVERY_EQUIPMENT_NOT_AS_REQUESTED',
      defaultMessage: 'Delivery equipment was not as requested'
    }
  },
  {
    value: 7,
    label: { id: 'order.reject.OTHER', defaultMessage: 'Other' }
  }
]

class PurchaseRequestCreditDelivery extends React.Component {
  state = {
    reason: null
  }

  submitHandler = async (values, actions) => {
    const { closePopup, orderId, toastManager, creditRequest } = this.props
    const { reason, reasonText, attachments, credit } = values
    const request = {
      amount: credit,
      message: reason > 0 && reason < 7 ? `${getSafe(() => reasons[reason - 1].label.defaultMessage, '')}.` : reasonText
    }

    try {
      await creditRequest(orderId, request, attachments)
      toastManager.add(
        generateToastMarkup(
          <FormattedMessage id='order.success' defaultMessage='Success' />,
          <FormattedMessage id='order.requestCreditSend' defaultMessage='Request credit was successfully send' />
        ),
        {
          appearance: 'success'
        }
      )
      closePopup()
    } catch (e) {
      console.error(e)
    } finally {
      actions.setSubmitting(false)
    }
  }

  handleChange = (e, value, name, setFieldValue) => {
    e.preventDefault()
    this.setState({ [name]: value })
    setFieldValue(name, value)
  }

  render() {
    const {
      intl: { formatMessage },
      isSending
    } = this.props

    return (
      <>
        <Modal closeIcon onClose={() => this.props.closePopup()} open={true} size='small'>
          <Dimmer active={isSending} inverted>
            <Loader />
          </Dimmer>
          <Modal.Header>
            <FormattedMessage id='order.requestCreditPopUpHeader' defaultMessage='REQUEST CREDIT' />
          </Modal.Header>
          <ModalBody>
            <Modal.Description>
              <Form
                enableReinitialize
                onSubmit={this.submitHandler}
                className='flex stretched'
                style={{ padding: '0' }}>
                {({ values, submitForm, setFieldValue, resetForm }) => {
                  return (
                    <>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16}>
                            <StrongTitle>
                              <FormattedMessage
                                id='order.requestingCredit'
                                defaultMessage={'Requesting a credit of '}
                              />
                              <FormInputCredit
                                onChange={(e, { value, name }) => this.handleChange(e, value, name, setFieldValue)}
                                name='credit'
                                placeholder='$'
                              />
                              <FormattedMessage id='order.requestingCreditBecause' defaultMessage={' because'} />
                            </StrongTitle>
                            <FormGroup grouped>
                              {reasons.map(reason => (
                                <Form.Radio
                                  checked={this.state.reason === reason.value}
                                  onChange={(e, { value, name }) => this.handleChange(e, value, name, setFieldValue)}
                                  label={formatMessage({
                                    id: reason.label.id,
                                    defaultMessage: reason.label.defaultMessage
                                  })}
                                  name={'reason'}
                                  value={reason.value}
                                />
                              ))}

                              <Form.TextArea
                                required
                                disabled={this.state.reason !== 7}
                                onChange={(e, { value, name }) => this.handleChange(e, value, name, setFieldValue)}
                                name='reasonText'
                                label={formatMessage({
                                  id: 'order.reject.EnterReasonHere',
                                  defaultMessage: 'Enter reason here...'
                                })}
                              />
                              <UploadLot
                                {...this.props}
                                name='attachments'
                                attachments={values.attachments}
                                fileMaxSize={20}
                                onChange={files => {
                                  files.map((file, i) => {
                                    setFieldValue(`attachments[${i}]`, file)
                                  })
                                  this.setState({ changedForm: true })
                                }}
                                data-test='detail_request_credit_attachments'
                                emptyContent={
                                  <label>
                                    <FormattedMessage
                                      id='addInventory.dragDrop'
                                      defaultMessage={'Drag and drop to add file here'}
                                    />
                                    <br />
                                    <FormattedMessage
                                      id='addInventory.dragDropOr'
                                      defaultMessage={'or {link} to select from computer'}
                                      values={{
                                        link: (
                                          <a>
                                            <FormattedMessage id='global.clickHere' defaultMessage={'click here'} />
                                          </a>
                                        )
                                      }}
                                    />
                                  </label>
                                }
                                uploadedContent={
                                  <label>
                                    <FormattedMessage
                                      id='addInventory.dragDrop'
                                      defaultMessage={'Drag and drop to add file here'}
                                    />
                                    <br />
                                    <FormattedMessage
                                      id='addInventory.dragDropOr'
                                      defaultMessage={'or {link} to select from computer'}
                                      values={{
                                        link: (
                                          <a>
                                            <FormattedMessage id='global.clickHere' defaultMessage={'click here'} />
                                          </a>
                                        )
                                      }}
                                    />
                                  </label>
                                }
                              />
                            </FormGroup>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column width={10}></Grid.Column>
                          <Grid.Column floated='right' width={3}>
                            <Button
                              basic
                              fluid
                              onClick={() => {
                                resetForm()
                                this.props.closePopup()
                              }}>
                              <FormattedMessage id='global.cancel' defaultMessage='Cancel' tagName='span'>
                                {text => text}
                              </FormattedMessage>
                            </Button>
                          </Grid.Column>
                          <Grid.Column floated='right' width={3}>
                            <Button
                              disabled={
                                typeof this.state.reason !== 'number' ||
                                (this.state.reason === 7 &&
                                  (!this.state.reasonText || (this.state.reasonText && !this.state.reasonText.trim())))
                              }
                              primary
                              fluid
                              type='submit'>
                              <FormattedMessage id='global.confirm' defaultMessage='Confirm' tagName='span'>
                                {text => text}
                              </FormattedMessage>
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </>
                  )
                }}
              </Form>
            </Modal.Description>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

function mapStateToProps(state) {
  const { detail } = state.orders
  return {
    orderId: detail.id,
    isSending: state.orders.isSending
  }
}

export default connect(mapStateToProps, { ...Actions })(withToastManager(injectIntl(PurchaseRequestCreditDelivery)))